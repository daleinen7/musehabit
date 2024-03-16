'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { firestore } from '@/app/lib/firebase';
import Post from '@/app/components/Post';
import { useAuth } from '@/app/context/AuthContext';
import { PostType, ArtistType } from '@/app/lib/types';
import FollowButton from '@/app/components/FollowButton';

const Profile = ({ params }: { params: any }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [artist, setArtist] = useState<ArtistType | null>(null);
  const [selectedFeed, setSelectedFeed] = useState('myPosts');
  useEffect(() => {
    const username = params.username;
    const fetchUserAndPosts = async () => {
      if (username) {
        if (selectedFeed === 'myPosts') {
          try {
            // Step 1: Query the 'users' collection to find the user
            const userQuery = query(
              collection(firestore, 'users'),
              where('username', '==', username)
            );
            const userSnapshot = await getDocs(userQuery);

            if (!userSnapshot.empty) {
              const userData = userSnapshot.docs[0].data() as ArtistType;

              // Step 2: Query the 'posts' collection to find all posts by this user
              const postsQuery = query(
                collection(firestore, 'posts'),
                where('poster', '==', userData.uid)
              );
              const postsSnapshot = await getDocs(postsQuery);

              const postsData = postsSnapshot.docs.map((doc) => {
                return {
                  id: doc.id,
                  ...doc.data(),
                  posterData: userData,
                };
              }) as unknown as PostType[];

              setArtist(userData);
              setPosts(postsData);
            } else {
              console.log('User not found');
            }
          } catch (error) {
            console.error('Error fetching user and posts:', error);
          }
        } else if (selectedFeed === 'savedPosts') {
          try {
            if (user && Object.keys(user.profile.savedPosts).length) {
              const savedPostsList = Object.keys(user.profile.savedPosts);

              const postsRef = collection(firestore, 'posts');
              const postsSnapshot = await getDocs(
                query(postsRef, where('id', 'in', savedPostsList))
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

              setPosts(postsWithUserData);
            } else {
              setPosts([]);
            }
          } catch {
            console.error('Following data is missing or not an array');
          }
        }
      }
    };

    fetchUserAndPosts();
  }, [user, selectedFeed, params.username]);
  return (
    <>
      <div className="flex justify-center items-center gap-[2.25rem] my-12">
        <h2 className="font-satoshi font-bold text-5xl">{params.username}</h2>
        {artist && user && user.uid === artist.uid ? (
          <Link href={`/edit-profile`} className="btn btn-primary">
            Edit Profile
          </Link>
        ) : (
          artist && <FollowButton artistUid={artist.uid} />
        )}
      </div>
      {artist && (
        <div>
          <div className="flex gap-8">
            <p>{artist.location}</p>
            <p>{artist.medium}</p>
          </div>
          <p>{artist.bio}</p>
        </div>
      )}
      {artist && user && user.uid === artist.uid && (
        <div className="w-full width-wrapper flex text-xl font-hepta text-center font-bold my-8">
          <button
            className={`w-full border-b border-b-slate-700 py-4 ${
              selectedFeed === 'myPosts' ? 'bg-slate-200' : ''
            }`}
            onClick={() => setSelectedFeed('myPosts')}
          >
            My Posts
          </button>
          <button
            className={`w-full border-b border-b-slate-700 py-4 ${
              selectedFeed === 'savedPosts' ? 'bg-slate-200' : ''
            }`}
            onClick={() => setSelectedFeed('savedPosts')}
          >
            <span>Saved Posts</span>
          </button>
        </div>
      )}
      {posts.length > 0 ? (
        <div className="mb-12">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <h3 className="text-4xl font-hepta text-center font-bold">
          No posts to show
        </h3>
      )}
    </>
  );
};
export default Profile;
