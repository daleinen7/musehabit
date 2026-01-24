'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getDoc, doc, collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/app/lib/firebase';
import getFileType from '../lib/getFileType';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import icons from '../lib/icons';
import logo from '../images/logo.svg';

const Login = () => {
  const [randomPost, setRandomPost] = useState<any>(null);
  const [error, setError] = useState<undefined | string>(undefined);

  const router = useRouter();

  const { signIn, signInWithGoogle, user } = useAuth();

  useEffect(() => {
    const fetchRandomPostAndArtist = async () => {
      try {
        const postsCollection = collection(firestore, 'posts');
        const postsSnapshot = await getDocs(postsCollection);
        const postsList = postsSnapshot.docs.map((doc) => doc.data());
        const randomIndex = Math.floor(Math.random() * postsList.length);
        const selectedPost = postsList[randomIndex];

        if (selectedPost && selectedPost.poster) {
          const artistDoc = doc(firestore, 'users', selectedPost.poster);
          const artistSnapshot = await getDoc(artistDoc);
          if (artistSnapshot.exists()) {
            selectedPost.artistInfo = artistSnapshot.data();
          }
        }
        setRandomPost(selectedPost);
      } catch (error) {
        console.error('Error fetching random post or artist info: ', error);
      }
    };

    fetchRandomPostAndArtist();
  }, []);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (error) {
      console.log('ERROR: ', error);
    }
  };

  return (
    <div className="flex w-full">
      <div className="hidden sm:block sm:w-1/2 object-cover h-[calc(100vh-5.4375rem)] align-center justify-center">
        {getFileType(randomPost?.format) === 'image' && (
          <img
            src={randomPost?.draft}
            alt="login page"
            className="w-full h-full object-cover"
            // height={900}
            // width={756}
          />
        )}
        {getFileType(randomPost?.format) === 'video' && (
          <video
            src={randomPost?.draft}
            className="w-full h-full object-cover"
            controls
          />
        )}
        {getFileType(randomPost?.format) === 'audio' && (
          <div className="flex flex-col w-full h-full justify-center align-center gap-4">
            <Image
              src={logo}
              alt={`Octopus logo`}
              width={200}
              height={200}
              className="mx-auto"
            />

            <audio src={randomPost?.draft} className="mx-auto" controls />
          </div>
        )}
        {getFileType(randomPost?.format) === 'writing' && (
          <div className="px-12 mt-8 mb-4 line-clamp-5 font-hepta text-left text-2xl font-medium rounded">
            {randomPost?.post}
          </div>
        )}
        {randomPost && (
          <div className="flex flex-col absolute bottom-20 pl-4 pt-2 pr-2 pb-2 bg-black">
            <div className=" font-hepta text-xl">{randomPost?.title}</div>
            <div className="font-satoshi text-sm">
              By {randomPost?.artistInfo?.displayName}
            </div>
          </div>
        )}
      </div>
      <div className="w-full mt-12 sm:mt-0 sm:w-1/2 flex items-center justify-center">
        <div className="max-w-47rem flex flex-col justify-center items-center w-full max-w-[20.8125rem]">
          <h2 className="font-satoshi text-[2.25rem] font-bold mb-[1.125rem">
            Log In
          </h2>
          <p className="font-satoshi mb-10">
            Need an account?{' '}
            <Link href="/signup" className="underline hover:text-light-purple">
              Sign Up.
            </Link>
          </p>

          <div className="py-10 text-[1.125rem] font-medium">Or</div>
          <button
            type="button"
            className="btn btn-secondary w-full flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
          >
            <div className="text-xl">{icons.google}</div> Log In with Google
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;
