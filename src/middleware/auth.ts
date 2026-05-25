import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
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

    // TODO: Verify JWT token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // req.userId = decoded.id;
    // req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid token',
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
      // TODO: Verify JWT token
      // const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      // req.userId = decoded.id;
      // req.user = decoded;
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
