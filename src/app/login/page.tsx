'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';

const formData = [
  {
    id: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'email',
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

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const router = useRouter();

  const { signIn, signInWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await emailSignIn(form.email, form.password);
    router.push('/');
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      router.push('/');
    } catch (error) {
      console.log('ERROR: ', error);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  return (
    <div className="flex w-full">
      <div className="w-1/2 object-cover h-[calc(100vh-3rem)] ">
        <img
          src="https://fakeimg.pl/756x900/c1c1c1/909090"
          alt="login page"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="max-w-47rem flex flex-col justify-center items-center w-full max-w-[20.8125rem]">
          <h2 className="font-satoshi text-[2.25rem] font-bold mb-[1.125rem">
            Log In
          </h2>
          <p className="font-satoshi mb-10">
            Need an account?{' '}
            <Link href="/signup" className="underline">
              Sign Up.
            </Link>
          </p>
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
                value={form[item.id]}
                handleFormChange={handleFormChange}
                required={item.required}
                className="text-black p-[0.625rem] border border-black rounded-md w-full"
              />
            ))}
            <Link href="forgot-password" className="underline">
              Forgot Password
            </Link>
            <button
              type="submit"
              className="mt-6 bg-gray-400 rounded-md px-[0.875] py-[0.625rem]"
            >
              Log In
            </button>
          </form>

          <div className="py-10 text-[1.125rem] font-medium">Or</div>
          <button
            type="button"
            className="border border-black rounded-md px-[0.875rem] py-[0.625rem]"
            onClick={handleGoogleSignIn}
          >
            Log In with Google
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;
