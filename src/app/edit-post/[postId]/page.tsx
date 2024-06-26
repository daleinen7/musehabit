'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getPostById, updatePost } from '../../lib/posts';
import getFileType from '../../lib/getFileType';
import { PostType } from '../../lib/types';
import { BeatLoader } from 'react-spinners';
import { useAuth } from '@/app/context/AuthContext';

const EditPost = ({ params }: { params: { postId: string } }) => {
  const { postId } = params;

  const [post, setPost] = useState<PostType | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    toolsUsed: '',
    tags: [] as string[] | null,
  });
  // const [imagePreview, setImagePreview] = useState<null | string>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

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

  // const handleFileChange = (event: any, inputName: string) => {
  //   if (inputName === 'image' && event.target.files.length) {
  //     const file = event.target.files[0];
  //     const imageUrl = URL.createObjectURL(file);
  //     setImagePreview(imageUrl);
  //   }
  // };

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;

    if (name === 'tags') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value.split(','),
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Trim whitespace from tags
      const trimmedTags = formData.tags?.map((tag: string) => tag.trim());
      const trimmedFormData = { ...formData, tags: trimmedTags };
      await updatePost(postId as string, trimmedFormData);
      router.push(`/post/${postId}`);
    } catch (error) {
      console.error('Error updating post:', error);
      setIsSubmitting(false);
    }
  };

  if (!post) {
    return (
      <div>
        Loading... <BeatLoader color="#F24236" />
      </div>
    );
  }

  return (
    <>
      <h2 className="font-satoshi text-4xl font-bold mt-12">Edit Post</h2>
      <form
        className="flex flex-col gap-8 w-full mb-12 items-center max-w-[40rem] mx-auto mt-8"
        onSubmit={handleSubmit}
      >
        <label className="flex flex-col gap-2 w-full">
          Title:
          <input
            className="text-white input-shadow bg-medium-gray p-[0.625rem] border border-input-gray rounded-md w-full"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
          />
        </label>
        <label className="flex flex-col gap-2 w-full">
          Description:
          <textarea
            className="text-white input-shadow bg-medium-gray p-[0.625rem] border border-input-gray rounded-md w-full"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
          ></textarea>
        </label>
        {/* {getFileType(post.format) === 'audio' && (
          <>
            <label htmlFor="image">
              Image:
              <input
                className="text-black p-[0.625rem] border border-black rounded-md w-full"
                type="file"
                name="image"
                onChange={(e) => handleFileChange(e, 'image')}
              />
            </label>
            {imagePreview && (
              <Image
                src={imagePreview}
                alt={`preview of audio image`}
                height={181}
                width={181}
                className="object-cover  rounded-s-sm h-[11.3125rem] w-[11.3125rem]"
              />
            )}
          </>
        )} */}
        <label className="flex flex-col gap-2 w-full">
          Tools Used:
          <input
            className="text-white input-shadow bg-medium-gray p-[0.625rem] border border-input-gray rounded-md w-full"
            type="text"
            name="toolsUsed"
            value={formData.toolsUsed}
            onChange={handleFormChange}
          />
        </label>
        <label className="flex flex-col gap-2 w-full">
          Tags:
          <input
            className="text-white input-shadow bg-medium-gray p-[0.625rem] border border-input-gray rounded-md w-full"
            type="text"
            name="tags"
            value={formData.tags ? formData.tags.join(',') : ''}
            onChange={handleFormChange}
          />
        </label>
        {isSubmitting ? (
          <BeatLoader color="#F24236" />
        ) : (
          <button className="btn btn-primary" type="submit">
            Save Changes
          </button>
        )}
      </form>
    </>
  );
};

export default EditPost;
