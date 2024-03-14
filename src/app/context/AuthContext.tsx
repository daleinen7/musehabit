'use client';
import { useContext, createContext, useState, useEffect } from 'react';
import {
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getRedirectResult,
} from 'firebase/auth';
import { auth, firestore } from '@/app/lib/firebase';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import slugify from '@/app/lib/slugify';
import { useRouter } from 'next/navigation';
import { UserType } from '@/app/lib/types';
import { canUserPost } from '../lib/canUserPost';
import { daysUntilNextPost as daysUntilPost } from '../lib/daysUntilNextPost';

type AuthContextType = {
  user: UserType | null;
  loading: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
  resetPassword: (email: string) => void;
  createUser: (email: string, password: string) => void;
  emailSignUp: (email: string, password: string, username: string) => void;
  signIn: (email: string, password: string) => void;
  updateUserProfile: (userId: string, profileInfo: any) => void;
  canPost: boolean;
  daysUntilNextPost: number;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signInWithGoogle: () => {},
  signOut: () => {},
  resetPassword: () => {},
  createUser: () => {},
  emailSignUp: () => {},
  signIn: () => {},
  updateUserProfile: () => {},
  canPost: false,
  daysUntilNextPost: 0,
});

interface ProfileData {
  bio: string;
  email: string;
  following: { [userId: string]: boolean };
  joined: number;
  latestPost: Date | false;
  medium: string;
  photoURL: string | undefined;
  posts: { [postId: string]: boolean };
  location: string;
  savedPosts: { [postId: string]: boolean };
  uid: string;
  url: string;
  username: string;
  settings: {
    tenDay: boolean | undefined;
    fiveDay: boolean | undefined;
    threeDay: boolean | undefined;
    oneDay: boolean | undefined;
    accountabilityNotice: boolean | undefined;
    lateImage: string | undefined;
    lateExcuse: string | undefined;
    defaultFeed: string | undefined;
  };
}

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [canPost, setCanPost] = useState<boolean>(false);
  const [daysUntilNextPost, setDaysUntilNextPost] = useState<number>(NaN);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const isUsernameAvailable = async (username: string): Promise<boolean> => {
    const usernameSnapshot = await getDoc(doc(firestore, 'users', username));
    return !usernameSnapshot.exists();
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithRedirect(auth, new GoogleAuthProvider());
    } catch (error) {
      console.error('Error signing in with Google: ', error);
    }
  };

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        setLoading(true);
        if (result && result.user) {
          const user = result.user;
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (!userDoc.exists()) {
            // User is signing up
            let username = slugify(user.displayName ?? '');
            let usernameAvailable = await isUsernameAvailable(username);
            let counter = 1;
            while (!usernameAvailable) {
              username = `${slugify(user.displayName ?? '')}-${counter}`;
              usernameAvailable = await isUsernameAvailable(username);
              counter++;
            }
            await setDoc(doc(firestore, 'users', user.uid), {
              username,
              uid: user.uid,
              photoURL: user.photoURL,
              joined: Date.now(),
            });
            const profileData: ProfileData = {
              username,
              url: username,
              bio: '',
              medium: '',
              location: '',
              photoURL: user.photoURL || '' || undefined,
              savedPosts: {},
              following: {},
              joined: Date.now(),
              latestPost: false,
              email: user.email || '',
              posts: {},
              uid: user.uid,
              settings: {
                tenDay: false,
                fiveDay: false,
                threeDay: false,
                oneDay: false,
                accountabilityNotice: false,
                lateImage: '',
                lateExcuse: '',
                defaultFeed: '',
              },
            };
            setUser({
              uid: user.uid,
              displayName: user.displayName || '',
              photoURL: user.photoURL || '',
              profile: {
                displayName: user.displayName || '',
                username: profileData?.username || '',
                url: profileData?.url || '',
                bio: profileData?.bio || '',
                medium: profileData?.medium || '',
                location: profileData?.location || '',
                photoURL: profileData?.photoURL || '',
                joined: profileData?.joined,
                latestPost: false,
                savedPosts: profileData?.savedPosts || {},
                following: profileData?.following || {},
                settings: {
                  tenDay: false,
                  fiveDay: false,
                  threeDay: false,
                  oneDay: false,
                  accountabilityNotice: false,
                  lateImage: '',
                  lateExcuse: '',
                  defaultFeed: 'global',
                },
              },
            });
            // User has never posted so allow them to
            setCanPost(true);
            setLoading(false);
            router.push(`/edit-profile`);
          } else {
            // User is signing in
            // Redirect to the homepage
            setLoading(false);
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Error handling Google redirect: ', error);
      }
    };

    handleRedirect();
  }, [router]);

  const resetPassword = (email: string) => {
    sendPasswordResetEmail(auth, email);
  };

  const createUser = (email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password);
  };

  const emailSignUp = async (
    email: string,
    password: string,
    username: string
  ) => {
    try {
      let newUsername = username;
      let usernameAvailable = await isUsernameAvailable(newUsername);

      // If the username is not available, increment it by appending a number until finding an available username
      let counter = 1;
      while (!usernameAvailable) {
        newUsername = `${username}${counter}`;
        usernameAvailable = await isUsernameAvailable(newUsername);
        counter++;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      const profileData: ProfileData = {
        uid: user.uid,
        username,
        url: username,
        bio: '',
        medium: '',
        location: '',
        photoURL: user.photoURL || '',
        savedPosts: {},
        following: {},
        joined: Date.now(),
        latestPost: false,
        email: user.email || '',
        posts: {},
        settings: {
          tenDay: false,
          fiveDay: false,
          threeDay: false,
          oneDay: false,
          accountabilityNotice: false,
          lateImage: '',
          lateExcuse: '',
          defaultFeed: 'global',
        },
      };

      await setDoc(doc(firestore, 'users', user.uid), {
        ...profileData,
      });

      setUser({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        profile: {
          displayName: user.displayName || '',
          username: profileData?.username || '',
          url: profileData?.url || '',
          bio: profileData?.bio || '',
          medium: profileData?.medium || '',
          location: profileData?.location || '',
          photoURL: profileData?.photoURL || '',
          joined: profileData?.joined || Date.now(),
          latestPost: false,
          savedPosts: profileData?.savedPosts || {},
          following: profileData?.following || {},
          settings: {
            tenDay: false,
            fiveDay: false,
            threeDay: false,
            oneDay: false,
            accountabilityNotice: false,
            lateImage: '',
            lateExcuse: '',
            defaultFeed: 'global',
          },
        },
      });

      // Redirect to the profile edit page after successful sign-up
      router.push(`/edit-profile`);
    } catch (error) {
      console.error('Error signing up with email: ', error);
    }
  };

  const signIn = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password);
  };

  const updateProfile = async (userId: string, profileData: any) => {
    try {
      await setDoc(doc(firestore, 'users', userId), profileData, {
        merge: true,
      });
    } catch (error) {
      console.error('Error updating profile: ', error);
    }
  };

  const value = {
    user,
    loading,
    signOut: () => signOut(auth),
    resetPassword,
    createUser,
    signIn,
    signInWithGoogle,
    emailSignUp,
    canPost,
    daysUntilNextPost,
    updateUserProfile: updateProfile,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        const canPostCheck = await canUserPost(user.uid);
        await setCanPost(canPostCheck);
        const daysUntilNextPostCheck = await daysUntilPost(user.uid);

        await setDaysUntilNextPost(daysUntilNextPostCheck.daysUntilNextPost);

        const profileData = userDoc.data();
        setUser({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          profile: {
            displayName: user.displayName || '',
            username: profileData?.username || '',
            url: profileData?.url || '',
            bio: profileData?.bio || '',
            medium: profileData?.medium || '',
            location: profileData?.location || '',
            photoURL: profileData?.photoURL || '',
            joined: profileData?.joined || '',
            latestPost: profileData?.latestPost || '',
            savedPosts: profileData?.savedPosts || {},
            following: profileData?.following || {},
            settings: {
              tenDay: false,
              fiveDay: false,
              threeDay: false,
              oneDay: false,
              accountabilityNotice: false,
              lateImage: '',
              lateExcuse: '',
              defaultFeed: 'global',
            },
          },
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
