"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth = __importStar(require("../controllers/authController"));
const poll = __importStar(require("../controllers/pollController"));
const comment = __importStar(require("../controllers/commentController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/* =========================
   AUTH ROUTES
========================= */
// Register
router.post('/auth/register', auth.register);
// Login
router.post('/auth/login', auth.login);
// Logged-in user
router.get('/auth/me', auth_1.authenticate, auth.getMe);
// Users list (login optional)
router.get('/users', auth_1.optionalAuth, auth.getUsers);
/* =========================
   QUESTIONS / POLLS
========================= */
// ✅ PUBLIC FEED (FIX APPLIED)
router.get('/questions', poll.getFeed);
// Create question (login required)
router.post('/questions', auth_1.authenticate, poll.createPoll);
// Delete question
router.delete('/questions/:id', auth_1.authenticate, poll.deletePoll);
// Vote
router.post('/questions/:id/vote', auth_1.authenticate, poll.votePoll);
// Like
router.post('/questions/:id/like', auth_1.authenticate, poll.likePoll);
/* =========================
   COMMENTS
========================= */
// Public comments
router.get('/questions/:id/comments', comment.getComments);
// Add comment (login required)
router.post('/questions/:id/comments', auth_1.authenticate, comment.addComment);
/* =========================
   HEALTH CHECK
========================= */
router.get('/healthz', (req, res) => res.status(200).json({ status: 'ok' }));
exports.default = router;
