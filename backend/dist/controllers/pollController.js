"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePoll = exports.likePoll = exports.votePoll = exports.getFeed = exports.createPoll = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const createPoll = async (req, res) => {
    try {
        const { content, category } = req.body;
        const question = await prisma_1.default.question.create({
            data: {
                content,
                category,
                authorId: req.user.id,
            },
        });
        return res.status(201).json(question);
    }
    catch (error) {
        return res.status(500).json({ error: 'Could not create poll' });
    }
};
exports.createPoll = createPoll;
const getFeed = async (req, res) => {
    try {
        const currentUserId = req.user?.id;
        const questions = await prisma_1.default.question.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                author: { select: { id: true, name: true, avatar: true } },
                comments: { select: { id: true } },
                likes: { where: { userId: currentUserId } },
                votes: true,
                _count: { select: { likes: true, votes: true } },
            },
        });
        const formatted = questions.map(q => {
            const userVote = currentUserId ? q.votes.find(v => v.userId === currentUserId) : null;
            const yesVotes = q.votes.filter(v => v.voteType === 'YES').length;
            const noVotes = q.votes.filter(v => v.voteType === 'NO').length;
            return {
                id: q.id,
                authorId: q.author.id,
                authorName: q.author.name,
                authorAvatar: q.author.avatar,
                content: q.content,
                category: q.category,
                yesVotes,
                noVotes,
                userVote: userVote ? (userVote.voteType === 'YES' ? 'yes' : 'no') : null,
                likes: q._count.likes,
                userLiked: q.likes.length > 0,
                comments: q.comments, // Simplified for feed
                createdAt: q.createdAt.getTime(),
            };
        });
        return res.json(formatted);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error fetching feed' });
    }
};
exports.getFeed = getFeed;
const votePoll = async (req, res) => {
    try {
        const { id } = req.params;
        const { vote } = req.body; // 'yes' or 'no'
        const userId = req.user.id;
        const voteType = vote === 'yes' ? 'YES' : 'NO';
        // Upsert vote
        await prisma_1.default.vote.upsert({
            where: { userId_questionId: { userId, questionId: id } },
            update: { voteType },
            create: { userId, questionId: id, voteType },
        });
        return res.json({ success: true });
    }
    catch (error) {
        return res.status(500).json({ error: 'Vote failed' });
    }
};
exports.votePoll = votePoll;
const likePoll = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const existing = await prisma_1.default.like.findFirst({
            where: { userId, questionId: id }
        });
        if (existing) {
            await prisma_1.default.like.delete({ where: { id: existing.id } });
            return res.json({ liked: false });
        }
        else {
            await prisma_1.default.like.create({ data: { userId, questionId: id } });
            return res.json({ liked: true });
        }
    }
    catch (error) {
        return res.status(500).json({ error: 'Action failed' });
    }
};
exports.likePoll = likePoll;
const deletePoll = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const poll = await prisma_1.default.question.findUnique({ where: { id } });
        if (!poll || poll.authorId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        await prisma_1.default.question.delete({ where: { id } });
        return res.json({ success: true });
    }
    catch (error) {
        return res.status(500).json({ error: 'Delete failed' });
    }
};
exports.deletePoll = deletePoll;
