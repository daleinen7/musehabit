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
    joined: number;
    latestPost: number | false;
    email: string;
    uid: string;
    posts: { string: boolean };
  };
  tags: string[] | null;
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
    displayName: string;
    username: string;
    url: string;
    bio?: string;
    medium?: string;
    location?: string;
    photoURL?: string;
    joined?: number;
    latestPost?: number | false;
    savedPosts: { [postId: string]: boolean };
    following: { [userId: string]: boolean };
    settings: {
      tenDay?: boolean;
      fiveDay?: boolean;
      threeDay?: boolean;
      oneDay?: boolean;
      accountabilityNotice?: boolean;
      lateImage?: string;
      lateExcuse?: string;
      defaultFeed?: 'global' | 'following';
    };
  };
};

export type ArtistType = {
  uid: string;
  username: string;
  location: string;
  photoURL: string;
  medium: string;
  joined: number;
  bio: string;
  latestPost: number | false;
  email: string;
  posts: { [postId: string]: boolean };
};

export type CommentType = {
  text: string;
  posterId: string;
  timestamp: number;
  username: string;
  photoURL: string | undefined;
};
