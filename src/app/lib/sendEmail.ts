'use server';
const postmark = require('postmark');
const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_API_TOKEN);

const sendEmail = async (
  to: string,
  from: string,
  subject: string,
  htmlBody: string,
  textBody: string,
  messageStream: string
) => {
  try {
    await client.sendEmail({
      From: from,
      To: to,
      Subject: subject,
      HtmlBody: htmlBody,
      TextBody: textBody,
      MessageStream: messageStream,
    });

    return { success: 'Email sent', status: 200 };
  } catch (error) {
    console.error('Error sending signup notification email:', error);
    return { error, status: 500 };
  }
};

export default sendEmail;
