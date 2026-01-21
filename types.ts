
export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio?: string;
  isFollowing?: boolean;
}

export interface AuthUser extends User {
  accessKey: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  isLiked: boolean;
}

export enum TabType {
  HOME = 'home',
  EXPLORE = 'explore',
  NOTIFICATIONS = 'notifications',
  PROFILE = 'profile',
}
