import { firestore } from '../lib/firebase';
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { PostType } from '../lib/types';

export const getPostById = async (postId: string): Promise<PostType | null> => {
  try {
    const postRef = doc(collection(firestore, 'posts'), postId);
    const postSnapshot = await getDoc(postRef);

    if (postSnapshot.exists()) {
      const post = postSnapshot.data();
      const posterRef = doc(firestore, 'users', post.poster);
      const posterSnapshot = await getDoc(posterRef);
      const posterData = posterSnapshot.data() as PostType['posterData'];
      return { ...post, posterData } as PostType;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
};

export const updatePost = async (
  postId: string,
  postData: any
): Promise<void> => {
  try {
    const postRef = doc(collection(firestore, 'posts'), postId);
    await updateDoc(postRef, postData);
  } catch (error) {
    console.error('Error updating post:', error);
  }
};

export const deletePost = async (postId: string): Promise<void> => {
  try {
    await deleteDoc(doc(collection(firestore, 'posts'), postId));
  } catch (error) {
    console.error('Error deleting post:', error);
  }
};
