'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { collection, setDoc, updateDoc } from 'firebase/firestore';
import { storage, firestore } from '../lib/firebase';
import uploadFileToStorage from '../lib/uploadFileToStorage';
import { daysUntilNextPost } from '../lib/daysUntilNextPost';
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
  // {
  //   label: 'Preview Image - Optional: for audio posts ',
  //   input: 'image',
  //   type: 'file',
  //   required: false,
  // },
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
  'jpg',
  'jpeg',
  'png',
  'gif',
  'svg',
  'webp',
  'mp3',
  'oog',
  'aac',
  'mp4',
  'avi',
  'mkv',
  'mov',
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
  const { register, handleSubmit, setValue, watch } = useForm<FormData>();
  const [uploading, setUploading] = useState(false);
  const [shared, setShared] = useState(false);
  const [postType, setPostType] = useState<null | string>(null);
  const [selectedType, setSelectedType] = useState<null | string>(null);
  const [imagePreview, setImagePreview] = useState<null | string>(null);

  const { user } = useAuth();
  const router = useRouter();

  const watchDraft = watch('draft');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    input: any
  ) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    const file = files[0];

    if (file.type && file.type.startsWith('image')) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleDrop = (e: any, input: any) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    setValue('draft', e.dataTransfer.files);

    if (file.type && file.type.startsWith('image')) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const onSubmit = async (data: any) => {
    if (!user) return;
    if (uploading) return;

    setUploading(true);
    const { title, description, image, draft, toolsUsed, tags } = data;

    console.log('Draft: ', draft);

    // check if draft is allowed file format
    const draftFileFormat = draft && draft[0]?.name.split('.').pop();

    if (!allowedFileFormats.includes(draftFileFormat) && postType !== 'text') {
      console.error('Draft file format not allowed');
      alert('Draft file format not allowed');
      setUploading(false);
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
      ? tags
          .split(',')
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag !== '')
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
                className={`flex flex-col items-center justify-center py-12 px-5 rounded w-72 gap-2 ${
                  type.type === selectedType
                    ? 'bg-light-purple text-black'
                    : 'bg-dark-gray hover:bg-dark-gray-h'
                } `}
                onClick={() => setSelectedType(type.type)}
              >
                <div className="text-3xl">{type.icon}</div>
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
                  handleDragOver={handleDragOver}
                  handleDrop={handleDrop}
                />
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
            return (
              <React.Fragment key={formInput.label}>
                <ShareInput
                  key={formInput.label}
                  formInput={formInput}
                  register={register}
                  handleFileChange={handleFileChange}
                  handleDragOver={handleDragOver}
                  handleDrop={handleDrop}
                  imagePreview={imagePreview}
                  watchDraft={watchDraft}
                />
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
  handleDragOver,
  handleDrop,
  imagePreview,
  watchDraft,
}: {
  formInput: any;
  register: any;
  handleDragOver: (e: any) => void;
  handleDrop: (e: any, input: any) => void;
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    input: any
  ) => void;
  imagePreview?: string | null;
  watchDraft?: any;
}) => {
  const { label, input, type, required, options } = formInput;

  return (
    <label
      key={input}
      htmlFor={label}
      className="flex flex-col text-sm font-medium w-full"
    >
      {label !== 'Draft' && label}
      {type === 'textarea' ? (
        <textarea
          className="p-2 m-2 text-light-gray bg-dark-gray rounded-md min-h-[22rem]"
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
          <div
            className="flex flex-col items-center justify-center w-full border-2 p-4 border-dashed rounded-lg cursor-pointer hover:bg-bray-800 bg-dark  border-medium-gray hover:border-medium-gray hover:bg-dark-gray"
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, input)}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-light-gray"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-xl text-light-gray">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-light-gray">File types allowed:</p>
              <ul>
                <li>image: jpg, jpeg, png, gif, svg, webp</li>
                <li>video: mp4, avi, mkv, mov</li>
                <li>audio: mp3, ogg, aac</li>
              </ul>
            </div>
            {watchDraft && watchDraft[0]?.name && (
              <p className="text-light-gray font-hepta">
                File: {watchDraft[0]?.name}
              </p>
            )}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Image Preview"
                className="max-w-[50%] max-h-[50%] rounded-md object-cover"
              />
            )}
          </div>
          <input
            type="file"
            id={label}
            className="hidden"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFileChange(e, input)
            }
            {...register(input)}
          />
        </>
      ) : (
        <input
          className="p-2 m-2 text-light-gray rounded-md bg-dark-gray"
          type={type}
          {...register(input)}
        />
      )}
      {/* {errors[input] && <span>This field is required</span>} */}
    </label>
  );
};
