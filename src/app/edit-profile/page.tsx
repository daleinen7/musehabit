'use client';
import React, { useState, useEffect, FormEventHandler } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { storage } from '@/app/lib/firebase';
import { useAuth } from '@/app/context/AuthContext';
import FormInput from '../components/FormInput';
import uploadFileToStorage from '../lib/uploadFileToStorage';
import icons from '../lib/icons';

interface ProfileFormState {
  profileImage: File | string | null;
  profileImageUrl: string;
  photoUrl: string;
  displayName: string;
  location: string;
  website: string;
  pronouns: string;
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
    id: 'pronouns',
    type: 'text',
    label: 'What are your pronouns?',
    placeholder: 'he/him, she/her, they/them ...',
  },
  {
    id: 'website',
    type: 'text',
    label: 'Link to your website',
    placeholder: 'www.yourwebsite.com',
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
    id: 'thirtyDay',
    type: 'checkbox',
    condition: 'profileImage',
    label: 'New Month! Get notified when you can post again',
  },
  {
    id: 'tenDay',
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
  // {
  //   id: 'lateImage',
  //   type: 'file',
  //   condition: 'profileImage',
  //   label: 'Upload an image you’d like to show if you miss your post date',
  // },
  // {
  //   id: 'lateExcuse',
  //   type: 'text',
  //   label:
  //     'If you miss your post date, what would you like your message to say?',
  //   placeholder: 'display name',
  // },
  {
    id: 'heading',
    value: 'What is your ideal default home feed?',
  },
  {
    id: 'global',
    type: 'radio',
    label: 'Global',
    value: 'global',
    name: 'defaultFeed',
  },
  {
    id: 'following',
    type: 'radio',
    label: 'Following',
    value: 'following',
    name: 'defaultFeed',
  },
];

