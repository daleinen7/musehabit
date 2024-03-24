'use server';
const postmark = require('postmark');
const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_API_TOKEN);

export async function POST(
  req: { body: { email: any } },
  res: { send: (arg0: string) => void }
) {
  console.log('Sending email');

  console.log('REQ: ', req.body);

  try {
    const response = client.sendEmail({
      From: 'doug@musehabit.com',
      To: 'doug@musehabit.com',
      Subject: 'New Musehabit Signup!',
      HtmlBody: '<strong>Hello</strong> dear Postmark user.',
      TextBody: 'Hello dear Postmark user.',
      MessageStream: 'signup-notification',
    });

    console.log('Signup notification email sent:', response);
  } catch (error) {
    console.error('Error sending signup notification email:', error);
  }
}
