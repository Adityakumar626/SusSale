import { Product } from "@/types/type";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPriceDropAlert(
  userEmail: string,
  product: Product,
  oldPrice: number,
  newPrice: number,
) {
  try {
    const priceDrop = oldPrice - newPrice;
    const percentageDrop =
      oldPrice > 0 ? ((priceDrop / oldPrice) * 100).toFixed(1) : "0.0";

    if (!process.env.RESEND_FROM_EMAIL) {
      throw new Error("RESEND_FROM_EMAIL is not set");
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: userEmail,
      subject: `🎉Price Drop Alert: ${product.name}`,
      html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Price Drop Alert</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    
    <!-- Wrapper Table -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; padding: 30px 10px;">
      <tr>
        <td align="center">
          
          <!-- Main Email Container -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0;">
            
            <!-- Header Banner -->
            <tr>
              <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 32px 20px; text-align: center;">
                <span style="background-color: rgba(255, 255, 255, 0.2); color: #ffffff; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: inline-block; margin-bottom: 8px;">
                  Price Drop Alert
                </span>
                <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">
                  Good news! The price just dropped 🎉
                </h1>
              </td>
            </tr>

            <!-- Card Body -->
            <tr>
              <td style="padding: 32px 28px;">
                
                <!-- Product Image -->
                ${
                  product.image_url
                    ? `
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                    <tr>
                      <td align="center">
                        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; display: inline-block;">
                          <img src="${product.image_url}" alt="${product.name}" style="max-width: 220px; max-height: 220px; width: auto; height: auto; display: block; border-radius: 6px; object-fit: contain;">
                        </div>
                      </td>
                    </tr>
                  </table>
                `
                    : ""
                }

                <!-- Product Title & Savings Badge -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
                  <tr>
                    <td style="text-align: center;">
                      <span style="background-color: #dbeafe; color: #1e40af; font-size: 13px; font-weight: 700; padding: 4px 10px; border-radius: 6px; display: inline-block; margin-bottom: 10px;">
                        Save ${percentageDrop}% Today
                      </span>
                      <h2 style="color: #0f172a; margin: 0; font-size: 20px; font-weight: 700; line-height: 1.3;">
                        ${product.name}
                      </h2>
                    </td>
                  </tr>
                </table>

                <!-- Price Breakdown Block -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 10px; margin-bottom: 28px; text-align: center;">
                  <tr>
                    <!-- Old Price -->
                    <td width="33%" style="padding: 16px 8px; border-right: 1px solid #e2e8f0;">
                      <div style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                        Was
                      </div>
                      <div style="font-size: 15px; color: #94a3b8; text-decoration: line-through; font-weight: 500;">
                        ${product.currency} ${oldPrice.toFixed(2)}
                      </div>
                    </td>
                    
                    <!-- New Price -->
                    <td width="34%" style="padding: 16px 8px; background-color: #eff6ff; border-radius: 0;">
                      <div style="font-size: 11px; font-weight: 700; color: #1d4ed8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                        Now
                      </div>
                      <div style="font-size: 22px; color: #2563eb; font-weight: 800; line-height: 1;">
                        ${product.currency} ${newPrice.toFixed(2)}
                      </div>
                    </td>

                    <!-- You Save -->
                    <td width="33%" style="padding: 16px 8px; border-left: 1px solid #e2e8f0;">
                      <div style="font-size: 11px; font-weight: 600; color: #166534; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                        You Save
                      </div>
                      <div style="font-size: 15px; color: #16a34a; font-weight: 700;">
                        ${product.currency} ${priceDrop.toFixed(2)}
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Primary CTA Button -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 12px;">
                  <tr>
                    <td align="center">
                      <a href="${product.url}" target="_blank" style="background-color: #2563eb; color: #ffffff; display: inline-block; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.25); transition: background-color 0.2s ease;">
                        Get Deal Now &rarr;
                      </a>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 20px; text-align: center; color: #64748b; font-size: 12px; line-height: 1.5;">
                <p style="margin: 0 0 8px 0;">
                  You’re receiving this automated alert because you’re tracking this item on <strong>Price Tracker</strong>.
                </p>
                <p style="margin: 0;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #2563eb; text-decoration: underline; font-weight: 500;">
                    Manage tracked items
                  </a>
                </p>
              </td>
            </tr>

          </table>
          <!-- End Main Email Container -->

        </td>
      </tr>
    </table>
    
  </body>
</html>`,
    });

    if (error) {
      console.error("Resend Error: ", error);
      return { error };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Email Error: ", error);
    return { error: error.message };
  }
}
