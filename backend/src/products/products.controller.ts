import { Request, Response, NextFunction } from 'express';
import { prisma } from '../common/prisma';
import { AuthRequest } from '../common/middleware/auth.middleware';
import { AppError } from '../common/middleware/error.middleware';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = '1', limit = '12', category, sort = 'createdAt', order = 'desc',
      minPrice, maxPrice, inStock,
    } = req.query as Record<string, string>;

    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = { isActive: true };
    if (category) where.category = category;
    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      };
    }
    if (inStock === 'true') where.stock = { gt: 0 };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sort]: order },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) throw new AppError('Product not found', 404);

    // Get similar products
    const similar = await prisma.product.findMany({
      where: {
        category: product.category,
        id: { not: product.id },
        isActive: true,
      },
      take: 4,
    });

    res.json({ success: true, data: { ...product, similar } });
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.product.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: { category: true },
    });

    res.json({
      success: true,
      data: categories.map((c) => ({ name: c.category, count: c._count.category })),
    });
  } catch (err) {
    next(err);
  }
};

export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, page = '1', limit = '12' } = req.query as Record<string, string>;
    if (!q) return res.json({ success: true, data: [], pagination: { total: 0 } });

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { category: { contains: q, mode: 'insensitive' } },
            { tags: { has: q.toLowerCase() } },
          ],
        },
        skip,
        take: Number(limit),
      }),
      prisma.product.count({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    next(err);
  }
};

export const addReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { rating, comment } = req.body;
    const { id: productId } = req.params;

    const review = await prisma.review.upsert({
      where: { userId_productId: { userId: req.user!.id, productId } },
      update: { rating: Number(rating), comment },
      create: { userId: req.user!.id, productId, rating: Number(rating), comment },
    });

    // Update product average rating
    const ratings = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: { rating: ratings._avg.rating || 0 },
    });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.id },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
};
