import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { AppError } from './error.middleware';
import { Role } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.access_token ||
      req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: Role;
    };

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      throw new AppError('User not found', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid or expired token', 401));
    } else {
      next(err);
    }
  }
};

export const requireAdmin = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== Role.ADMIN) {
    return next(new AppError('Admin access required', 403));
  }
  next();
};
