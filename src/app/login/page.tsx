'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import icons from '../lib/icons';

interface FormState {
  email: string;
  password: string;
}

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
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
  });

  const [error, setError] = useState<undefined | string>(undefined);

  const router = useRouter();

  const { signIn, signInWithGoogle, user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signIn(form.email, form.password);
      // If login succeeds, user will be redirected automatically
    } catch (error) {
      setError('Wrong username or password');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (error) {
      console.log('ERROR: ', error);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

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
                value={form[item.id as keyof FormState]}
                handleFormChange={handleFormChange}
                required={item.required}
                error={error}
              />
            ))}
            <Link href="forgot-password" className="underline">
              Forgot Password
            </Link>
            <button type="submit" className="mt-6 btn btn-primary">
              Log In <span className="text-lg ml-2">{icons.arrowRight}</span>
            </button>
          </form>

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
