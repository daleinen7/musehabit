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
  const latestPostDate = latestPostTimestamp
    ? new Date(latestPostTimestamp)
    : null;

  const userJoinedDayOfMonth = userJoinedDate.getDate();
  const currentDayOfMonth = currentDate.getDate();

  // Calculate the number of days until the user can post or has to post
  let daysUntilNextPost = null;
  let canPost = false;

  if (!latestPostTimestamp) {
    // User has no posts, calculate days until they have to post
    if (currentDayOfMonth >= userJoinedDayOfMonth) {
      // If current day is after the join day, set days until next post to the difference between current day and join day
      daysUntilNextPost = currentDayOfMonth - userJoinedDayOfMonth;
    } else {
      // If current day is before the join day, set days until next post to the remaining days in the month plus join day
      const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();
      daysUntilNextPost =
        daysInMonth - userJoinedDayOfMonth + currentDayOfMonth;
    }
    canPost = daysUntilNextPost <= 0;
  } else {
    if (!latestPostDate) {
      // Handle the case where the latest post date is missing
      console.log('Latest post date is missing');
      return {
        canPost: false,
        daysUntilNextPost: NaN,
      };
    }

    // User has posted before, calculate days until they can post again
    const daysSinceLastPost = Math.floor(
      (currentDate.getTime() - latestPostDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    daysUntilNextPost = 30 - daysSinceLastPost;
    canPost = daysUntilNextPost <= 0;
  }

  return {
    canPost,
    daysUntilNextPost,
  };
}
