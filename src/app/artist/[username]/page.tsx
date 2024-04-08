'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { BeatLoader } from 'react-spinners';
import { firestore } from '@/app/lib/firebase';
import Post from '@/app/components/Post';
import { useAuth } from '@/app/context/AuthContext';
import { PostType, ArtistType } from '@/app/lib/types';
import FollowButton from '@/app/components/FollowButton';
import icons from '@/app/lib/icons';

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
      {artist?.photoURL && (
        <Image
          src={artist?.photoURL}
          alt={artist.displayName}
          height={146}
          width={146}
          className="rounded-full mx-auto mt-12"
        />
      )}
      <div className="flex justify-center items-center gap-[2.25rem] my-12">
        <h2 className="font-satoshi font-bold text-5xl">
          {artist?.displayName}
        </h2>
        {artist && user && user.uid === artist.uid ? (
          <Link href={`/edit-profile`} className="btn btn-secondary">
            <span className="text-lg mr-2">{icons.edit}</span> Edit Profile
          </Link>
        ) : (
          artist && <FollowButton artistUid={artist.uid} />
        )}
      </div>
      {artist && (
        <div className="max-w-3xl flex flex-col items-center gap-6 mb-8">
          <div className="flex flex-wrap gap-x-6 gap-y-4 justify-center max-w-[37.5rem]">
            {[
              [icons.user, artist.username],
              [icons.pin, artist.location],
              [
                icons.link,
                <a
                  key="website-link"
                  className="hover:text-light-purple"
                  href={artist.website}
                >
                  {artist.website}
                </a>,
              ],
              [icons.design, artist.medium],
              [icons.countingworkspro, artist.pronouns],
            ].map(
              ([icon, text], idx) =>
                text && (
                  <div className="flex items-center text-lg gap-3" key={idx}>
                    <span className="text-xl">{icon}</span> {text}
                  </div>
                )
            )}
          </div>
          <p className="text-center">{artist.bio}</p>
        </div>
      )}
      {artist && user && user.uid === artist.uid && (
        <div className="w-full width-wrapper flex text-xl font-hepta text-center font-bold my-8">
          <button
            className={`w-full border-b rounded-t-[6px] border-b-light-gray py-4 ${
              selectedFeed === 'myPosts'
                ? 'bg-light-gray text-dark'
                : 'text-white'
            }`}
            onClick={() => setSelectedFeed('myPosts')}
          >
            My Posts
          </button>
          <button
            className={`w-full border-b rounded-t-[6px] border-b-light-gray py-4 ${
              selectedFeed === 'savedPosts'
                ? 'bg-light-gray text-dark'
                : 'text-white'
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
        <div className="text-4xl font-hepta text-center font-bold mt-24">
          {selectedFeed === 'myPosts' ? (
            !user || user.profile.latestPost ? (
              <BeatLoader color="#F24236" />
            ) : (
              <p>
                <Link href="/share">Share</Link> a post to see it here.
              </p>
            )
          ) : (
            <p>No saved posts yet.</p>
          )}
        </div>
      )}
    </>
  );
};
export default Profile;
