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
    const settings = userDoc.data().settings;

    // Call daysUntilNextPost and log results
    const { canPost, daysUntilNextPost } = await daysUntilPost(userId);
    console.log(
      `User ${userName}: can post: ${canPost}, days until next post: ${daysUntilNextPost}`
    );

    // if days until next post is zero, send email
    if (daysUntilNextPost === 0 && settings.oneDay && canPost) {
      console.log(`User ${userName}'s last day to post!`);

      const email = await sendEmail(
        userDoc.data().email,
        'robot@musehabit.com' ?? '',
        'Musehabit - Last day to post!',
        `Hi ${userName},\n\nThis is a friendly reminder that today is your last day to post on Musehabit. We can't wait to see what you create!`,
        `Hi ${userName},\n\nThis is a friendly reminder that today is your last day to post on Musehabit. We can't wait to see what you create!`,
        'outbound'
      );
    }

    // if days until next post is 3, send email
    if (daysUntilNextPost === 3 && settings.threeDay && canPost) {
      console.log(`User ${userName} has accountability set to 3 days`);

      const email = await sendEmail(
        userDoc.data().email,
        'robot@musehabit.com' ?? '',
        'Musehabit - 3 days left to post!',
        `Hi ${userName},\n\nThis is a friendly reminder that you have 3 days left to post on Musehabit. We can't wait to see what you create!`,
        `Hi ${userName},\n\nThis is a friendly reminder that you have 3 days left to post on Musehabit. We can't wait to see what you create!`,
        'outbound'
      );

      console.log('EMAIL: ', email);
    }

    // if days until next post is 5, send email
    if (daysUntilNextPost === 5 && settings.fiveDay && canPost) {
      console.log(`User ${userName} has accountability set to 5 days`);

      const email = await sendEmail(
        userDoc.data().email,
        'robot@musehabit.com' ?? '',
        'Musehabit - 5 days left to post!',
        `Hi ${userName},\n\nThis is a friendly reminder that you have 5 days left to post on Musehabit. We can't wait to see what you create!`,
        `Hi ${userName},\n\nThis is a friendly reminder that you have 5 days left to post on Musehabit. We can't wait to see what you create!`,
        'outbound'
      );

      console.log('EMAIL: ', email);
    }

    // if days until next post is 10, send email
    if (daysUntilNextPost === 10 && settings.tenDay && canPost) {
      console.log(`User ${userName} has accountability set to 10 days`);

      const email = await sendEmail(
        userDoc.data().email,
        'robot@musehabit.com' ?? '',
        'Musehabit - 10 days left to post!',
        `Hi ${userName},\n\nThis is a friendly reminder that you have 10 days left to post on Musehabit. We can't wait to see what you create!`,
        `Hi ${userName},\n\nThis is a friendly reminder that you have 10 days left to post on Musehabit. We can't wait to see what you create!`,
        'outbound'
      );

      console.log('EMAIL: ', email);
    }

    // if days until next post is 30, send email
    if (daysUntilNextPost === 30 && settings.thirtyDay) {
      if (settings?.thirtyDay) {
        console.log(`User ${userName} has accountability set to 30 days`);

        const email = await sendEmail(
          userDoc.data().email,
          'robot@musehabit.com' ?? '',
          'Musehabit - You can post again!',
          `Hi ${userName},\n\nThis is a friendly reminder that today your window to post on Musehabit in the next 30 days has reset. We can't wait to see what you create!`,
          `Hi ${userName},\n\nThis is a friendly reminder that today your window to post on Musehabit in the next 30 days has reset. We can't wait to see what you create!`,
          'outbound'
        );

        console.log('EMAIL: ', email);
      }
    }
  }
  return Response.json({ success: true });
}
