const AuthService = require('../services/authService');

const EXCLUDED_PATHS = [
    '/auth/login',
    '/email/'
];

const authMiddleware = (req, res, next) => {
    if (EXCLUDED_PATHS.includes(req.path)|| req.path.startsWith('/api/email/quote')) return next();

    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    try {
        const user = AuthService.verifyToken(token);
        req.user = user;
        next();
    } catch (err) {
        console.log("Token invalide détécté");
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;