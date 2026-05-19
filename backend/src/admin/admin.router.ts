import { Router, Response, NextFunction } from 'express';
import { authenticate, requireAdmin, AuthRequest } from '../common/middleware/auth.middleware';
import { prisma } from '../common/prisma';
import { AppError } from '../common/middleware/error.middleware';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import slugify from 'slugify';
import { OrderStatus } from '@prisma/client';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();
router.use(authenticate, requireAdmin);

// ─── Analytics ────────────────────────────────────────────────────────────────
router.get('/analytics', async (_req, res: Response, next: NextFunction) => {
  try {
    const [totalUsers, totalProducts, totalOrders, ordersByStatus, recentOrders] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.groupBy({ by: ['status'], _count: { status: true } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          product: { select: { name: true, images: true } },
        },
      }),
    ]);

    const revenue = await prisma.order.aggregate({
      where: { status: { in: ['CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED'] } },
      _sum: { totalPrice: true },
    });

    res.json({
      success: true,
      data: {
        totalUsers, totalProducts, totalOrders,
        revenue: revenue._sum.totalPrice || 0,
        ordersByStatus: Object.fromEntries(ordersByStatus.map((o) => [o.status, o._count.status])),
        recentOrders,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── Products CRUD ────────────────────────────────────────────────────────────
router.get('/products', async (req, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', search } = req.query as Record<string, string>;
    const skip = (Number(page) - 1) * Number(limit);
    const where = search ? { name: { contains: search, mode: 'insensitive' as const } } : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.product.count({ where }),
    ]);
    res.json({ success: true, data: products, pagination: { page: Number(page), total } });
  } catch (err) {
    next(err);
  }
});

router.post('/products', upload.array('images', 5), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, category, stock, tags, features } = req.body;
    const files = req.files as Express.Multer.File[];

    // Upload images to Cloudinary
    const imageUrls: string[] = [];
    for (const file of files || []) {
      const result = await new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'geekhoot/products', quality: 'auto', fetch_format: 'auto' },
          (err, result) => {
            if (err) reject(err);
            else resolve(result!.secure_url);
          }
        ).end(file.buffer);
      });
      imageUrls.push(result);
    }

    const slug = slugify(name, { lower: true, strict: true });
    const product = await prisma.product.create({
      data: {
        name,
        slug: `${slug}-${Date.now()}`,
        description,
        price: Number(price),
        category,
        stock: Number(stock) || 0,
        images: imageUrls,
        tags: tags ? JSON.parse(tags) : [],
        features: features ? JSON.parse(features) : [],
      },
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
});

router.put('/products/:id', upload.array('images', 5), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, category, stock, tags, features, isActive, existingImages } = req.body;
    const files = req.files as Express.Multer.File[];

    const imageUrls: string[] = existingImages ? JSON.parse(existingImages) : [];
    for (const file of files || []) {
      const result = await new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'geekhoot/products', quality: 'auto' },
          (err, result) => { if (err) reject(err); else resolve(result!.secure_url); }
        ).end(file.buffer);
      });
      imageUrls.push(result);
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name, description, category,
        price: price ? Number(price) : undefined,
        stock: stock !== undefined ? Number(stock) : undefined,
        images: imageUrls,
        tags: tags ? JSON.parse(tags) : undefined,
        features: features ? JSON.parse(features) : undefined,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
      },
    });

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
});

router.delete('/products/:id', async (req, res: Response, next: NextFunction) => {
  try {
    await prisma.product.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ success: true, message: 'Product deactivated' });
  } catch (err) {
    next(err);
  }
});

// ─── Orders Management ────────────────────────────────────────────────────────
router.get('/orders', async (req, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', status, search } = req.query as Record<string, string>;
    const skip = (Number(page) - 1) * Number(limit);
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { id: { contains: search } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true, district: true, state: true } },
          product: { select: { id: true, name: true, images: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.order.count({ where }),
    ]);

    res.json({ success: true, data: orders, pagination: { page: Number(page), total } });
  } catch (err) {
    next(err);
  }
});

router.post('/orders', async (req, res: Response, next: NextFunction) => {
  try {
    const { userId, productId, quantity, totalPrice } = req.body;
    const order = await prisma.order.create({
      data: { userId, productId, quantity: Number(quantity), totalPrice: Number(totalPrice) },
      include: { user: { select: { name: true, email: true } }, product: true },
    });
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
});

router.patch('/orders/:id/status', async (req, res: Response, next: NextFunction) => {
  try {
    const { status, trackingId, courier, notes } = req.body;

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status: status as OrderStatus,
        ...(trackingId && { trackingId }),
        ...(courier && { courier }),
        ...(notes && { notes }),
      },
    });

    // Add tracking update
    await prisma.trackingUpdate.create({
      data: {
        orderId: order.id,
        status,
        description: notes || `Order status updated to ${status}`,
      },
    });

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
});

// ─── Users Management ─────────────────────────────────────────────────────────
router.get('/users', async (req, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', search } = req.query as Record<string, string>;
    const skip = (Number(page) - 1) * Number(limit);
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { phone: { contains: search } },
      ],
    } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, name: true, email: true, phone: true, role: true, district: true, state: true, createdAt: true },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ success: true, data: users, pagination: { page: Number(page), total } });
  } catch (err) {
    next(err);
  }
});

export default router;
