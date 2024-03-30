'use server';
const postmark = require('postmark');
const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_API_TOKEN);

export async function POST(req: Request) {
  const data = await req.json();

  try {
    await client.sendEmail({
      From: process.env.ADMIN_EMAIL,
      To: process.env.ADMIN_EMAIL,
      Subject: 'New Musehabit signup',
      HtmlBody: `New user ${data.username} signed up with ${data.email}.`,
      TextBody: `New user ${data.username} signed up with ${data.email}.`,
      MessageStream: 'signup-notification',
    });

    await client.sendEmail({
      From: process.env.ADMIN_EMAIL,
      To: data.email,
      Subject: 'Welcome to Musehabit',
      HtmlBody: `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Musehabit!</title>
          </head>
          <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">

            <table align="center" cellpadding="0" cellspacing="0" width="600" style="margin: auto; background-color: #ffffff; border-radius: 10px; border: 1px solid #e0e0e0;">
              <tr>
                <td style="padding: 40px;">
                  <h1 style="color: #333333; font-size: 28px; margin-bottom: 20px;">Thankyou for signing up!</h1>
                  <p style="color: #666666; font-size: 16px;">${data.username}, welcome to Musehabit - an online open-mic platform where you can share your artistic expression with the world.</p>
                  <p style="color: #666666; font-size: 16px;">We are thrilled to have you join us. Whether you're a musician, poet, painter, photographer, or any other kind of artist, Musehabit is a supportive platform for you to share your creativity.</p>
                  <p style="color: #666666; font-size: 16px;">Get started by exploring the global feed where you can discover inspiring works from fellow artists. Don't forget to customize your profile and start following other users to create your personalized following feed.</p>
                  <p style="color: #666666; font-size: 16px;">If you have any questions or need assistance, feel free to reach out to me. I'd be glad to help!</p>
                  <p style="color: #666666; font-size: 16px;">Welcome to Musehabit! I can't wait to see what you create.</p>
                  <p style="color: #666666; font-size: 16px;">Take care,</p>
                  <p style="color: #666666; font-size: 16px;"> -Doug and the rest of the Musehabit Team</p>
                </td>
              </tr>
            </table>

          </body>
          </html>`,
      TextBody: `Thankyou for signing up! ${data.username}, welcome to Musehabit - an online open-mic platform where you can share your artistic expression with the world. We are thrilled to have you join us. Whether you're a musician, poet, painter, photographer, or any other kind of artist, Musehabit is a supportive platform for you to share your creativity. Get started by exploring the global feed where you can discover inspiring works from fellow artists. Don't forget to customize your profile and start following other users to create your personalized following feed. If you have any questions or need assistance, feel free to reach out to me. I'd be glad to help! Welcome to Musehabit! I can't wait to see what you create. Take care! - Doug and the rest of the Musehabit Team`,
      MessageStream: 'signup-notification',
    });

    return Response.json({ success: 'Email sent' }, { status: 200 });
  } catch (error) {
    console.error('Error sending signup notification email:', error);
    return Response.json({ error }, { status: 500 });
  }
}
