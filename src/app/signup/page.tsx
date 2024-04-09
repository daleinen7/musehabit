'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import icons from '../lib/icons';

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
];

const SignUp = () => {
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
  });

  const { user, emailSignUp, signInWithGoogle } = useAuth();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      <div className="hidden sm:block sm:w-1/2 object-cover h-[calc(100vh-3rem)] ">
        <Image
          src="https://fakeimg.pl/756x900/c1c1c1/909090"
          alt="login page"
          className="w-full h-full object-cover"
          height={900}
          width={756}
        />
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
