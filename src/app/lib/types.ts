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
  poster: string;
  posterData: {
    username: string;
    displayName: string;
    location: string;
    pronouns: string;
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
    website?: string;
    pronouns?: string;
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
  // notifications?: NotificationType[];
  notifications: any;
};

export type ArtistType = {
  uid: string;
  username: string;
  displayName: string;
  location: string;
  photoURL: string;
  medium: string;
  joined: number;
  bio: string;
  latestPost: number | false;
  email: string;
  website: string;
  pronouns: string;
  posts: { [postId: string]: boolean };
};

export type NotificationType = {
  type: 'comment' | 'follow';
  postId?: string;
  commentId?: string;
  commenterId?: string;
  commenterUsername?: string;
  followerId?: string;
  timestamp: number;
  read: boolean;
  followerProfile?: ArtistType;
  post?: PostType;
  uid: string;
};

export type CommentType = {
  text: string;
  posterId: string;
  timestamp: number;
  username: string;
  displayName: string;
  photoURL?: string | undefined;
  commenterProfile?: any;
};
