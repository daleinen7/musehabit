'use client';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';
import getFileType from '@/app/lib/getFileType';
import SaveButton from './SaveButton';
import FollowButton from './FollowButton';
import CommentsSection from './CommentsSection';
import { PostType } from '../lib/types';

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

  const { user } = useAuth();

  const postedAt = new Date(post.postedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const toggleShowComments = () => {
    setShowComments(!showComments);
  };

  const displayFile = {
    image: (
      <div className="w-full flex justify-center items-center">
        <img src={draft} alt={title} className="rounded" />
      </div>
    ),
    video: (
      <video
        src={draft}
        controls
        className="rounded"
        width="100%"
        height="auto"
      />
    ),
    audio: (
      <div className="flex flex-col justify-center items-center gap-4">
        <Image
          src={image}
          alt={title}
          height={181}
          width={181}
          className="object-cover  rounded-s-sm h-[11.3125rem] w-[11.3125rem]"
        />
        <audio src={draft} controls className="rounded" />
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
              <h1 className="font-Satoshi text-5xl font-bold">{post.title}</h1>
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
          <div className="w-16 h-16 rounded-full relative bg-slate-300">
            <Image
              src={photoURL ?? ''}
              alt={displayName ?? username}
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>

          <div className="font-satoshi">
            <div className=" text-2xl">{displayName ?? username}</div>
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
        {displayFile[getFileType(format)] || (
          <div className="w-20 h-20 rounded-full bg-slate-300" />
        )}
        <div className="flex items-start">
          <div className="font-satoshi text-2xl font-medium">{title}</div>
          {user && user.uid !== posterData.uid && (
            <div className="ml-auto flex gap-5">
              <SaveButton postUid={id} />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium ">About this project:</h3>
          <div className="font-satoshi">{description}</div>
        </div>
        <CommentsSection
          post={post}
          showComments={showComments}
          toggleShowComments={toggleShowComments}
        />

        {(toolsUsed || tags) && (
          <div className="flex">
            {toolsUsed && (
              <div className="flex-1">
                <h3 className="text-lg font-medium ">Tools Used:</h3>
                <div className="font-satoshi">{toolsUsed}</div>
              </div>
            )}
            {tags && (
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">Tags:</h3>
                <div className="font-satoshi">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm mr-2 py-[0.3125rem] px-[0.625rem] rounded-full bg-slate-300 text-nowrap"
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
