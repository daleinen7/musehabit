'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';
import getFileType from '@/app/lib/getFileType';
import SaveButton from './SaveButton';
import FollowButton from './FollowButton';
import CommentsSection from './CommentsSection';
import { PostType } from '../lib/types';
import { deletePost } from '@/app/lib/posts';
import icon from '@/app/lib/icons';

const Post = ({ post }: { post: PostType }) => {
  const {
    id,
    title,
    description,
    image,
    draft,
    format,
    posterData,
    toolsUsed,
    tags,
  } = post;
  const { username, displayName, location, photoURL, medium } = posterData;
  const [showLightbox, setShowLightbox] = useState<boolean>(false);
  const [showComments, setShowComments] = useState(false);
  const [showEditDropdown, setShowEditDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  const postedAt = new Date(post.postedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const toggleShowComments = () => {
    setShowComments(!showComments);
  };

  const toggleEditDropdown = () => {
    setShowEditDropdown(!showEditDropdown);
  };

  const toggleDeleteModal = () => {
    setShowEditDropdown(false);
    setShowDeleteModal(!showDeleteModal);
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(id);
      setShowDeleteModal(false);
      router.push('/');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const displayFile = {
    image: (
      <div className="w-full flex justify-center items-center max-h-[98vh]">
        <img src={draft} alt={title} className="rounded max-h-[98vh]" />
      </div>
    ),
    video: (
      <video
        src={draft}
        controls
        className="rounded max-h-[98vh]"
        width="100%"
        height="auto"
      />
    ),
    audio: (
      <div className="flex flex-col justify-center items-center gap-4">
        {image && (
          <Image
            src={image}
            alt={title}
            height={181}
            width={181}
            className="object-cover  rounded-s-sm h-[11.3125rem] w-[11.3125rem]"
          />
        )}
        <audio
          src={draft}
          controls
          controlsList="nodownload noplaybackrate"
          className="rounded"
        />
      </div>
    ),
    writing: (
      <>
        <div
          onClick={() => setShowLightbox(true)}
          tabIndex={0}
          aria-label="expand writing post"
          className="px-12 my-8 line-clamp-5 font-hepta whitespace-pre-wrap text-2xl font-medium hover:cursor-pointer rounded hover:bg-slate-300 hover:transition-all hover:duration-400 hover:ease-in-out"
        >
          {post.post}
        </div>
        {showLightbox && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50  flex whitespace-pre-wrap justify-center items-center"
            onClick={() => setShowLightbox(false)}
          >
            <div className="bg-white p-8 rounded-lg max-w-[40rem]  overflow-y-scroll h-[90%] flex flex-col gap-2">
              <button
                className="ml-auto font-satoshi text-xsm font-bold text-slate-600 hover:text-slate-950"
                aria-label="close lightbox"
                onClick={() => setShowLightbox(false)}
              >
                close
              </button>
              <h4 className="font-Satoshi text-5xl font-bold">{post.title}</h4>
              <ReactMarkdown>{post.post}</ReactMarkdown>
            </div>
          </div>
        )}
      </>
    ),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex">
      <div className="flex flex-col w-full gap-9">
        <div className="flex w-full gap-4 items-center -pt-2">
          <Link
            href={`/artist/${username}`}
            className="w-16 h-16 rounded-full relative bg-slate-300"
          >
            <Image
              src={photoURL ?? '/user-placeholder.png'}
              alt={displayName ?? username}
              width={64}
              height={64}
              className="rounded-full h-16 w-16 object-cover"
            />
          </Link>
          <div className="font-satoshi">
            <Link
              href={`/artist/${username}`}
              className=" text-2xl hover:text-slate-700"
            >
              {displayName ?? username}
            </Link>
            <div className="text-sm">
              {[medium, location, postedAt].filter(Boolean).join(' | ')}
            </div>
          </div>
          {user && user.uid !== posterData.uid && (
            <div className="items-end ml-auto">
              <FollowButton artistUid={posterData.uid} />
            </div>
          )}
        </div>
        <div className="flex items-start">
          <div className="font-satoshi text-2xl font-medium">{title}</div>
          {user && user.uid !== posterData.uid && (
            <div className="ml-auto flex gap-5">
              <SaveButton postUid={id} />
            </div>
          )}
          {user && user.uid === posterData.uid && (
            <div className="ml-auto flex gap-5 relative">
              <button onClick={toggleEditDropdown}>{icon.dots}</button>
              {showEditDropdown && (
                <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg p-4">
                  <Link href={`/edit-post/${id}`}>Edit</Link>
                  <button onClick={toggleDeleteModal}>Delete</button>
                </div>
              )}
            </div>
          )}
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded-lg shadow-lg max-w-[40rem] flex flex-col gap-4">
                <p>Are you sure you want to delete this post?</p>
                <p>
                  This action is irreversible. If this post was uploaded within
                  the last 30 days before your next scheduled post, deleting it
                  will prevent you from posting again until your next scheduled
                  window for sharing.
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    className="mr-2"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {displayFile[getFileType(format)] || (
          <div className="w-20 h-20 rounded-full bg-slate-300" />
        )}
        <div>
          <h4 className="text-lg font-medium ">About this project:</h4>
          <div className="font-satoshi whitespace-pre-wrap">{description}</div>
        </div>
        <CommentsSection
          post={post}
          showComments={showComments}
          toggleShowComments={toggleShowComments}
        />

        {(toolsUsed || tags) && (
          <div className="flex gap-4 flex-col sm:flex-row">
            {toolsUsed && (
              <div className={`flex-1 ${tags && 'max-w-[50%]'}`}>
                <h4 className="text-lg font-medium ">Tools Used:</h4>
                <div className="font-satoshi">{toolsUsed}</div>
              </div>
            )}
            {tags && (
              <div className={`flex-1 ${toolsUsed && 'max-w-[50%]'}`}>
                <h4 className="text-lg font-medium mb-2">Tags:</h4>
                <div className="font-satoshi flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm py-[0.3125rem] px-[0.625rem] rounded-full bg-slate-300 text-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Post;
