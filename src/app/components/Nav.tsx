'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import icons from '@/app/lib/icons';

type NavItem = {
  url?: string;
  func?: () => void;
  text: string;
  auth?: boolean;
  children?: React.ReactNode;
};

const NavItem = ({ url, func, text, children }: NavItem) => (
  <li
    key={url}
    className="font-satoshi text-lg font-medium text-gray-500 hover:text-black relative"
  >
    {url ? (
      <Link href={url}>{text}</Link>
    ) : (
      <button onClick={func}>{text}</button>
    )}
    {children}
  </li>
);

const Nav = () => {
  const { user, signOut, canPost, daysUntilNextPost } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log('ERROR: ', error);
    }
  };

  const handleDropdown = () => {
    setShowProfile(!showProfile);
  };

  return (
    <nav className="bg-slate-200 py-3">
      <ul className="width-wrapper w-full flex justify-between items-center">
        <li>
          <Link href="/">
            <h1 className="font-satoshi text-4xl font-bold">Musehabit</h1>
          </Link>
        </li>
        <div className="flex gap-6 items-center">
          <NavItem url="/about" text="About" />
          {!user && (
            <>
              <NavItem url="/login" text="Log In" />
              <NavItem url="/signup" text="Sign Up" />
            </>
          )}
          {user && (
            <>
              <NavItem func={handleDropdown} text="Profile">
                {showProfile && (
                  <ul className="absolute w-[9rem] mt-2 bg-white shadow-lg p-4 z-50">
                    <li>
                      <Link href={`/artist/${user.profile.username}`}>
                        View Profile
                      </Link>
                    </li>
                    <li>
                      <Link href="/edit-profile">Edit Profile</Link>
                    </li>
                    <li>
                      <Link href="/profile/settings">Settings</Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogOut}
                        className="flex items-center"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </NavItem>
              {canPost ? (
                <li className="relative">
                  <Link href="/share" className="btn btn-secondary">
                    Make Your Post
                  </Link>
                  <div className="absolute -top-3 right-0 bg-red-600 text-white rounded-[10px] px-[3px] -py-1">
                    {user.profile.latestPost &&
                      (daysUntilNextPost + daysUntilNextPost === 1
                        ? 'Day'
                        : 'Days')}
                  </div>
                </li>
              ) : (
                <li>
                  <div>Post again in {daysUntilNextPost} days</div>
                </li>
              )}
            </>
          )}
        </div>
      </ul>
    </nav>
  );
};
export default Nav;
