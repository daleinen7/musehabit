import React, { useState, useEffect, ReactNode } from 'react';
import {
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

      const commentsData: CommentType[] = commentsSnapshot.docs.map(
        (doc) => doc.data() as CommentType
      );
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

      setComments([...comments, commentData]);
      // Clear the input field after posting the comment
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    (user || comments.length > 0) && (
      <div className="comments-section py-8 border-t-2 border-b-2 border-slate-200">
        <div className="flex justify-between">
          <h4 className="border-b-2 border-black">
            Comments ({comments.length})
          </h4>
          <button onClick={toggleShowComments} className="text-2xl">
            {showComments ? icons.comment : icons.closedComment}
          </button>
        </div>

        {showComments && (
          <div className="flex flex-col mt-8 gap-4">
            {comments.map((comment, index) => (
              <div key={index} className="flex gap-4">
                <Image
                  src={comment.photoURL || '/user-placeholder.png'}
                  alt={comment.username}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <h5>{comment.username}</h5>
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
              className="p-2 w-full border border-slate-200 rounded-md mt-2 mb-4"
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
