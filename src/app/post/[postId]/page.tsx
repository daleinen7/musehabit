'use client';
import { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { getPostById } from '../../lib/posts';
import { PostType } from '../../lib/types';
import Post from '../../components/Post';

const PostPage = ({ params }: { params: { postId: string } }) => {
  const { postId } = params;
  const [post, setPost] = useState<PostType | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (postId) {
        try {
          const postData = await getPostById(postId as string);
          setPost(postData);
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      }
    };

    fetchPost();
  }, [postId]);

  console.log(post);

  return (
    <div className="flex justify-center items-center min-h-[screen] py-12">
      {post ? <Post post={post} /> : <BeatLoader color="#F24236" />}
    </div>
  );
};

export default PostPage;
