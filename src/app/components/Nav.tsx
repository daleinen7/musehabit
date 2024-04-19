'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import useClickOutside from '@/app/lib/useClickOutside';
import { NotificationType } from '@/app/lib/types';
import icons from '@/app/lib/icons';
import { firestore } from '@/app/lib/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';

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
      <Link href={url} className={`flex items-center`}>
        {text}
        {arrow && <span className="text-3xl">{icons.arrow}</span>}
      </Link>
    ) : (
      <button onClick={func} className={`flex items-center`}>
        {text}
        {arrow && <span className="text-3xl">{icons.arrow}</span>}
      </button>
    )}
    {children}
  </li>
);

const Nav = () => {
  const { user, setUser, signOut, canPost, daysUntilNextPost } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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
  useClickOutside(wrapperRef, () => setShowNotifications(false));

  const handleDropdown = () => {
    setShowProfile(!showProfile);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleShowNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  useClickOutside(wrapperRef, () => setIsMobileMenuOpen(false));

  const removeNotification = async (notificationId: string) => {
    setShowNotifications(false);
    if (!user || !notificationId) return;

    const notificationsRef = collection(
      firestore,
      `users/${user.uid}/notifications`
    );

    const notificationDocRef = doc(notificationsRef, notificationId);

    try {
      // Remove the notification from the database
      await deleteDoc(notificationDocRef);

      // Update the user object to remove the deleted notification
      const updatedNotifications = user.notifications.filter(
        (notification: NotificationType) => notification.uid !== notificationId
      );
      const updatedUser = { ...user, notifications: updatedNotifications };
      setUser(updatedUser);
    } catch (error) {
      console.error('Error removing notification:', error);
    }
  };

  const clearNotifications = async () => {
    setShowNotifications(false);
    if (!user) return;

    const notificationsRef = collection(
      firestore,
      `users/${user.uid}/notifications`
    );

    try {
      // Remove all notifications from the database
      await Promise.all(
        user.notifications.map(async (notification: any) => {
          const notificationDocRef = doc(notificationsRef, notification.uid);
          await deleteDoc(notificationDocRef);
        })
      );

      const updatedUser = { ...user, notifications: [] };
      setUser(updatedUser);
    } catch (error) {
      console.error('Error removing notifications:', error);
    }
  };

  return (
    <nav className="bg-black py-3" ref={wrapperRef}>
      <ul className="width-wrapper relative w-full flex justify-between items-center">
        <li>
          <Link href="/">
            <h1 className="font-satoshi text-4xl font-bold">Musehabit</h1>
          </Link>
        </li>
        {/* DESKTOP NAV */}
        <div className="hidden relative sm:flex gap-6 items-center ">
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
                    className="absolute w-[9rem] mt-2 bg-dark-gray shadow-lg p-4 z-50"
                    ref={wrapperRef}
                  >
                    <li>
                      <Link
                        href={`/artist/${user.profile.username}`}
                        onClick={() => setShowProfile(false)}
                        className="text-light-gray hover:text-light-purple"
                      >
                        View Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/edit-profile"
                        onClick={() => setShowProfile(false)}
                        className="text-light-gray hover:text-light-purple"
                      >
                        Edit Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogOut}
                        className="text-light-gray flex items-center hover:text-light-purple"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </NavItem>

              <button
                onClick={handleShowNotifications}
                className="text-xl text-light-gray hover:text-white relative"
              >
                {icons.bell}
                {user.notifications.length > 0 && (
                  <div className="h-2 w-2 absolute -top-1 left-3 rounded-full bg-coral">
                    <span className="sr-only">new notification</span>
                  </div>
                )}
              </button>

              {showNotifications && (
                <div
                  className="absolute w-[30rem] top-12 right-24 mt-2 bg-white shadow-lg text-dark p-4 z-50 rounded-md"
                  ref={wrapperRef}
                >
                  <div className="flex justify-between">
                    <h2 className="text-xl">Notifications</h2>
                    {user.notifications.length > 0 && (
                      <button
                        className="underline"
                        onClick={clearNotifications}
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  {user.notifications && user.notifications.length === 0 && (
                    <li className="text-dark-gray">No new notifications</li>
                  )}
                  {user.notifications &&
                    user.notifications.map((notification: NotificationType) => {
                      const notificationDate = new Date(notification.timestamp);
                      const now = new Date().getTime();
                      const diffInMilliseconds =
                        now - notificationDate.getTime();
                      const hoursSinceNotification = Math.floor(
                        diffInMilliseconds / (1000 * 60 * 60)
                      );

                      const displayString =
                        hoursSinceNotification < 24
                          ? `${hoursSinceNotification} hrs`
                          : `${Math.floor(hoursSinceNotification / 24)} days`;

                      return notification.type === 'follow' ? (
                        <li key={notification.timestamp}>
                          <Link
                            href={`/artist/${notification.followerProfile?.username}`}
                            className="text-dark hover:bg-light-purple transition-colors flex justify-between py-3 px-1 rounded"
                            onClick={() => removeNotification(notification.uid)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{icons.user}</span>
                              <span className="font-bold">
                                {notification.followerProfile?.username}
                              </span>{' '}
                              has followed you
                            </div>
                            <span className="text-sm">{displayString}</span>
                          </Link>
                        </li>
                      ) : (
                        <li key={notification.timestamp}>
                          <Link
                            href={`/post/${notification.postId}`}
                            className="text-dark-gray hover:bg-light-purple transition-colors flex justify-between py-3 px-1 rounded"
                            onClick={() => removeNotification(notification.uid)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{icons.comment}</span>
                              <span className="font-bold">
                                {notification.commenterUsername}
                              </span>
                              has commented on your post
                            </div>
                            <span className="text-sm">{displayString}</span>
                          </Link>
                        </li>
                      );
                    })}
                </div>
              )}

              {canPost ? (
                <li className="relative">
                  <Link href="/share" className="btn btn-post">
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

        {/* MOBILE NAV */}
        <button
          className="sm:hidden block w-6 h-6 relative bg-black"
          onClick={toggleMobileMenu}
        >
          <span className="sr-only">Open main menu</span>
          <div className="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span
              aria-hidden="true"
              className={`block 
                 bg-white
              absolute -top-2 h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            ></span>
            <span
              aria-hidden="true"
              className={`block
                bg-white
               absolute top-0 h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
                 isMobileMenuOpen ? 'opacity-0' : ''
               }`}
            ></span>
            <span
              aria-hidden="true"
              className={`block bg-white
               absolute top-2 h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
                 isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
               }`}
            ></span>
          </div>
        </button>
        <ul
          className={`width-wrapper absolute bg-black border-t-2 border-opacity-[0.05] transition-all duration-300 sm:hidden px-6 pb-8 bg-opacity-95 z-10 flex flex-col items-start text-xl left-0 right-0 top-[3.25rem]
        ${isMobileMenuOpen ? 'translate-x-0 safari-hack' : 'translate-x-full'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <li className="w-full">
            <Link
              href={`/about`}
              className="text-light-gray hover:text-light-purple inline-block w-full  py-4 "
            >
              About
            </Link>
          </li>
          {!user && (
            <>
              <li className="w-full">
                <Link
                  href="/login"
                  className="text-light-gray hover:text-light-purple inline-block w-full  py-4 "
                >
                  Log In
                </Link>
              </li>
              <li className="w-full">
                <Link
                  href="/signup"
                  className="text-light-gray hover:text-light-purple inline-block w-full  py-4 "
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li className="w-full">
                <Link
                  href={`/artist/${user.profile.username}`}
                  onClick={() => setShowProfile(false)}
                  className="text-light-gray hover:text-light-purple inline-block w-full  py-4 "
                >
                  View Profile
                </Link>
              </li>
              <li className="w-full">
                <Link
                  href="/edit-profile"
                  onClick={() => setShowProfile(false)}
                  className="text-light-gray hover:text-light-purple inline-block w-full  py-4 "
                >
                  Edit Profile
                </Link>
              </li>
              <li className="w-full">
                <button
                  onClick={handleLogOut}
                  className="text-light-gray hover:text-light-purple flex w-full  py-4 "
                >
                  Logout
                </button>
              </li>
            </>
          )}
          {canPost && user ? (
            <li className="relative w-full mt-4">
              <Link href="/share" className="btn btn-secondary w-full">
                Make Your Post
              </Link>
              <div className="absolute -top-3 right-0 bg-red-600 text-white rounded-[10px] px-[3px] -py-1">
                {user.profile.latestPost &&
                  (daysUntilNextPost + daysUntilNextPost === 1
                    ? 'Day'
                    : 'Days')}
              </div>
            </li>
          ) : user ? (
            <li className="w-full">
              <div className="flex justify-center">
                Post again in {daysUntilNextPost} days
              </div>
            </li>
          ) : null}
        </ul>
      </ul>
    </nav>
  );
};
export default Nav;
