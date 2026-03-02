
export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  link?: string;
  followers: number;
  following: number;
}

export interface Question {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  category: string;
  yesVotes: number;
  noVotes: number;
  userVote: 'yes' | 'no' | null;
  likes: number;
  userLiked: boolean;
  createdAt: number;
}

export type View = 'home' | 'search' | 'add' | 'feed' | 'profile' | 'edit-profile' | 'notifications' | 'single-poll' | 'user-profile';
