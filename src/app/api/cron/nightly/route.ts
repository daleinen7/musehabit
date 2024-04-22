'use server';
import type { NextRequest } from 'next/server';
import { firestore } from '@/app/lib/firebase';
import { getDocs, collection } from 'firebase/firestore';
import { daysUntilNextPost as daysUntilPost } from '@/app/lib/daysUntilNextPost';
import sendEmail from '@/app/lib/sendEmail';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  console.log('Running nightly cron job');
  // Get all users from Firestore
  const usersSnapshot = await getDocs(collection(firestore, 'users'));

  // Loop through each user
  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const userName = userDoc.data().username;
    const latestPost = userDoc.data().latestPost;
    const settings = userDoc.data().settings;

    const postedInLast30Days =
      latestPost > Date.now() - 30 * 24 * 60 * 60 * 1000;

    // Call daysUntilNextPost and log results
    const { canPost, daysUntilNextPost } = await daysUntilPost(userId);
    console.log(
      `User ${userName}: can post: ${canPost}, days until next post: ${daysUntilNextPost}`
    );

    // if days until next post is zero, send email
    if (daysUntilNextPost === 0) {
      console.log(`User ${userName}'s day to post!`);

      if (!postedInLast30Days && settings.accountabilityNotice) {
        console.log(`User ${userName} has not posted in the last 30 days`);
      }

      if (settings.thirtyDay) {
        console.log(`User ${userName} has accountability set to 30 days`);

        const email = await sendEmail(
          userDoc.data().email,
          process.env.ADMIN_EMAIL ?? '',
          'Musehabit - You can post again!',
          `Hi ${userName},\n\nThis is a friendly reminder that today your window to post on Musehabit in the next 30 days has reset. We can't wait to see what you create!`,
          `Hi ${userName},\n\nThis is a friendly reminder that today your window to post on Musehabit in the next 30 days has reset. We can't wait to see what you create!`,
          'outbound'
        );

        console.log('EMAIL: ', email);
      }
    }

    // if days until next post is zero and they have not posted in the last 30 days, add post based on their accountability settings

    // if user has not posted and days until next post is 10, and user has reminder to true send reminder email

    // if user has not posted and days until next post is 5, and user has reminder to true send reminder email

    // if user has not posted and days until next post is 1, and user has reminder to true send reminder email
  }
  return Response.json({ success: true });
}
