import React, { useState, useEffect, ReactNode } from 'react';
import {
  doc,
  getDoc,
  getDocs,
  collection,
  addDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import Image from 'next/image';
import { firestore } from '@/app/lib/firebase';
import { useAuth } from '../context/AuthContext';
import icons from '@/app/lib/icons';
import { PostType, CommentType } from '@/app/lib/types';

interface CommentsSectionProps {
  post: PostType;
  showComments: boolean;
  toggleShowComments: () => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  post,
  showComments,
  toggleShowComments,
}): ReactNode => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');

  const { user } = useAuth();

  // Get the comments for the post
  useEffect(() => {
    const getComments = async () => {
      const commentsRef = collection(firestore, `posts/${post.id}/comments`);
      const queryComments = query(commentsRef, orderBy('timestamp', 'asc'));
      const commentsSnapshot = await getDocs(queryComments);

      const commentsData: CommentType[] = [];

      for (const docSnapshot of commentsSnapshot.docs) {
        const commentData = docSnapshot.data() as CommentType;
        const commenterProfileRef = doc(
          firestore,
          'users',
          commentData.posterId
        );
        const commenterProfileSnapshot = await getDoc(commenterProfileRef);

        if (commenterProfileSnapshot.exists()) {
          const commenterProfile = commenterProfileSnapshot.data();
          commentData.commenterProfile = commenterProfile;
        }
        commentsData.push(commentData);
      }

      setComments(commentsData);
    };

    getComments();
  }, [post]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    const commentData: CommentType = {
      text: newComment,
      displayName: user.profile.displayName,
      posterId: user.uid,
      timestamp: Date.now(),
      username: user.profile.username,
      photoURL: user.profile.photoURL || undefined,
    };

    try {
      // Get a reference to the comments collection within the specific post document
      const commentsRef = collection(firestore, `posts/${post.id}/comments`);

      // Add the new comment to the comments collection
      await addDoc(commentsRef, commentData);

      commentData.commenterProfile = user.profile;

      // Add notification to artist's notifications
      const notificationRef = collection(
        firestore,
        `users/${post.posterData.uid}/notifications`
      );
      const notificationData = {
        type: 'comment',
        postId: post.id,
        commenterId: user.uid,
        timestamp: Date.now(),
      };

      await addDoc(notificationRef, notificationData);

      setComments([...comments, commentData]);
      // Clear the input field after posting the comment
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    (user || comments.length > 0) && (
      <div className="comments-section py-8 border-t-[1px] border-b-[1px] border-medium-gray-h">
        <button
          onClick={toggleShowComments}
          className="flex justify-between items-center w-full hover:text-light-purple transition-colors ease-in-out group"
        >
          <h4 className="border-b-2 border-white group-hover:border-b-light-purple transition-colors ease-in-out">
            Comments ({comments.length})
          </h4>
          <div className="text-2xl">
            {showComments ? icons.comment : icons.closedComment}
          </div>
        </button>

        {showComments && (
          <div className="flex flex-col mt-8 gap-4">
            {comments.map((comment, index) => (
              <div key={index} className="flex gap-4">
                <Image
                  src={
                    comment.commenterProfile?.photoURL ||
                    '/user-placeholder.png'
                  }
                  alt={
                    comment.commenterProfile?.displayName ||
                    comment.commenterProfile?.username
                  }
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <h5>
                    {comment.commenterProfile?.displayName ||
                      comment.commenterProfile?.username}
                  </h5>
                  <p>{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {user && showComments && (
          <form onSubmit={handleSubmit}>
            <textarea
              value={newComment}
              className="h-24 p-3 border border-dark-gray w-full bg-dark-gray rounded-md mt-4 mb-4 active:border-dark-gray-h focus:border-dark-gray-h focus-within:border-dark-gray-h focus-visible:border-dark-gray-h focus-visible:outline-dark-gray-h"
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <button className="btn btn-primary" type="submit">
              Post Comment
            </button>
          </form>
        )}
      </div>
    )
  );
};

export default CommentsSection;