const EditProfile = () => {
  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    profileImage: null,
    profileImageUrl: '',
    website: '',
    pronouns: '',
    photoUrl: '/user-placeholder.png',
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

  const [hasVisited, setHasVisited] = useState(false);

  const [selectedFeed, setSelectedFeed] = useState('profile');

  const { user, setUser, updateUserProfile } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null | undefined>(
    null
  );

  const router = useRouter();

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) {
      router.push('/login');
    }

    if (selectedFeed === 'profile' && user && user.profile) {
      setProfileForm((prevForm) => ({
        ...prevForm,
        profileImage: user.profile.photoURL || '/user-placeholder.png',
        displayName: user.profile.displayName || '',
        location: user.profile.location || '',
        pronouns: user.profile.pronouns || '',
        website: user.profile.website || '',
        bio: user.profile.bio || '',
        medium: user.profile.medium || '',
      }));

      setImagePreview(user.profile.photoURL);
    }

    if (selectedFeed === 'account' && user && user.profile) {
      const userProfileSettings = user.profile.settings;

      if (userProfileSettings) {
        setAccountForm((prevForm) => ({
          ...prevForm,
          tenDay: userProfileSettings.tenDay || false,
          fiveDay: userProfileSettings.fiveDay || false,
          threeDay: userProfileSettings.threeDay || false,
          oneDay: userProfileSettings.oneDay || false,
          lateImage: userProfileSettings.lateImage || null,
          lateExcuse: userProfileSettings.lateExcuse || '',
          defaultFeed: userProfileSettings.defaultFeed || 'global',
        }));
      }
    }
  }, [user, selectedFeed, router]);

  useEffect(() => {
    if (
      user &&
      user.profile.photoURL &&
      (user?.profile?.photoURL.includes('googleusercontent') ||
        user.profile.photoURL === '/user-placeholder.png') &&
      !user.profile.bio &&
      !user.profile.location &&
      !user.profile.medium &&
      !user.profile.pronouns &&
      !user.profile.website &&
      !user.profile.latestPost
    )
      setHasVisited(false);
    else setHasVisited(true);
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
    const { id, value, type, checked, name } = e.target;
    if (selectedFeed === 'profile') {
      setProfileForm((prevProfileForm) => ({
        ...prevProfileForm,
        [id]: type === 'checkbox' ? checked : value,
      }));
    } else {
      setAccountForm((prevAccountForm) => ({
        ...prevAccountForm,
        [name || id]: type === 'checkbox' ? checked : value,
      }));
    }
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
        website: profileForm.website,
        pronouns: profileForm.pronouns,
        medium: profileForm.medium,
        bio: profileForm.bio,
        photoURL: profileForm.photoUrl,
      });

      const newProfile = {
        ...user.profile,
        displayName: profileForm.displayName,
        location: profileForm.location,
        website: profileForm.website,
        pronouns: profileForm.pronouns,
        medium: profileForm.medium,
        bio: profileForm.bio,
        photoURL: profileForm.photoUrl,
      };

      setUser({ ...user, profile: newProfile });

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
      <div className="w-full flex min-h-screen">
        {hasVisited && (
          <div className="w-full max-w-[20rem] min-h-screen sticky bg-medium-gray flex flex-col text-xl align-center gap-3">
            <h2 className="font-bold text-2xl my-6 px-6">Account</h2>
            <button
              className={`hover:bg-dark-gray w-[14rem] mx-auto rounded py-4 flex items-center justify-start gap-2 ${
                selectedFeed === 'profile' ? 'bg-dark-gray-h' : ''
              }`}
              onClick={() => setSelectedFeed('profile')}
            >
              <div className="text-xl ml-4">{icons.user}</div>Profile
            </button>
            <button
              className={`hover:bg-dark-gray w-[14rem] mx-auto rounded py-4 flex items-center justify-start gap-2 ${
                selectedFeed === 'account' ? 'bg-dark-gray-h' : ''
              }`}
              onClick={() => setSelectedFeed('account')}
            >
              <div className="text-xl ml-4">{icons.settings}</div>Account
            </button>
          </div>
        )}

        {selectedFeed === 'profile' ? (
          <div className="width-wrapper flex items-center flex-col gap-9 max-w-[40rem] pt-6 pb-12">
            {!hasVisited && (
              <Link
                href={`/artist/${user.profile.username}`}
                className="underline self-end my-6"
              >
                I&apos;ll do this later
              </Link>
            )}
            {user.profile.displayName ? (
              <h2 className=" font-satoshi text-[2.25rem] font-bold text-center leading-tight">
                Hey {user.displayName}! <br /> Welcome to your Musehabit
                Profile.
              </h2>
            ) : (
              <h2 className=" font-satoshi text-[2.25rem] font-bold">
                Edit Profile
              </h2>
            )}

            <p className="font-satoshi text-[1.5rem] text-center">
              Now that you&apos;ve created your account, let&apos;s build it
              out.
            </p>
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Profile Preview"
                width={128}
                height={128}
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
                        className="rounded border-[1px] border-light-gray px-[1rem] py-[0.625rem] -mt-3  text-[1.125rem] hover:bg-dark-gray cursor-pointer border-dashed flex items-center justify-center gap-2"
                      >
                        <span className="text-xl">{icons.plus}</span>{' '}
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
              <button type="submit" className="btn btn-primary">
                Save Profile Info
              </button>
            </form>
          </div>
        ) : (
          <div className="width-wrapper mb-12">
            <h2 className="font-satoshi text-[2.25rem] font-bold text-center mt-4">
              Account Settings
            </h2>

            <form
              onSubmit={
                handleSubmit as unknown as FormEventHandler<HTMLFormElement>
              }
              className="flex flex-col items-start gap-[1.5rem] w-full"
            >
              {accountFormData.map((item, idx) => (
                <React.Fragment key={idx}>
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
                      name={item.name}
                      value={String(
                        accountForm[
                          item.name
                            ? (item.name as keyof typeof accountForm)
                            : (item.id as keyof typeof accountForm)
                        ]
                      )}
                      profile
                    />
                  )}
                </React.Fragment>
              ))}
              <button type="submit" className="btn btn-primary cursor-pointer">
                Save Profile Info
              </button>
            </form>
          </div>
        )}
      </div>
    )
  );
};
export default EditProfile;
