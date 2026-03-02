"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComments = exports.addComment = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const addComment = async (req, res) => {
    try {
        const { id } = req.params; // questionId
        const { text, replyToId } = req.body;
        const userId = req.user.id;
        const comment = await prisma_1.default.comment.create({
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
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to comment' });
    }
};
exports.addComment = addComment;
const getComments = async (req, res) => {
    try {
        const { id } = req.params;
        // In a real app, you would fetch recursively or flattened. 
        // For this simple version, we fetch all for the question and let frontend structure it,
        // or we fetch top level and include replies.
        const comments = await prisma_1.default.comment.findMany({
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
    }
    catch (error) {
        return res.status(500).json({ error: 'Error fetching comments' });
    }
};
exports.getComments = getComments;
