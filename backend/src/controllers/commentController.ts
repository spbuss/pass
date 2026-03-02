import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth';

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // questionId
    const { text, replyToId } = req.body;
    const userId = req.user!.id;

    const comment = await prisma.comment.create({
      data: {
        text,
        userId,
        questionId: id,
        parentId: replyToId || null,
      },
      include: {
        user: true,
      }
    });

    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to comment' });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // In a real app, you would fetch recursively or flattened. 
    // For this simple version, we fetch all for the question and let frontend structure it,
    // or we fetch top level and include replies.
    const comments = await prisma.comment.findMany({
      where: { questionId: id, parentId: null },
      include: {
        user: true,
        replies: {
          include: { user: true }
        },
        likes: true,
        _count: { select: { likes: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(comments);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching comments' });
  }
};