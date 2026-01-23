
export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio?: string;
  isFollowing?: boolean;
  friendIds?: string[];
  incomingRequestIds?: string[];
  outgoingRequestIds?: string[];
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
  video?: string;
  groupId?: string; // Links post to a specific group
  likes: number;
  comments: Comment[];
  timestamp: string;
  isLiked: boolean;
}

export interface Group {
  id: string;
  name: string;
  handle: string;
  description: string;
  avatar: string;
  coverImage: string;
  memberIds: string[];
  adminIds: string[];
}

export enum TabType {
  HOME = 'home',
  EXPLORE = 'explore',
  NOTIFICATIONS = 'notifications',
  PROFILE = 'profile',
  GROUPS = 'groups',
  GROUP_DETAIL = 'group_detail'
}
