'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { collection, addDoc, setDoc, updateDoc } from 'firebase/firestore';
import { storage, firestore } from '../lib/firebase';
import uploadFileToStorage from '../lib/uploadFileToStorage';
import { daysUntilNextPost } from '../lib/daysUntilNextPost';
import getFileType from '../lib/getFileType';
import icons from '../lib/icons';
import { doc } from 'firebase/firestore';
import { BeatLoader } from 'react-spinners';

const fileForm = [
  { label: 'Draft', input: 'draft', type: 'file', required: true },
  {
    label: 'Title of your Submission',
    input: 'title',
    type: 'text',
    required: true,
  },
  {
    label: "Description - tell us about what you've been working on!",
    input: 'description',
    type: 'textarea',
    required: false,
  },
  {
    label:
      'Preview Image - note: will not display if your submission is an image (actual image will display)',
    input: 'image',
    type: 'file',
    required: false,
  },
  {
    label: 'Tools Used - Optional: place to talk some shop',
    input: 'toolsUsed',
    type: 'text',
    required: false,
  },
  {
    label:
      'Tags - comma separate tags to categorize your work; eg: "euro americana, cyber knitting, synth folk"',
    input: 'tags',
    type: 'text',
    required: false,
  },
];

const writeForm = [
  {
    label: 'Title of your Submission',
    input: 'title',
    type: 'text',
    required: true,
  },
  {
    label: 'Share a short writing example!',
    input: 'post',
    type: 'textarea',
    required: true,
  },
  {
    label: "Description - tell us about what you've been working on!",
    input: 'description',
    type: 'textarea',
    required: false,
  },
  {
    label:
      'Tags - comma separate tags to categorize your work; eg: "euro americana, cyber knitting, synth folk"',
    input: 'tags',
    type: 'text',
    required: false,
  },
];

const allowedFileFormats = [
  'png',
  'jpg',
  'jpeg',
  'pdf',
  'mp3',
  'mp4',
  'gif',
  'webp',
  'svg',
];

interface FormData {
  title: string;
  description: string;
  image: FileList;
  draft: FileList;
  toolsUsed: string;
  tags: string;
}

interface NewPost {
  id: string;
  draft?: any; // Adjust type based on your use case
  title: string;
  description: string;
  image: string | null;
  poster: string | null; // Adjust type based on your use case
  postedAt: any; // Adjust type based on your use case
  toolsUsed?: string;
  tags: string[];
  format?: string; // Include format property when postType is 'file'
  post?: string; // Add post property when postType is 'text'
}

