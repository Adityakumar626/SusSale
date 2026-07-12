import { Firecrawl } from "firecrawl";
import {ProductData} from "../types/type"

const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export const scrapeProduct = async (url: string) => {
  try {
    const result = await firecrawl.scrape(url, {
      formats: [
        {
          type: "json",
          prompt:
            'Extract the product name as "productName", current price as a number as "currentPrice", currency code (USD, EUR, etc) as \'currencyCode\', and product image URL as\n"ProductmageUrl" if available',
          schema: {
            type: "object",
            required: ["productName", "currentPrice"],
            properties: {
              productName: {
                type: "string",
              },
              currentPrice: {
                type: "number",
              },
              currencyCode: {
                type: "string",
              },
              productImageUrl: {
                type: "string",
              },
            },
          },
        },
      ],
    });

    const extractedData = result.json as ProductData;

    if (!extractedData || !extractedData.productName) {
      throw new Error("No data extracted from URL");
    }

    return extractedData;
  } catch (error: any) {
    console.log("Firecrawl scrape error:", error);
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
};
