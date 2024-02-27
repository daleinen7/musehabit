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
  updateProfile,
} from 'firebase/auth';
import { auth, firestore } from '@/app/lib/firebase';
import { getDoc, doc, setDoc } from 'firebase/firestore';

type User = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  profile: {
    username: string;
  };
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
  resetPassword: (email: string) => void;
  createUser: (email: string, password: string) => void;
  emailSignUp: (email: string, password: string, username: string) => void;
  emailSignIn: (email: string, password: string) => void;
  updateProfile: (displayName: string, photoURL: string) => void;
  googleSignIn: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: () => {},
  signOut: () => {},
  resetPassword: () => {},
  createUser: () => {},
  emailSignUp: () => {},
  emailSignIn: () => {},
  googleSignIn: () => {},
  updateProfile: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const googleSignIn = () => {
    signInWithRedirect(auth, new GoogleAuthProvider());
  };

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
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    console.log('USER: ', user);

    await setDoc(doc(firestore, 'users', user.uid), {
      username,
      email: user.email,
      uid: user.uid,
      photoURL: user.photoURL,
    });
  };

  const signIn = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password);
  };

  // const updateProfile = (displayName: string, photoURL: string) => {
  //   if (auth.currentUser) {
  //     updateProfile(auth.currentUser.uid, displayName, photoURL);
  //   }
  // };

  const value = {
    user,
    loading,
    googleSignIn,
    signOut: () => signOut(auth),
    resetPassword,
    createUser,
    signIn,
    updateProfile,
    signInWithGoogle: googleSignIn,
    emailSignUp,
    emailSignIn: () => {},
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        const profileData = userDoc.data();
        setUser({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          profile: {
            username: profileData?.username || '',
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
