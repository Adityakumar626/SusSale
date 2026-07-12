"use server";

import { scrapeProduct } from "@/lib/firecrawl";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const signOut = async () => {
  // console.log("signedout");
  const supabase = createClient();
  (await supabase).auth.signOut();
  revalidatePath("/");
  redirect("/");
};

export const addProduct = async (formData: any) => {
  const url = formData.get("url");

  if (!url) {
    return { error: "URL is required" };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Not Authenticated" };
    }

    //scraping product data with firecrawl
    const productData = await scrapeProduct(url);

    if (!productData.productName || !productData.currentPrice) {
      console.log("product-data: ", productData);
      return { error: "Could not extract product information from this URL" };
    }

    const newPrice = productData.currentPrice;
    const currency = productData.currencyCode || "USD";

    const { data: existingProduct } = await supabase
      .from("products")
      .select("id, current_price")
      .eq("user_id", user.id)
      .eq("url", url)
      .single();

    const isUpdate = !!existingProduct;

    // upsert products (insert or update based on user_id + url)
    const { data: product, error } = await supabase
      .from("products")
      .upsert(
        {
          user_id: user.id,
          url,
          name: productData.productName,
          current_price: productData.currentPrice,
          image_url: productData.productImageUrl,
          currency: productData.currencyCode,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,url", // Unique constraints on user_id + url
          ignoreDuplicates: false, // Always update if exists
        },
      )
      .select()
      .single();

    if (error) throw error;

    // Add to price history if it's a new product OR price changed
    const shouldAddHistory =
      !isUpdate || existingProduct.current_price !== newPrice;

    if (shouldAddHistory) {
      await supabase.from("price_history").insert({
        product_id: product.id,
        price: newPrice,
        currency: currency,
      });
    }

    revalidatePath("/");
    return {
      success: true,
      product,
      message: isUpdate
        ? "Product updated with latest price!"
        : "Product added successfully",
    };
  } catch (error: any) {
    console.error("Add product error: ", error);
    return { error: error.message || "failed to add the prouct" };
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) throw error;

    revalidatePath("/");
    return {
      success: true,
      message : "Product deleted successfully"
    };
  } catch (error: any) {
    return { error: error.messages };
  }
};

export const getProducts = async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Get product error: ", error);
    return [];
  }
};

export const priceHistory = async (productId: string) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("price_history")
      .select("*")
      .eq("product_id", productId)
      .order("checked_at", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Get price history error: ", error);
    return [];
  }
};
