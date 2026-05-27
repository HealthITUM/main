import jwt from 'jsonwebtoken';
export const authMiddleware = (req, res, next) => {
    console.log(`[AUTH] Checking token for path: ${req.path} Method: ${req.method}`);
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Ni žetona, dostop zavrnjen" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            username: decoded.username
        };
        next();
    }
    catch (error) {
        res.status(403).json({ message: "Žeton ni veljaven" });
    }
};
