"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../prisma"));
const jwt_1 = require("../utils/jwt");
const zod_1 = require("zod");
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    username: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const register = async (req, res) => {
    try {
        const { name, username, email, password } = registerSchema.parse(req.body);
        const existingUser = await prisma_1.default.user.findFirst({
            where: { OR: [{ email }, { username }] },
        });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                name,
                username,
                email,
                password: hashedPassword,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            },
        });
        const token = (0, jwt_1.signToken)({ userId: user.id });
        return res.status(201).json({ token, user: { id: user.id, name: user.name, username: user.username, avatar: user.avatar } });
    }
    catch (error) {
        return res.status(400).json({ error: 'Invalid data', details: error });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user)
            return res.status(400).json({ error: 'Invalid credentials' });
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid)
            return res.status(400).json({ error: 'Invalid credentials' });
        const token = (0, jwt_1.signToken)({ userId: user.id });
        return res.json({ token, user: { id: user.id, name: user.name, username: user.username, avatar: user.avatar } });
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: req.user.id },
        });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const { password, ...userData } = user;
        return res.json(userData);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};
exports.getMe = getMe;
const getUsers = async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
                bio: true,
                link: true,
            },
            take: 50,
        });
        return res.json(users);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error fetching users' });
    }
};
exports.getUsers = getUsers;