const Share: React.FC = () => {
  const { register, handleSubmit, watch } = useForm<FormData>();
  const [uploading, setUploading] = useState(false);
  const [shared, setShared] = useState(false);
  const [postType, setPostType] = useState<null | string>(null);
  const [selectedType, setSelectedType] = useState<null | string>(null);
  const [imagePreview, setImagePreview] = useState<null | string>(null);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleFileChange = (event: any, inputName: string) => {
    if (inputName === 'image' && event.target.files.length) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const onSubmit = async (data: any) => {
    if (!user) return;
    if (uploading) return;

    setUploading(true);
    const { title, description, image, draft, toolsUsed, tags } = data;

    // check if draft is allowed file format
    const draftFileFormat = draft && draft[0].name.split('.').pop();

    if (!allowedFileFormats.includes(draftFileFormat) && postType !== 'text') {
      console.error('Draft file format not allowed');
      alert('Draft file format not allowed');
      return;
    }

    if (!user) {
      console.error('User not found');
      alert('User not found');
      return;
    }

    const { canPost } = await daysUntilNextPost(user.uid);

    // check if user is allowed to post
    if (!canPost) {
      console.error('User not allowed to post');
      alert('User not allowed to post');
      return;
    }

    const userRef = doc(firestore, 'users', user.uid);

    const imageFile = (image && image[0]) || null;
    const draftFile = postType === 'file' ? draft[0] : null;

    const newPostRef = doc(collection(firestore, 'posts'));
    const newPostKey = newPostRef.id;

    const today = new Date();

    const imageFileName = `${
      user?.uid || 'unknownUser'
    }/${today.getFullYear()}/${today.getMonth()}/cover-image-${newPostKey}.${
      imageFile ? imageFile.name.split('.').pop() : 'unknownFormat'
    }`;

    const imageFileUrl =
      imageFile && imageFile[0]
        ? await uploadFileToStorage(storage, imageFileName, imageFile)
        : null;

    const draftFileName =
      postType === 'file'
        ? `${
            user?.uid
          }/${today.getFullYear()}/${today.getMonth()}/draft-${newPostKey}.${draftFileFormat}`
        : '';

    const draftFileUrl =
      postType === 'file' && draftFileName
        ? await uploadFileToStorage(storage, draftFileName, draftFile)
        : null;

    const tagsArray = tags
      ? tags.split(',').map((tag: string) => tag.trim())
      : null;

    const newPost: NewPost = {
      id: newPostKey || '', // Assign an empty string if newPostKey is null
      draft: postType === 'file' ? draftFileUrl : null,
      title,
      description,
      image: imageFileUrl,
      poster: user?.uid || null, // Assign null if user?.uid is undefined
      postedAt: Date.now(),
      tags: tagsArray,
    };

    if (postType === 'file') {
      newPost.draft = draftFileUrl;
      newPost.image = imageFileUrl;
      newPost.draft = draftFileUrl;
      newPost.toolsUsed = toolsUsed;
      newPost.format = draftFileFormat;
    }
    if (postType === 'text') {
      newPost.post = data.post;
    }

    await setDoc(newPostRef, newPost);

    setShared(true);

    if (user) {
      await updateDoc(userRef, {
        [`posts.${newPostKey}`]: true,
        latestPost: Date.now(),
      });
    }

    return;
  };

  if (shared === true)
    return (
      <p className="font-satoshi font-bold text-3xl mt-24">
        Thanks for sharing!
      </p>
    );

  if (!user)
    return (
      <p>
        <BeatLoader /> Loading...
      </p>
    );

  return (
    <>
      <h2 className="font-satoshi text-4xl font-bold mt-12">
        {user.profile.latestPost ? 'New Post' : 'First Post'}
      </h2>
      <p className="py-10">
        It&apos;s your day to post! Upload your art, whether it&apos;s finished
        or not!
      </p>
      {postType === null ? (
        <div className="flex flex-col gap-6 items-end">
          <div className="flex gap-6">
            {[
              { icon: icons.write, text: "I'm Writing", type: 'text' },
              {
                icon: icons.upload,
                text: "I'm Uploading a File",
                type: 'file',
              },
            ].map((type) => (
              <button
                key={type.text}
                className={`flex flex-col items-center justify-center py-12 px-5 border-2 rounded w-72 bg-${
                  type.type === selectedType ? 'slate-200' : 'white'
                } hover:bg-slate-100 bg`}
                onClick={() => setSelectedType(type.type)}
              >
                <div>{type.icon}</div>
                <div>{type.text}</div>
              </button>
            ))}
          </div>
          {selectedType && (
            <button
              className="btn btn-primary"
              onClick={() => setPostType(selectedType)}
            >
              Next
            </button>
          )}
        </div>
      ) : postType === 'text' ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8 w-full width-wrapper mb-12 items-end"
        >
          {writeForm.map((formInput) => {
            return (
              <React.Fragment key={formInput.label}>
                <ShareInput
                  key={formInput.label}
                  formInput={formInput}
                  register={register}
                  handleFileChange={handleFileChange}
                />
                {imagePreview && formInput.type === 'file' && (
                  <Image
                    src={imagePreview}
                    alt="Image Preview"
                    className="w-1/4"
                  />
                )}
              </React.Fragment>
            );
          })}

          <input
            type="submit"
            value="Share Your Post"
            className="btn btn-primary"
            disabled={uploading}
          />
        </form>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8 w-full width-wrapper mb-12 items-end"
        >
          {fileForm.map((formInput) => {
            // Check if the current formInput is for the "image" input
            const isImageInput = formInput.input === 'image';

            const draftFile = watch('draft') as FileList;
            const draftFileExtension =
              draftFile?.[0]?.name?.split('.').pop()?.toLowerCase() || '';

            const draftFileType = getFileType(draftFileExtension);

            // Conditionally render the "image" input only if the "draft" input is not an image
            if (isImageInput && draftFileType === 'image') {
              return null; // Don't render the "image" input
            }

            return (
              <React.Fragment key={formInput.label}>
                <ShareInput
                  key={formInput.label}
                  formInput={formInput}
                  register={register}
                  handleFileChange={handleFileChange}
                />
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt="Image Preview"
                    className="w-1/4"
                  />
                )}
              </React.Fragment>
            );
          })}
          {uploading ? (
            <BeatLoader color="#F24236" />
          ) : (
            <input
              type="submit"
              value="Submit"
              className="btn btn-primary cursor-pointer"
              disabled={uploading}
            />
          )}
        </form>
      )}
    </>
  );
};
export default Share;

const ShareInput = ({
  formInput,
  register,
  handleFileChange,
}: {
  formInput: any;
  register: any;
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    input: string
  ) => void;
}) => {
  const { label, input, type, required, options } = formInput;
  return (
    <label key={input} className="flex flex-col text-sm font-medium w-full">
      {label}
      {type === 'textarea' ? (
        <textarea
          className="p-2 m-2 text-black rounded-md border-2 border-gray-400 min-h-[22rem]"
          {...register(input)}
        />
      ) : type === 'select' ? (
        <select className="p-2 m-2 text-black rounded-md" {...register(input)}>
          {options.map((option: string) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === 'file' ? (
        <>
          <input
            className="p-2 m-2 text-black rounded-md border-2 border-gray-400 border-dashed"
            type={type}
            onChange={(event) => handleFileChange(event, input)}
            {...register(input)}
          />
        </>
      ) : (
        <input
          className="p-2 m-2 text-black rounded-md border-2 border-gray-400"
          type={type}
          {...register(input)}
        />
      )}
      {/* {errors[input] && <span>This field is required</span>} */}
    </label>
  );
};
