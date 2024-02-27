'use client';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';

export default function Home() {
  const { user } = useAuth();
  if (user) {
    console.log('user', user);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h2 className="font-hepta text-5xl font-bold text-center leading-[130%]">
        This is a tagline that summarizes Musehabit
      </h2>
      <p className="text-center text-2xl">
        This is a small description of Musehabit. It gives a little more detail
        about what users can do on the website.
      </p>
    </main>
  );
}
