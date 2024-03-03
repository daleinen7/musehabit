export type PostType = {
  id: string;
  title: string;
  draft: string;
  post: string;
  image: string;
  description: string;
  format: string;
  medium: string;
  location: string;
  postedAt: string;
  posterData: {
    username: string;
    location: string;
    photoURL: string;
    medium: string;
  };
  tags: string[];
  toolsUsed: string;
  uid: string;
  username: string;
  userProfile: string;
};

export type UserType = {
  uid: string;
  email?: string;
  displayName: string;
  photoURL: string;
  profile: {
    username: string;
    url: string;
    bio?: string;
    medium?: string;
    location?: string;
    photoURL?: string;
    joined?: number;
    latestPost?: number | false;
    settings: {
      dayBeforeNotification?: boolean;
      weekBeforeNotification?: boolean;
      tenDaysBefore?: boolean;
      accountabilityNotice?: boolean;
    };
  };
};
