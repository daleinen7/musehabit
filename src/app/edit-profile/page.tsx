'use client';
import React, { useState, useEffect, FormEventHandler } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { storage } from '@/app/lib/firebase';
import { useAuth } from '@/app/context/AuthContext';
import FormInput from '../components/FormInput';
import uploadFileToStorage from '../lib/uploadFileToStorage';

interface ProfileFormState {
  profileImage: File | string | null;
  profileImageUrl: string;
  photoUrl: string;
  displayName: string;
  location: string;
  medium: string;
  bio: string;
}

const profileFormData = [
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
  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    profileImage: null,
    profileImageUrl: '',
    photoUrl: '',
    displayName: '',
    location: '',
    medium: '',
    bio: '',
  });

  const [selectedFeed, setSelectedFeed] = useState('profile');

  const { user, updateUserProfile } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null | undefined>(
    null
  );

  const router = useRouter();

  useEffect(() => {
    if (user) {
      setProfileForm((prevForm) => ({
        ...prevForm,
        profileImage: user.profile.photoURL || null,
        displayName: user.profile.displayName || '',
        location: user.profile.location || '',
        bio: user.profile.bio || '',
        medium: user.profile.medium || '',
      }));

      setImagePreview(user.profile.photoURL);
    }
  }, [user]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) setImagePreview(event.target.result as string);
      };
      reader.readAsDataURL(file);
      setProfileForm({ ...profileForm, profileImage: file });
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({ ...profileForm, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!user) return;

    if (profileForm.profileImage) {
      let profileImageUrl = '';

      if (typeof profileForm.profileImage === 'string') {
        // If form.profileImage is a string, assume it's a URL (Google profile image URL)
        profileImageUrl = profileForm.profileImage;
      } else if (profileForm.profileImage) {
        // If form.profileImage is a file, proceed with uploading it
        const fileExtension = (profileForm.profileImage as File).name
          .split('.')
          .pop();
        profileImageUrl = await uploadFileToStorage(
          storage,
          `users/${user.uid}/profile.${fileExtension}`,
          profileForm.profileImage as File
        );
      }

      profileForm.photoUrl = profileImageUrl;
    }

    await updateUserProfile(user.uid, {
      displayName: profileForm.displayName,
      location: profileForm.location,
      medium: profileForm.medium,
      bio: profileForm.bio,
      photoURL: profileForm.photoUrl,
    });
    router.push(`/artist/${user.profile.username}`);
  };

  return (
    user && (
      <>
        <div className="w-full width-wrapper flex text-xl font-hepta text-center font-bold mt-8">
          <button
            className={`w-full border-b border-b-slate-700 py-4 ${
              selectedFeed === 'profile' ? 'bg-slate-200' : ''
            }`}
            onClick={() => setSelectedFeed('profile')}
          >
            Profile
          </button>
          <button
            className={`w-full border-b border-b-slate-700 py-4 ${
              selectedFeed === 'account' ? 'bg-slate-200' : ''
            }`}
            onClick={() => setSelectedFeed('account')}
          >
            <span>Account</span>
          </button>
        </div>
        )
        <div className="flex flex-col gap-[2.5rem] items-center">
          <Link
            href={`/artist/${user.profile.url}`}
            className="underline self-end"
          >
            I&apos;ll do this later
          </Link>
          {user.displayName ? (
            <h2 className=" font-satoshi text-[2.25rem] font-bold text-center">
              Hey {user.displayName}! <br /> Welcome to your Musehabit Profile.
            </h2>
          ) : (
            <h2 className=" font-satoshi text-[2.25rem] font-bold">
              Edit Profile
            </h2>
          )}

          <p className="font-satoshi text-[1.5rem]">
            Now that you&apos;ve created your account, let&apos;s build it out.
          </p>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Profile Preview"
              className="mt-2 w-32 h-32 object-cover rounded-full"
            />
          )}
          <form
            onSubmit={
              handleSubmit as unknown as FormEventHandler<HTMLFormElement>
            }
            className="flex flex-col items-center gap-[1.5rem] w-full"
          >
            {profileFormData.map((item) => (
              <React.Fragment key={item.id}>
                {item.id === 'profileImage' ? (
                  <>
                    <label
                      htmlFor={item.id}
                      className="rounded border-[1px] border-black px-[1rem] py-[0.625rem] text-[1.125rem] hover:bg-gray-200 cursor-pointer"
                    >
                      {item.label}
                      <input
                        type={item.type}
                        id={item.id}
                        onChange={handleFileInputChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  </>
                ) : (
                  <FormInput
                    id={item.id}
                    type={item.type}
                    label={item.label}
                    handleFormChange={handleFormChange}
                    value={String(
                      profileForm[item.id as keyof typeof profileForm]
                    )}
                    profile
                  />
                )}
              </React.Fragment>
            ))}
            <button
              type="submit"
              className="mt-6 bg-gray-400 rounded-md px-[0.875rem] py-[0.625rem]"
            >
              Save Profile Info
            </button>
          </form>
        </div>
      </>
    )
  );
};
export default EditProfile;
