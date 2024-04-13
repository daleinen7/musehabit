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
  const { username, displayName, pronouns, photoURL, medium } = posterData;
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
        <button
          onClick={() => setShowLightbox(true)}
          tabIndex={0}
          aria-label="expand writing post"
          className="hover:bg-medium-gray hover:transition-all hover:duration-400 hover:ease-in-out rounded-xl"
        >
          <div className="px-12 mt-8 mb-4 line-clamp-5 font-hepta text-left text-2xl font-medium hover:cursor-pointer rounded hover:bg-medium-gray hover:transition-all hover:duration-400 hover:ease-in-out">
            {post.post}
          </div>
          <div className="text-xl px-4 pb-4 w-full flex justify-end">
            {icon.expand}
          </div>
        </button>
        {showLightbox && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50  flex whitespace-pre-wrap justify-center items-center"
            onClick={() => setShowLightbox(false)}
          >
            <div className="bg-white p-8 rounded-lg max-w-[40rem] text-black overflow-y-scroll h-[90%] flex flex-col gap-2">
              <button
                className="ml-auto font-satoshi text-xsm font-bold text-slate-600 hover:text-slate-950"
                aria-label="close lightbox"
                onClick={() => setShowLightbox(false)}
              >
                close
              </button>
              <h4 className="font-Satoshi text-5xl font-bold mb-6">
                {post.title}
              </h4>
              <ReactMarkdown className={'whitespace-pre-wrap'}>
                {post.post}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </>
    ),
  };

  return (
    <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex">
      <div className="flex flex-col w-full gap-9">
        <div className="flex flex-col sm:flex-row w-full gap-4 items-start sm:items-center -pt-2">
          <div className="flex w-full items-center sm:w-auto">
            <Link
              href={`/artist/${username}`}
              className="w-16 h-16 rounded-full relative transition-all ease-in-out bg-slate-300 overflow-hidden hover:shadow-none hover:ring-2 hover:ring-medium-gray"
            >
              <Image
                src={photoURL ?? '/user-placeholder.png'}
                alt={displayName ?? username}
                width={64}
                height={64}
                className="rounded-full h-16 w-16 object-cover"
              />
            </Link>
            {user && user.uid !== posterData.uid && (
              <div className="sm:hidden items-end ml-auto">
                <FollowButton artistUid={posterData.uid} />
              </div>
            )}
          </div>
          <div className="font-satoshi">
            <Link
              href={`/artist/${username}`}
              className=" text-2xl hover:text-light-purple transition-all ease-in-out"
            >
              {displayName ?? username}
            </Link>
            <div className="flex gap-2 text-sm items-center">
              {medium && (
                <span className="flex gap-2 items-center text-light-gray">
                  <span className="text-xl">{icon.design}</span> {medium}
                </span>
              )}
              {medium && pronouns && <span className="text-xl"> | </span>}
              {pronouns && (
                <span className="flex gap-2 items-center text-light-gray">
                  <Image
                    src="/pronouns.svg"
                    alt="pronouns"
                    height={22}
                    width={22}
                    key="pronouns"
                  />
                  {pronouns}
                </span>
              )}
            </div>
          </div>
          {user && user.uid !== posterData.uid && (
            <div className="hidden sm:flex items-end ml-auto">
              <FollowButton artistUid={posterData.uid} />
            </div>
          )}
        </div>
        <div className="flex items-center">
          <div className="flex flex-col gap-2">
            <Link
              href={`/post/${id}`}
              className="font-satoshi text-2xl font-medium hover:text-light-purple transition-all ease-in-out"
            >
              {title}
            </Link>
            <div className="text-light-gray text-sm">{postedAt}</div>
          </div>
          {user && user.uid !== posterData.uid && (
            <div className="ml-auto flex gap-5">
              <SaveButton postUid={id} />
            </div>
          )}
          {user && user.uid === posterData.uid && (
            <>
              <div className="ml-auto flex gap-5 relative">
                <button onClick={toggleEditDropdown}>{icon.dots}</button>
                {showEditDropdown && (
                  <div className="absolute right-10 -top-6 bg-light-gray text-dark hover:text-black rounded-lg shadow-lg p-4">
                    <Link
                      href={`/edit-post/${id}`}
                      className="hover:text-dark-gray"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={toggleDeleteModal}
                      className="hover:text-dark-gray"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-light-gray text-dark p-4 rounded-lg shadow-lg max-w-[40rem] flex flex-col gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="ml-auto -mb-4 text-dark hover:text-dark-gray"
                >
                  {icon.close}
                </button>
                <p className="text-2xl font-bold text-center">
                  Are you sure you want to delete this post?
                </p>
                <p className="text-center">
                  This action is irreversible. If this post was uploaded within
                  the last 30 days before your next scheduled post, deleting it
                  will prevent you from posting again until your next scheduled
                  window for sharing.
                </p>
                <div className="flex justify-center mt-4">
                  <button
                    className="mr-2 border border-dark rounded-md px-12 py-2 text-dark hover:bg-dark hover:text-white hover:transition-all hover:duration-400 hover:ease-in-out"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="bg-coral text-white px-12 py-2 rounded-lg hover:bg-colral-h hover:transition-all hover:duration-400 hover:text-dark hover:ease-in-out"
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
                      className="text-sm py-[0.3125rem] px-[0.625rem] rounded-full bg-light-gray text-dark text-nowrap"
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
