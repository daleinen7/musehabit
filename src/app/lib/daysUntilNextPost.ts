import { firestore } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function daysUntilNextPost(userId: string) {
  const userRef = doc(firestore, 'users', userId);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    // Handle the case where the user doesn't exist
    console.log('User does not exist');
    return {
      canPost: false,
      daysUntilNextPost: NaN,
    };
  }

  const userData = userSnapshot.data();
  const userJoinedTimestamp = userData?.joined;
  const latestPostTimestamp = userData?.latestPost;

  const currentDate = new Date();
  const userJoinedDate = new Date(userJoinedTimestamp);

  const daysSinceJoin = Math.floor(
    (currentDate.getTime() - userJoinedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  let daysUntilNextPost = null;
  let canPost = false;

  // Calculate days until next post based on user's join date
  const daysIntoCycle = daysSinceJoin % 30;
  daysUntilNextPost = 30 - daysIntoCycle;

  if (latestPostTimestamp) {
    // Check if the latest post falls within the current or previous 30-day period
    const latestPostDate = new Date(latestPostTimestamp);
    const daysSinceLastPost = Math.floor(
      (currentDate.getTime() - latestPostDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // console.log('latest post date: ', latestPostDate);
    // console.log('days since last post: ', daysSinceLastPost);
    // console.log('days into cycle: ', daysIntoCycle);

    // console.log('days: since timeframe started: ', daysSinceJoin % 30);

    // console.log('can post: ', canPost);

    // Check if the latest post falls within the current or previous 30-day period
    // if days since last post is less than the difference between the days until next post + 30

    // take the date you started, and then divide that into 30 and then get the remainder, and that’s how many days into the month your at. Then you minus 30 and that’s how many days you have left to post.
    if (daysSinceLastPost <= daysSinceJoin % 30) {
      canPost = false; // User has already posted within the current or previous 30-day period
    } else {
      canPost = true; // User can post as they haven't posted in the current or previous 30-day period
    }
  } else {
    // User has never posted
    canPost = true;
  }

  return {
    canPost,
    daysUntilNextPost,
  };
}
