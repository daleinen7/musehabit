'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/app/lib/firebase';
import Post from '@/app/components/Post';
import { useAuth } from '@/app/context/AuthContext';
import { PostType, ArtistType } from '@/app/lib/types';
import FollowButton from '@/app/components/FollowButton';

const Profile = ({ params }: { params: any }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [artist, setArtist] = useState<ArtistType | null>(null);
  useEffect(() => {
    const username = params.username;
    const fetchUserAndPosts = async () => {
      if (username) {
        try {
          // Step 1: Query the 'users' collection to find the user
          const userQuery = query(
            collection(firestore, 'users'),
            where('username', '==', username)
          );
          const userSnapshot = await getDocs(userQuery);

          if (!userSnapshot.empty) {
            const postsData = userSnapshot.docs.map((doc): unknown => ({
              id: doc.id,
              ...doc.data(),
              posterData: postsData,
            })) as PostType[];
            setPosts(postsData);
          } else {
            console.log('User not found');
          }
        } catch (error) {
          console.error('Error fetching user and posts:', error);
        }
      }
    };

    fetchUserAndPosts();
  }, [params.username]);
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
      {posts.length > 0 && (
        <div>
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Profile;
