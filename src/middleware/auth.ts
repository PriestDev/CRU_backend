import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      user?: any;
      token?: string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({
        status: 'error',
        message: 'No token provided',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const decoded = jwt.verify(token, jwtSecret) as any;
    req.userId = decoded.id;
    req.user = decoded;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: error instanceof jwt.TokenExpiredError ? 'Token has expired' : 'Invalid token',
      timestamp: new Date().toISOString(),
    });
  }
};

export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      // Verify JWT token
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      const decoded = jwt.verify(token, jwtSecret) as any;
      req.userId = decoded.id;
      req.user = decoded;
      req.token = token;
    }

    next();
  } catch (error) {
    // Continue without authentication even if token is invalid
    next();
  }
};

export const adminOnlyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user || req.user.role !== 'staff') {
      res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin privileges required.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  } catch (error) {
    res.status(403).json({
      status: 'error',
      message: 'Unauthorized access',
      timestamp: new Date().toISOString(),
    });
  }
};
