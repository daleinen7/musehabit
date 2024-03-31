'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import useClickOutside from '@/app/lib/useClickOutside';
import icons from '@/app/lib/icons';

type NavItem = {
  url?: string;
  func?: () => void;
  text: string;
  auth?: boolean;
  children?: React.ReactNode;
  arrow?: boolean;
};

const NavItem = ({ url, func, text, children, arrow }: NavItem) => (
  <li
    key={url}
    className="font-satoshi text-lg font-medium text-gray-300 hover:text-white relative"
  >
    {url ? (
      <Link href={url} className="flex items-center">
        {text}
        {arrow && <span className="text-3xl">{icons.arrow}</span>}
      </Link>
    ) : (
      <button onClick={func} className="flex items-center">
        {text}
        {arrow && <span className="text-3xl">{icons.arrow}</span>}
      </button>
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
      setShowProfile(false);
    } catch (error) {
      console.log('ERROR: ', error);
    }
  };

  const wrapperRef = useRef(null);
  useClickOutside(wrapperRef, () => setShowProfile(false));

  const handleDropdown = () => {
    setShowProfile(!showProfile);
  };

  return (
    <nav className="bg-black py-3">
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
              <NavItem func={handleDropdown} text="Profile" arrow>
                {showProfile && (
                  <ul
                    className="absolute w-[9rem] mt-2 bg-slate-600 shadow-lg p-4 z-50"
                    ref={wrapperRef}
                  >
                    <li>
                      <Link
                        href={`/artist/${user.profile.username}`}
                        onClick={() => setShowProfile(false)}
                      >
                        View Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/edit-profile"
                        onClick={() => setShowProfile(false)}
                      >
                        Edit Profile
                      </Link>
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
