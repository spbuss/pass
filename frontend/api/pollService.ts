import { apiFetch } from './base';
import { Question, Comment } from '../types';

export const getFeed = async (): Promise<Question[]> => {
  return apiFetch<Question[]>('/questions');
};

export const createPoll = async (content: string, category: string): Promise<Question> => {
  return apiFetch<Question>('/questions', {
    method: 'POST',
    body: JSON.stringify({ content, category }),
  });
};

export const votePoll = async (id: string, vote: 'yes' | 'no'): Promise<void> => {
  return apiFetch<void>(`/questions/${id}/vote`, {
    method: 'POST',
    body: JSON.stringify({ vote }),
  });
};

export const likePoll = async (id: string): Promise<{ liked: boolean }> => {
  return apiFetch<{ liked: boolean }>(`/questions/${id}/like`, {
    method: 'POST',
  });
};

export const deletePoll = async (id: string): Promise<void> => {
  return apiFetch<void>(`/questions/${id}`, {
    method: 'DELETE',
  });
};

export const addComment = async (questionId: string, text: string, replyToId?: string): Promise<Comment> => {
  return apiFetch<Comment>(`/questions/${questionId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ text, replyToId }),
  });
};

export const getComments = async (questionId: string): Promise<Comment[]> => {
  return apiFetch<any[]>(`/questions/${questionId}/comments`).then(data => 
    data.map(c => ({
      id: c.id,
      userId: c.user.id,
      userName: c.user.name,
      userAvatar: c.user.avatar,
      text: c.text,
      createdAt: new Date(c.createdAt).getTime(),
      likes: c._count?.likes || 0,
      userLiked: false,
      replies: c.replies?.map((r: any) => ({
        id: r.id,
        userId: r.user.id,
        userName: r.user.name,
        userAvatar: r.user.avatar,
        text: r.text,
        createdAt: new Date(r.createdAt).getTime(),
        likes: 0,
        userLiked: false
      }))
    }))
  );
};
