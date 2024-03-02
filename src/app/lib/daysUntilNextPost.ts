import { firestore } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function daysUntilNextPost(userId: string) {
  const userRef = doc(firestore, 'users', userId);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    // Handle the case where the user doesn't exist
    return {
      canPost: false,
      daysUntilNextPost: null,
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
    daysUntilNextPost = userJoinedDayOfMonth - currentDayOfMonth;
    canPost = daysUntilNextPost <= 0;
  } else {
    // User has posted before, calculate days until they can post again
    const daysSinceLastPost = Math.floor(
      (Number(currentDate) - Number(latestPostDate)) / (1000 * 60 * 60 * 24)
    );
    daysUntilNextPost = 30 - daysSinceLastPost;
    canPost = daysUntilNextPost <= 0;
  }

  return {
    canPost,
    daysUntilNextPost,
  };
}
