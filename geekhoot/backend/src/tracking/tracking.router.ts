import { Router, Response, NextFunction } from 'express';
import { authenticate } from '../common/middleware/auth.middleware';
import { AuthRequest } from '../common/middleware/auth.middleware';
import { prisma } from '../common/prisma';
import { AppError } from '../common/middleware/error.middleware';

const router = Router();
router.use(authenticate);

// GET /api/tracking/:orderId — users can only track their own orders
router.get('/:orderId', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.orderId,
        userId: req.user!.id, // SECURITY: user can only view own orders
      },
      include: {
        product: { select: { id: true, name: true, images: true } },
        trackingUpdates: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!order) throw new AppError('Order not found', 404);

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
});

export default router;
