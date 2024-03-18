'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPostById, updatePost } from '../../lib/posts'; 
import { PostType } from '../../lib/types';

const EditPost = ({ params }: { params: { postId: string } }) => {
  const { postId } = params; 

  const [post, setPost] = useState<PostType | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    toolsUsed: '',
    tags: [] as string[] | null,
  });

  const router = useRouter();
  
  useEffect(() => {
    // Fetch post data by postId when the component mounts
    const fetchPostData = async () => {
      if (postId) {
        const postData = await getPostById(postId as string); 
        setPost(postData); 
        setFormData({
          title: postData?.title ?? '',
          description: postData?.description ?? '',
          toolsUsed: postData?.toolsUsed ?? '',
          tags: postData?.tags ?? [],
        });
      }
    };

    if (postId) {
      fetchPostData();
    }
  }, [postId]);

  const handleFormChange = (e: any ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await updatePost(postId as string, formData); // Implement this function to update post data
      router.push(`/post/${postId}`); // Redirect to the post detail page after successful update
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  if (!post) {
    return <div>Loading...</div>; // Show loading indicator while fetching post data
  }

  return (
    <div>
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFormChange}
          ></textarea>
        </div>
        <div>
          <label>Tools Used:</label>
          <input
            type="text"
            name="toolsUsed"
            value={formData.toolsUsed}
            onChange={handleFormChange}
          />
        </div>
        <div>
          <label>Tags:</label>
          <input
            type="text"
            name="tags"
            value={formData.tags ? formData.tags.join(',') : ''}
            onChange={handleFormChange}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditPost;
