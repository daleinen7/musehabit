'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/app/lib/firebase';
import { useAuth } from '@/app/context/AuthContext';
import FormInput from '../components/FormInput';
import uploadFileToStorage from '../lib/uploadFileToStorage';

const formData = [
  {
    id: 'profileImage',
    type: 'file',
    condition: 'profileImage',
    label: 'Upload Profile Image',
  },
  {
    id: 'displayName',
    type: 'text',
    label: 'What name would you like to be displayed on your profile?',
    placeholder: 'display name',
  },
  {
    id: 'medium',
    type: 'text',
    label: 'What kind of work do you do?',
    placeholder: 'Painter, Sculptor, Theremin composer, etc.',
  },
  {
    id: 'location',
    type: 'text',
    label: 'Where are you located?',
    placeholder: 'location',
  },
  {
    id: 'bio',
    type: 'textarea',
    label: 'Tell everyone a little bit about yourself:',
    placeholder: 'bio',
  },
];

const EditProfile = () => {
  const [form, setForm] = useState({
    profileImage: '',
    displayName: '',
    location: '',
    medium: '',
    bio: '',
  });

  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      setForm((prevForm) => ({
        ...prevForm,
        profileImage: user.profile.photoURL || '',
        // displayName: user.profile.displayName || '',
        location: user.profile.location || '',
        bio: user.profile.bio || '',
        medium: user.profile.medium || '',
      }));

      setImagePreview(user.photoURL);
    }
  }, [user]);

  // const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       setImagePreview(event.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //     setForm({ ...form, profileImage: file });
  //   }
  // };

  // const handleFormChange = (e) => {
  //   setForm({ ...form, [e.target.id]: e.target.value });
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (form.profileImage) {
  //     let profileImageUrl = '';

  //     if (typeof form.profileImage === 'string') {
  //       // If form.profileImage is a string, assume it's a URL (Google profile image URL)
  //       profileImageUrl = form.profileImage;
  //     } else if (form.profileImage) {
  //       // If form.profileImage is a file, proceed with uploading it
  //       const fileExtension = (form.profileImage as File).name.split('.').pop();
  //       profileImageUrl = await uploadFileToStorage(
  //         storage,
  //         `users/${user.uid}/profile.${fileExtension}`,
  //         form.profileImage as File
  //       );
  //     }

  //     form.profileImageUrl = profileImageUrl;
  //   }

  //   await updateUserProfile(form);
  //   router.push(`/artist/${userProfile.url}/profile`);
  // };

  return <>edit profile</>;
};
export default EditProfile;
