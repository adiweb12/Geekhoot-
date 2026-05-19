import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../common/middleware/auth.middleware';
import { prisma } from '../common/prisma';
import { AppError } from '../common/middleware/error.middleware';
import bcrypt from 'bcrypt';

const router = Router();
router.use(authenticate);

// GET /api/users/profile
router.get('/profile', async (req: AuthRequest, res: Response, next: NextFunction) => {
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
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/users/profile
router.patch('/profile', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, phone, houseName, street, landmark, district, state, pincode, latitude, longitude } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { name, phone, houseName, street, landmark, district, state, pincode, latitude, longitude },
      select: {
        id: true, name: true, email: true, phone: true,
        houseName: true, street: true, landmark: true,
        district: true, state: true, pincode: true,
      },
    });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// POST /api/users/change-password
router.post('/change-password', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) throw new AppError('Both passwords required', 400);
    if (newPassword.length < 8) throw new AppError('New password must be at least 8 characters', 400);

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) throw new AppError('User not found', 404);

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) throw new AppError('Current password is incorrect', 400);

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.user!.id }, data: { password: hashedPassword } });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
});

// Wishlist
router.get('/wishlist', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user!.id },
      include: { product: true },
    });
    res.json({ success: true, data: wishlist });
  } catch (err) {
    next(err);
  }
});

router.post('/wishlist/:productId', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const item = await prisma.wishlist.upsert({
      where: { userId_productId: { userId: req.user!.id, productId: req.params.productId } },
      update: {},
      create: { userId: req.user!.id, productId: req.params.productId },
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

router.delete('/wishlist/:productId', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.wishlist.deleteMany({
      where: { userId: req.user!.id, productId: req.params.productId },
    });
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (err) {
    next(err);
  }
});

export default router;
