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

interface AccountFormState {
  tenDay?: boolean;
  fiveDay?: boolean;
  threeDay?: boolean;
  oneDay?: boolean;
  lateImage?: File | string | null;
  lateImageUrl?: string;
  lateExcuse?: string;
  defaultFeed?: 'global' | 'following';
  id?: string;
  value?: string;
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

const accountFormData = [
  {
    id: 'heading',
    value: 'Accountability Settings',
  },
  {
    id: 'heading',
    label:
      'When would you like to receive an email reminder about your post date?',
  },
  {
    id: 'tenDAy',
    type: 'checkbox',
    condition: 'profileImage',
    label: '10 Days Before',
  },
  {
    id: 'fiveDay',
    type: 'checkbox',
    condition: 'profileImage',
    label: '5 Days Before',
  },
  {
    id: 'threeDay',
    type: 'checkbox',
    condition: 'profileImage',
    label: '3 Days Before',
  },
  {
    id: 'oneDay',
    type: 'checkbox',
    condition: 'profileImage',
    label: '1 Day Before',
  },
  {
    id: 'lateImage',
    type: 'file',
    condition: 'profileImage',
    label: 'Upload an image you’d like to show if you miss your post date',
  },
  {
    id: 'lateExcuse',
    type: 'text',
    label:
      'If you miss your post date, what would you like your message to say?',
    placeholder: 'display name',
  },
  {
    id: 'heading',
    value: 'Default Feed',
  },
  {
    id: 'defaultFeed',
    type: 'radio',
    label: 'What is your ideal default home feed?',
    placeholder: 'Painter, Sculptor, Theremin composer, etc.',
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

  const [accountForm, setAccountForm] = useState<AccountFormState>({
    tenDay: false,
    fiveDay: false,
    threeDay: false,
    oneDay: false,
    lateImage: null,
    lateImageUrl: '',
    lateExcuse: '',
    defaultFeed: 'global',
  });

  const [selectedFeed, setSelectedFeed] = useState('profile');

  const { user, updateUserProfile } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null | undefined>(
    null
  );

  const router = useRouter();

  useEffect(() => {
    if (user && selectedFeed === 'profile') {
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

    if (user && selectedFeed === 'account') {
      setAccountForm((prevForm) => ({
        ...prevForm,
        tenDay: user.profile.settings.tenDay || false,
        fiveDay: user.profile.settings.fiveDay || false,
        threeDay: user.profile.settings.threeDay || false,
        oneDay: user.profile.settings.oneDay || false,
        lateImage: user.profile.settings.lateImage || null,
        lateExcuse: user.profile.settings.lateExcuse || '',
        defaultFeed: user.profile.settings.defaultFeed || 'global',
      }));
    } else {
      console.error('User is missing');
    }
  }, [user, selectedFeed]);

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

    if (selectedFeed === 'profile') {
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
    } else {
      await updateUserProfile(user.uid, {
        settings: {
          tenDay: accountForm.tenDay,
          fiveDay: accountForm.fiveDay,
          threeDay: accountForm.threeDay,
          oneDay: accountForm.oneDay,
          lateImage: accountForm.lateImage,
          lateExcuse: accountForm.lateExcuse,
          defaultFeed: accountForm.defaultFeed,
        },
      });
      router.push(`/artist/${user.profile.username}`);
    }
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

        {selectedFeed === 'profile' ? (
          <div className="flex flex-col gap-[2.5rem] items-center">
            <Link
              href={`/artist/${user.profile.url}`}
              className="underline self-end"
            >
              I&apos;ll do this later
            </Link>
            {user.displayName ? (
              <h2 className=" font-satoshi text-[2.25rem] font-bold text-center">
                Hey {user.displayName}! <br /> Welcome to your Musehabit
                Profile.
              </h2>
            ) : (
              <h2 className=" font-satoshi text-[2.25rem] font-bold">
                Edit Profile
              </h2>
            )}

            <p className="font-satoshi text-[1.5rem]">
              Now that you&apos;ve created your account, let&apos;s build it
              out.
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
        ) : (
          <div className="width-wrapper">
            <h2 className="font-satoshi text-[2.25rem] font-bold text-center mt-4">
              Account Settings
            </h2>

            <form
              onSubmit={
                handleSubmit as unknown as FormEventHandler<HTMLFormElement>
              }
              className="flex flex-col items-start gap-[1.5rem] w-full"
            >
              {accountFormData.map((item) => (
                <React.Fragment key={item.id}>
                  {item.id === 'heading' ? (
                    item.value ? (
                      <h3 className="text-left border-b-[1px] text-3xl w-full mt-12">
                        {item.value}
                      </h3>
                    ) : (
                      <p>{item.label}</p>
                    )
                  ) : (
                    <FormInput
                      id={item.id}
                      type={item.type || ''}
                      label={item.label || ''}
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
        )}
      </>
    )
  );
};
export default EditProfile;
