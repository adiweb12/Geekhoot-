import { Router } from 'express';
import { authenticate } from '../common/middleware/auth.middleware';
import { prisma } from '../common/prisma';
import { AuthRequest } from '../common/middleware/auth.middleware';
import { Response, NextFunction } from 'express';
import { AppError } from '../common/middleware/error.middleware';

const router = Router();

router.use(authenticate);

// GET /api/cart
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cartItems = await prisma.cart.findMany({
      where: { userId: req.user!.id },
      include: { product: true },
      orderBy: { id: 'asc' },
    });

    const total = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    res.json({ success: true, data: cartItems, total });
  } catch (err) {
    next(err);
  }
});

// POST /api/cart
router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError('Product not found', 404);
    if (product.stock < quantity) throw new AppError('Insufficient stock', 400);

    const cartItem = await prisma.cart.upsert({
      where: { userId_productId: { userId: req.user!.id, productId } },
      update: { quantity: { increment: quantity } },
      create: { userId: req.user!.id, productId, quantity },
      include: { product: true },
    });

    res.status(201).json({ success: true, data: cartItem });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/cart/:id
router.patch('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { quantity } = req.body;

    if (quantity <= 0) {
      await prisma.cart.delete({ where: { id: req.params.id } });
      return res.json({ success: true, message: 'Item removed from cart' });
    }

    const cartItem = await prisma.cart.update({
      where: { id: req.params.id, userId: req.user!.id },
      data: { quantity },
      include: { product: true },
    });

    res.json({ success: true, data: cartItem });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cart/:id
router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.cart.delete({
      where: { id: req.params.id, userId: req.user!.id },
    });
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cart (clear cart)
router.delete('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.cart.deleteMany({ where: { userId: req.user!.id } });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    next(err);
  }
});

export default router;
