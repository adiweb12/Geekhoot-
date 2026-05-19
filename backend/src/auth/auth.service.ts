import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../common/prisma';
import { AppError } from '../common/middleware/error.middleware';

const SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

export interface SignupData {
  name: string;
  phone: string;
  email: string;
  password: string;
  houseName?: string;
  street?: string;
  landmark?: string;
  district?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

export interface LoginData {
  identifier: string; // email or phone
  password: string;
}

const generateTokens = (user: { id: string; email: string; role: string }) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
  const refreshToken = uuidv4();
  return { accessToken, refreshToken };
};

export const signup = async (data: SignupData) => {
  // Check for duplicate email/phone
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: data.email }, { phone: data.phone }] },
  });

  if (existing) {
    if (existing.email === data.email) {
      throw new AppError('Email already registered', 409);
    }
    throw new AppError('Phone number already registered', 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
      password: hashedPassword,
      houseName: data.houseName,
      street: data.street,
      landmark: data.landmark,
      district: data.district,
      state: data.state,
      pincode: data.pincode,
      latitude: data.latitude,
      longitude: data.longitude,
      role: 'ADMIN',
    },
    select: {
      id: true, name: true, email: true, phone: true,
      role: true, district: true, state: true, createdAt: true,
    },
  });

  const { accessToken, refreshToken } = generateTokens(user);

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
    },
  });

  return { user, accessToken, refreshToken };
};

export const login = async (data: LoginData) => {
  const isEmail = data.identifier.includes('@');

  const user = await prisma.user.findFirst({
    where: isEmail
      ? { email: data.identifier }
      : { phone: data.identifier },
  });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const { accessToken, refreshToken } = generateTokens(user);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
    },
  });

  const { password: _pw, ...safeUser } = user;

  return { user: safeUser, accessToken, refreshToken };
};

export const refresh = async (token: string) => {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: storedToken.userId },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    throw new AppError('User not found', 401);
  }

  // Rotate refresh token
  await prisma.refreshToken.delete({ where: { token } });

  const tokens = generateTokens(user);

  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
    },
  });

  return tokens;
};

export const logout = async (refreshToken: string) => {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
};
