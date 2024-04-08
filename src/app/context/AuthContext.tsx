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
import {
  getDoc,
  getDocs,
  query,
  collection,
  where,
  doc,
  setDoc,
} from 'firebase/firestore';
import slugify from '@/app/lib/slugify';
import { useRouter } from 'next/navigation';
import { UserType } from '@/app/lib/types';
import { canUserPost } from '../lib/canUserPost';
import { daysUntilNextPost as daysUntilPost } from '../lib/daysUntilNextPost';

type AuthContextType = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
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
  setUser: () => {},
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
  displayName: string;
  email: string;
  following: { [userId: string]: boolean };
  joined: number;
  latestPost: Date | false;
  medium: string;
  photoURL: string | undefined;
  posts: { [postId: string]: boolean };
  location: string;
  website: string;
  pronouns: string;
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
    // Create a query to find documents where the "username" field matches the specified value
    const q = query(
      collection(firestore, 'users'),
      where('username', '==', username)
    );
    try {
      // Execute the query
      const querySnapshot = await getDocs(q);

      // Check if any documents match the query
      if (!querySnapshot.empty) {
        // Iterate over the documents that match the query
        querySnapshot.forEach((doc) => {
          // Access the data of each document
          return false;
        });
        return false;
      } else {
        // No documents matched the query
        return true;
      }
    } catch (error) {
      // Handle any errors that occur during the query
      console.error('Error getting documents:', error);
      return false;
    }
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

            await fetch('/email/signup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: result.user.email, username }),
            });

            const profileData: ProfileData = {
              username,
              displayName: user.displayName || '',
              url: username,
              bio: '',
              medium: '',
              location: '',
              website: '',
              pronouns: '',
              photoURL: user.photoURL || '/user-placeholder.png' || undefined,
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
                defaultFeed: 'global',
              },
            };
            setUser({
              uid: user.uid,
              displayName: user.displayName || '',
              photoURL: user.photoURL || '/user-placeholder.png',
              profile: {
                displayName: user.displayName || '',
                username: profileData?.username || '',
                url: profileData?.url || '',
                bio: profileData?.bio || '',
                medium: profileData?.medium || '',
                location: profileData?.location || '',
                website: profileData?.website || '',
                pronouns: profileData?.pronouns || '',
                photoURL: profileData?.photoURL || '/user-placeholder.png',
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
        newUsername = `${username}-${counter}`;
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
        displayName: user.displayName || username,
        username: newUsername,
        url: username,
        bio: '',
        medium: '',
        location: '',
        website: '',
        pronouns: '',
        photoURL: user.photoURL || '/user-placeholder.png' || undefined,
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

      await fetch('/email/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username }),
      });

      // Redirect to the profile edit page after successful sign-up
      router.push(`/edit-profile`);
    } catch (error) {
      console.error('Error signing up with email: ', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login succeeded, no need to return anything
    } catch (error) {
      // Login failed, throw an error with the error message
      throw new Error('Invalid email or password');
    }
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
    setUser,
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
          displayName: profileData?.displayName || '',
          photoURL: user.photoURL || '/user-placeholder.png',
          profile: {
            displayName: profileData?.displayName || '',
            username: profileData?.username || '',
            url: profileData?.url || '',
            bio: profileData?.bio || '',
            medium: profileData?.medium || '',
            location: profileData?.location || '',
            website: profileData?.website || '',
            pronouns: profileData?.pronouns || '',
            photoURL: profileData?.photoURL || '/user-placeholder',
            joined: profileData?.joined || '',
            latestPost: profileData?.latestPost || '',
            savedPosts: profileData?.savedPosts || {},
            following: profileData?.following || {},
            settings: {
              tenDay: profileData?.settings?.tenDay || false,
              fiveDay: profileData?.settings?.fiveDay || false,
              threeDay: profileData?.settings?.threeDay || false,
              oneDay: profileData?.settings?.oneDay || false,
              accountabilityNotice:
                profileData?.settings?.accountabilityNotice || false,
              lateImage: profileData?.settings?.lateImage || '',
              lateExcuse: profileData?.settings?.lateExcuse || '',
              defaultFeed: profileData?.settings?.defaultFeed || 'global',
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
