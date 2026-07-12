import { sendPriceDropAlert } from "@/lib/email";
import { scrapeProduct } from "@/lib/firecrawl";
import { createClient } from "@supabase/supabase-js";
import { Currency } from "lucide-react";
import { Supermercado_One } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Price checking endpoint is working. Use POST to trigger",
  });
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use service role to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*");

    if (productsError) throw productsError;
    console.log(`Found ${products.length} products to checks`);

    const results = {
      total: products.length,
      updated: 0,
      failed: 0,
      priceChanges: 0,
      alertSent: 0,
    };

    // here product is from database
    // also productData is for new scraped data

    for (const product of products) {
      try {
        const productData = await scrapeProduct(product.url);
        if (!productData.currentPrice) {
          results.failed++;
          continue;
        }

        const newPrice = productData.currentPrice;
        const oldPrice = product.current_price;

        await supabase
          .from("products")
          .update({
            current_price: newPrice,
            Currency: productData.currencyCode || product.currency,
            name: productData.productName || product.name,
            image_url: productData.productImageUrl || product.image_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", product.id);

        if (oldPrice !== newPrice) {
          await supabase.from("price_history").insert({
            product_id: product.id,
            price: newPrice,
            currency: productData.currencyCode || product.currency,
          });

          results.priceChanges++;
        }

        if (newPrice < oldPrice) {
          const {
            data: { user },
          } = await supabase.auth.admin.getUserById(product.user_id);

          if (user?.email) {
            // send mail
            const emailResult = await sendPriceDropAlert(
              user.email,
              product,
              oldPrice,
              newPrice,
            );

            if (emailResult?.success) {
              results.alertSent++;
            }
          }
          results.updated++;
        }
      } catch (error) {
        console.error(`Error processing product ${product.id}: `, error);
        results.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Price checked completed",
      results,
    });
  } catch (error: any) {
    console.error("Cron job error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
