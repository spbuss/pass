import { Router } from 'express';
import * as auth from '../controllers/authController';
import * as poll from '../controllers/pollController';
import * as comment from '../controllers/commentController';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

/* =========================
   AUTH ROUTES
========================= */

// Register
router.post('/auth/register', auth.register);

// Login
router.post('/auth/login', auth.login);

// Logged-in user
router.get('/auth/me', authenticate, auth.getMe);

// Users list (login optional)
router.get('/users', optionalAuth, auth.getUsers);


/* =========================
   QUESTIONS / POLLS
========================= */

// ✅ PUBLIC FEED (FIX APPLIED)
router.get('/questions', poll.getFeed);

// Create question (login required)
router.post('/questions', authenticate, poll.createPoll);

// Delete question
router.delete('/questions/:id', authenticate, poll.deletePoll);

// Vote
router.post('/questions/:id/vote', authenticate, poll.votePoll);

// Like
router.post('/questions/:id/like', authenticate, poll.likePoll);


/* =========================
   COMMENTS
========================= */

// Public comments
router.get('/questions/:id/comments', comment.getComments);

// Add comment (login required)
router.post(
  '/questions/:id/comments',
  authenticate,
  comment.addComment
);


/* =========================
   HEALTH CHECK
========================= */

router.get('/healthz', (req, res) =>
  res.status(200).json({ status: 'ok' })
);

export default router;