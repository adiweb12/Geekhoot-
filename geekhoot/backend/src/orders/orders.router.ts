import { Router, Response, NextFunction } from 'express';
import { authenticate } from '../common/middleware/auth.middleware';
import { AuthRequest } from '../common/middleware/auth.middleware';
import { prisma } from '../common/prisma';
import { AppError } from '../common/middleware/error.middleware';

const router = Router();
router.use(authenticate);

// GET /api/orders — user's own orders only
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '10', status } = req.query as Record<string, string>;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = { userId: req.user!.id };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { product: { select: { id: true, name: true, images: true, price: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.order.count({ where }),
    ]);

    res.json({ success: true, data: orders, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id — user can only view their own order
router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
      include: {
        product: true,
        trackingUpdates: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!order) throw new AppError('Order not found', 404);

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
});

export default router;
