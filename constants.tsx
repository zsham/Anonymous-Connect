
import { User, Post } from './types';

export const CURRENT_USER: User = {
  id: 'me',
  name: 'Neo_Root',
  handle: '@operator_01',
  avatar: 'https://picsum.photos/seed/hacker/200/200',
  bio: 'Systems Architect. White Rabbit Chaser. Reality Debugger. 🔌'
};

export const INITIAL_USERS: User[] = [
  { id: '1', name: 'Trinity_Sys', handle: '@gatekeeper', avatar: 'https://picsum.photos/seed/cyber1/200/200', isFollowing: true },
  { id: '2', name: 'Morpheus_Key', handle: '@dreamer', avatar: 'https://picsum.photos/seed/cyber2/200/200', isFollowing: false },
  { id: '3', name: 'Cypher_Null', handle: '@traitor_leak', avatar: 'https://picsum.photos/seed/cyber3/200/200', isFollowing: true },
  { id: '4', name: 'Oracle_Predict', handle: '@prophecy', avatar: 'https://picsum.photos/seed/cyber4/200/200', isFollowing: false },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    userId: '1',
    userName: 'Trinity_Sys',
    userHandle: '@gatekeeper',
    userAvatar: 'https://picsum.photos/seed/cyber1/200/200',
    content: '> Decrypting source code of the construct. \n> Status: 98% complete. \n> Beware of agents. They are everywhere.',
    image: 'https://picsum.photos/seed/code/1200/800',
    likes: 2048,
    comments: [],
    timestamp: '0x2F ago',
    isLiked: false
  },
  {
    id: 'p2',
    userId: '3',
    userName: 'Cypher_Null',
    userHandle: '@traitor_leak',
    userAvatar: 'https://picsum.photos/seed/cyber3/200/200',
    content: 'Ignorance is bliss. Why did I take the red pill? The steak tastes better in the simulation. 🥩💻',
    image: 'https://picsum.photos/seed/virtual/1200/800',
    likes: 42,
    comments: [
      { id: 'c1', userId: '1', userName: 'Trinity_Sys', userAvatar: 'https://picsum.photos/seed/cyber1/200/200', content: 'You always were a weak link in the chain.', timestamp: '0x0A ago' }
    ],
    timestamp: '0x4E ago',
    isLiked: true
  }
];
