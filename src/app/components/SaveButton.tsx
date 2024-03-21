// Inside your Post component
import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import icons from '@/app/lib/icons';
import Modal from './Modal';
import Link from 'next/link';

const SaveButton = ({ postUid }: { postUid: string }) => {
  const { user, setUser } = useAuth();
  const [saved, setSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSave = async () => {
    if (!user) {
      setShowModal(true);
      return;
    }

    const savedPostRef = doc(firestore, `users/${user.uid}`);
    const savedPostSnapshot = await getDoc(savedPostRef);
    let savedPostData = savedPostSnapshot.data() || {};

    if (savedPostData?.savedPosts && savedPostData.savedPosts[postUid]) {
      // Post already saved, so remove it
      delete savedPostData.savedPosts[postUid];
      setSaved(false);
    } else {
      // Post not saved, so add it
      if (!savedPostData.savedPosts) {
        savedPostData.savedPosts = {};
      }
      savedPostData.savedPosts[postUid] = true;
      setSaved(true);
    }

    await setDoc(savedPostRef, savedPostData);

    // Update the user state with the updated favorited data
    const newProfile = {
      ...user.profile,
      savedPosts: { ...savedPostData.savedPosts },
    };

    setUser({ ...user, profile: newProfile });
  };

  useEffect(() => {
    if (user && user.profile.savedPosts && user.profile.savedPosts[postUid]) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [user, postUid]);

  return (
    <div className="">
      <button onClick={handleSave}>
        {saved ? icons.bookmarked : icons.bookmark}
      </button>
      <Modal
        toggleText="Close Modal"
        showModal={showModal}
        setShowModal={setShowModal}
      >
        {showModal && (
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold">
              To save a post, create an account or log in
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

export default SaveButton;
