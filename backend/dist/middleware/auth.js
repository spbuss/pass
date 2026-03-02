"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const prisma_1 = __importDefault(require("../prisma"));
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        const user = await prisma_1.default.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }
        req.user = { id: user.id };
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
exports.authenticate = authenticate;
const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = { id: decoded.userId };
    }
    catch (e) {
        // Ignore invalid tokens for optional auth
    }
    next();
};
exports.optionalAuth = optionalAuth;
