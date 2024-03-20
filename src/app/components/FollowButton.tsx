import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/app/lib/firebase';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Modal from './Modal';
import icons from '@/app/lib/icons';

const FollowButton = ({ artistUid }: { artistUid: string }) => {
  const { user, setUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleFollow = async () => {
    if (!user) {
      setShowModal(true);
      return;
    }

    const followingRef = doc(firestore, `users/${user.uid}`);
    const followingSnapshot = await getDoc(followingRef);

    let followingData = followingSnapshot.data() || {};

    if (followingData?.following && followingData.following[artistUid]) {
      delete followingData.following[artistUid];
      setIsFollowing(false);
    } else {
      if (!followingData.following) {
        followingData.following = {};
      }
      followingData.following[artistUid] = true;
      setIsFollowing(true);
    }

    await updateDoc(followingRef, followingData);

    // Update the user state with the updated following data
    const newProfile = {
      ...user.profile,
      following: { ...followingData.following },
    };

    setUser({ ...user, profile: newProfile });
  };

  useEffect(() => {
    if (user && user.profile.following && user.profile.following[artistUid]) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [user, artistUid]);

  return (
    <div className="">
      <button
        className="btn btn-primary font-satoshi flex items-center"
        onClick={handleFollow}
      >
        {isFollowing ? (
          <>Following</>
        ) : (
          <>
            Follow <span className="text-lg ml-2">{icons.plus}</span>
          </>
        )}
      </button>
      <Modal
        toggleText="Close Modal"
        showModal={showModal}
        setShowModal={setShowModal}
      >
        {showModal && (
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold">
              To follow an artist, create an account or log in
            </h3>
            <p className="text-lg">
              When you have a Musehabit account, you can share your own work and
              interact with others&apos; work.
            </p>
            <div className="flex gap-4 py-6">
              <Link href="/login" className="btn btn-secondary">
                Log in
              </Link>
              <Link href="/signup" className="btn btn-primary">
                Create an Account
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FollowButton;
