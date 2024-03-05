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
import { firestore } from './lib/firebase';
import Post from './components/Post';
import { PostType } from './lib/types';

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [selectedFeed, setSelectedFeed] = useState('global');
  const { user } = useAuth();
  // if (user) {
  //   console.log('user', user);
  // }

  useEffect(() => {
    const getFollowingPosts = async () => {
      // get the user's following list
      const followingRef = collection(firestore, `followers/${user?.uid}`);

      // get posts of all the users on the following list
      const followingSnapshot = await getDocs(followingRef);

      const followingData = followingSnapshot.docs.map((doc) => doc.id);

      console.log('FOLLOWING DATA: ', followingData);

      // get the posts of the users on the following list
      const followingPostsRef = collection(firestore, 'posts');

      const followingPostsQuery = query(
        followingPostsRef,
        where('poster', 'in', followingData),
        orderBy('postedAt', 'desc') // assuming 'postedAt' is the field name for timestamp
      );

      const followingPostsSnapshot = await getDocs(followingPostsQuery);
      return followingPostsSnapshot.docs.map((doc) => doc.data());
    };

    const fetchPosts = async () => {
      let postsRef;

      if (selectedFeed === 'global') {
        postsRef = collection(firestore, 'posts');
      } else {
        const followingPosts = await getFollowingPosts();
        const postsWithUserData = await Promise.all(
          followingPosts.map(async (post) => {
            const posterRef = doc(firestore, 'users', post.poster);
            const posterSnapshot = await getDoc(posterRef);
            const posterData = posterSnapshot.data() as PostType['posterData'];
            return { ...post, posterData } as PostType;
          })
        );
        setPosts(postsWithUserData);
        return;
      }

      const postsSnapshot = await getDocs(postsRef);
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
    };

    fetchPosts();
  }, [selectedFeed, user]);

  return (
    <>
      <div className="w-full">
        {!user && (
          <div className="flex flex-col max-w-[44rem] mt-16 gap-9 mb-9">
            <h2 className="font-hepta text-5xl font-bold text-center leading-[130%]">
              This is a tagline that summarizes Musehabit
            </h2>
            <p className="text-center text-2xl">
              This is a small description of Musehabit. It gives a little more
              detail about what users can do on the website.
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
      {posts.length > 0 ? (
        <ul className="width-wrapper w-full flex flex-col gap-32 my-16">
          {posts.map((post) => (
            <li key={post.id}>
              <Post post={post} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts yet</p>
      )}
    </>
  );
}
