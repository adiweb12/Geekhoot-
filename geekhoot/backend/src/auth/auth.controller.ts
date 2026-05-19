import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { AuthRequest } from '../common/middleware/auth.middleware';
import { prisma } from '../common/prisma';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 15 * 60 * 1000, // 15 minutes
};

const REFRESH_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, accessToken, refreshToken } = await authService.signup(req.body);

    res.cookie('access_token', accessToken, COOKIE_OPTIONS);
    res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS);

    res.status(201).json({ success: true, user, accessToken });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);

    res.cookie('access_token', accessToken, COOKIE_OPTIONS);
    res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS);

    res.json({ success: true, user, accessToken });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refresh_token || req.body.refreshToken;
    if (!token) return res.status(401).json({ error: 'Refresh token required' });

    const tokens = await authService.refresh(token);

    res.cookie('access_token', tokens.accessToken, COOKIE_OPTIONS);
    res.cookie('refresh_token', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

    res.json({ success: true, accessToken: tokens.accessToken });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refresh_token;
    if (token) await authService.logout(token);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, name: true, email: true, phone: true, role: true,
        houseName: true, street: true, landmark: true,
        district: true, state: true, pincode: true,
        latitude: true, longitude: true, createdAt: true,
      },
    });

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
