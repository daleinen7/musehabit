'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  collection,
  query,
  orderBy,
  where,
  doc,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { BeatLoader } from 'react-spinners';
import { firestore } from './lib/firebase';
import Post from './components/Post';
import { PostType } from './lib/types';

export default function Home() {
  const [posts, setPosts] = useState<PostType[] | null>([]);
  const [selectedFeed, setSelectedFeed] = useState<
    null | 'global' | 'following'
  >(null);
  const { user } = useAuth();
  // if (user) {
  //   console.log('if user', user);
  // }

  useEffect(() => {
    if (user) {
      setSelectedFeed(user?.profile?.settings?.defaultFeed || 'global');
    }
  }, [user]);

  useEffect(() => {
    const fetchPosts = async () => {
      let postsRef;

      if (selectedFeed === 'global' || !user) {
        const postsRef = collection(firestore, 'posts');
        const postsSnapshot = await getDocs(
          query(postsRef, orderBy('postedAt', 'desc'))
        );
        const postsData = postsSnapshot.docs.map((doc) => doc.data());
        const postsWithUserData = await Promise.all(
          postsData.map(async (post) => {
            const posterRef = doc(firestore, 'users', post.poster);
            const posterSnapshot = await getDoc(posterRef);
            const posterData = posterSnapshot.data() as PostType['posterData'];
            return { ...post, posterData } as PostType;
          })
        );

        setPosts(postsWithUserData);
      } else {
        if (
          Object.keys(user.profile.following).length &&
          Object.keys(user.profile.following)
        ) {
          const followingList = Object.keys(user.profile.following);

          postsRef = collection(firestore, 'posts');
          const postsSnapshot = await getDocs(
            query(postsRef, where('poster', 'in', followingList))
          );

          const postsData = postsSnapshot.docs.map((doc) => doc.data());

          const postsWithUserData = await Promise.all(
            postsData.map(async (post) => {
              const posterRef = doc(firestore, 'users', post.poster);
              const posterSnapshot = await getDoc(posterRef);
              const posterData =
                posterSnapshot.data() as PostType['posterData'];
              return { ...post, posterData } as PostType;
            })
          );

          if (postsWithUserData.length === 0) {
            setPosts(null);
            return;
          }

          setPosts(postsWithUserData);
        } else {
          setPosts(null);
          return;
        }
      }
    };

    fetchPosts();
  }, [selectedFeed, user]);

  return (
    <>
      <div className="w-full">
        {!user && (
          <div className="flex flex-col max-w-[44rem] mx-auto mt-16 gap-9 mb-9">
            <h2 className="font-hepta text-5xl font-bold text-center leading-[130%]">
              Musehabit - an online open-mic.
            </h2>
            <p className="text-center text-2xl">
              Share your artistic expression for the month. From music, poetry,
              sculpture, photography, painting, a writing excerpt, recorded
              stand-up bit, or better yet something that doesn&apos;t fit in any
              category.
            </p>
          </div>
        )}

        {user ? (
          <div className="w-full width-wrapper flex text-xl font-hepta text-center font-bold mt-8">
            <button
              className={`w-full border-b border-b-slate-700 py-4 ${
                selectedFeed === 'global' ? 'bg-slate-200' : ''
              }`}
              onClick={() => setSelectedFeed('global')}
            >
              Global Feed
            </button>
            <button
              className={`w-full border-b border-b-slate-700 py-4 ${
                selectedFeed === 'following' ? 'bg-slate-200' : ''
              }`}
              onClick={() => setSelectedFeed('following')}
            >
              <span>Following Feed</span>
            </button>
          </div>
        ) : (
          <h3 className="text-4xl font-hepta text-center font-bold">
            Global Feed
          </h3>
        )}
      </div>
      {posts && posts.length > 0 ? (
        <ul className="width-wrapper w-full flex flex-col gap-32 my-16">
          {posts.map((post) => (
            <li key={post.id}>
              <Post post={post} />
            </li>
          ))}
        </ul>
      ) : selectedFeed === 'global' ? (
        <div className="flex flex-col items-center justify-center mt-24 gap-4">
          {<BeatLoader color="#F24236" />}
        </div>
      ) : selectedFeed === 'following' ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <h3 className="text-4xl font-hepta text-center font-bold mt-16">
            No posts from following
          </h3>
          <p className="text-center">
            Follow some users to see their posts here!
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-24 gap-4">
          {<BeatLoader color="#F24236" />}
        </div>
      )}
    </>
  );
}
