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
  startAfter,
  limit,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { BeatLoader } from 'react-spinners';
import { firestore } from './lib/firebase';
import Post from './components/Post';
import { PostType } from './lib/types';

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [selectedFeed, setSelectedFeed] = useState<'global' | 'following'>(
    'global'
  );
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const { user } = useAuth();
  const postsPerPage = 5;

  const fetchPosts = async (isNewFeed = false) => {
    if (loading) return;
    setLoading(true);

    let postsRef;
    let q;

    if (selectedFeed === 'global' || !user) {
      postsRef = collection(firestore, 'posts');
      q = query(postsRef, orderBy('postedAt', 'desc'), limit(postsPerPage));
    } else {
      const followingList = Object.keys(user.profile.following);
      if (followingList.length) {
        postsRef = collection(firestore, 'posts');
        q = query(
          postsRef,
          where('poster', 'in', followingList),
          orderBy('postedAt', 'desc'),
          limit(postsPerPage)
        );
      } else {
        setPosts([]);
        setLoading(false);
        return;
      }
    }

    if (!isNewFeed && lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const postsSnapshot = await getDocs(q);
    const postsData = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PostType[];

    const postsWithUserData = await Promise.all(
      postsData.map(async (post) => {
        console.log('post', post);

        const posterRef = doc(firestore, 'users', post.poster);
        const posterSnapshot = await getDoc(posterRef);
        const posterData = posterSnapshot.data() as PostType['posterData'];
        return { ...post, posterData } as PostType;
      })
    );

    if (isNewFeed) {
      setPosts(postsWithUserData);
    } else {
      setPosts((prevPosts) => [...prevPosts, ...postsWithUserData]);
    }

    setLastDoc(postsSnapshot.docs[postsSnapshot.docs.length - 1] || null);
    setHasMorePosts(postsSnapshot.docs.length === postsPerPage);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      setSelectedFeed(user?.profile?.settings?.defaultFeed || 'global');
    }
  }, [user]);

  useEffect(() => {
    if (selectedFeed !== null) {
      setPosts([]);
      setLastDoc(null);
      setHasMorePosts(true);
      fetchPosts(true);
    }
  }, [selectedFeed]);

  const loadMorePosts = () => {
    fetchPosts(false);
  };

  return (
    <>
      <div className="w-full">
        {!user && (
          <div className="flex flex-col max-w-[44rem] mx-auto mt-16 gap-9 mb-9">
            <h2 className="font-hepta text-5xl font-bold text-center leading-[130%]">
              an online open-mic.
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
          <div className="w-full max-w-3xl mx-auto flex text-xl font-hepta text-center font-bold mt-8">
            <h2 className="sr-only">Home - Global or Following Feed</h2>
            <button
              className={`w-full border-b border-b-light-gray rounded-t-[6px] py-4 ${
                selectedFeed === 'global'
                  ? 'bg-light-gray text-dark'
                  : 'text-white font-normal hover:text-light-purple'
              }`}
              onClick={() => setSelectedFeed('global')}
            >
              Global Feed
            </button>
            <button
              className={`w-full border-b border-b-light-gray rounded-t-[6px] py-4 ${
                selectedFeed === 'following'
                  ? 'bg-light-gray text-dark'
                  : 'text-white font-normal hover:text-light-purple'
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
      ) : (
        <div className="flex flex-col items-center justify-center mt-24 gap-4">
          {loading ? (
            <BeatLoader color="#F24236" />
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      )}
      {posts && posts.length > 0 && !loading && hasMorePosts && (
        <div className="flex justify-center my-8">
          <button onClick={loadMorePosts} className="btn btn-secondary">
            Load More
          </button>
        </div>
      )}
    </>
  );
}
