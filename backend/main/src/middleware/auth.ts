import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        id: Number;
        username: string;
    };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log(`[AUTH] Checking token for path: ${req.path} Method: ${req.method}`);
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Ni žetona, dostop zavrnjen" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        
        req.user = {
            id: decoded.id,
            username: decoded.username
        };

        next();
    } catch (error) {
        res.status(403).json({ message: "Žeton ni veljaven" });
    }
};