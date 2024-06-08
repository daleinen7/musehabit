'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { getDoc, doc, collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/app/lib/firebase';
import getFileType from '../lib/getFileType';
import FormInput from '../components/FormInput';
import icons from '../lib/icons';
import logo from '../images/logo.svg';
const formData = [
  {
    id: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'email',
    required: true,
  },
  {
    id: 'username',
    type: 'text',
    label: 'Username',
    placeholder: 'username',
    required: true,
  },
  {
    id: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'password',
    required: true,
  },
  {
    id: 'confirmPassword',
    type: 'password',
    label: 'Confirm Password',
    placeholder: 'confirm password',
    required: true,
  },
];

const SignUp = () => {
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const { user, emailSignUp, signInWithGoogle } = useAuth();
  const [randomPost, setRandomPost] = useState<any>(null);
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    await emailSignUp(form.email, form.password, form.username);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // router.push('/');
    } catch (error) {
      console.log('ERROR: ', error);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === 'username') {
      const username = e.target.value.replace(/\s/g, '');
      setForm({ ...form, [e.target.id]: username });
      return;
    } else {
      setForm({ ...form, [e.target.id]: e.target.value });
    }
  };

  useEffect(() => {
    if (user) {
      router.push(`/`);
    }
  }, [user, router]);

  return (
    <div className="flex w-full">
      <div className="hidden sm:block sm:w-1/2 object-cover h-[calc(100vh-5.4375rem)] align-center justify-center">
        {getFileType(randomPost?.format) === 'image' && (
          <img
            src={randomPost?.draft}
            alt="login page"
            className="w-full h-full object-cover"
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
      <div className="w-full sm:w-1/2 mt-12 sm:mt-0 flex items-center justify-center">
        <div className="max-w-47rem flex flex-col justify-center items-center w-full max-w-[20.8125rem]">
          <h2 className="font-satoshi text-[2.25rem] font-bold mb-[1.125rem]">
            Sign up
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center gap-6 w-full"
          >
            {formData.map((item) => (
              <FormInput
                key={item.id}
                label={item.label}
                type={item.type}
                id={item.id}
                value={form[item.id as keyof typeof form]}
                handleFormChange={handleFormChange}
                required={item.required}
              />
            ))}
            <button type="submit" className="mt-6 btn btn-primary w-full">
              Sign up
            </button>
          </form>
          <div className="py-10 text-[1.125rem] font-medium">Or</div>
          <button
            type="button"
            className="btn btn-secondary w-full flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
          >
            <div className="text-xl">{icons.google}</div> Sign Up with Google
          </button>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
