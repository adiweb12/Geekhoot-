import { Router } from 'express';
import * as productsController from './products.controller';
import { authenticate } from '../common/middleware/auth.middleware';

const router = Router();

router.get('/', productsController.getProducts);
router.get('/categories', productsController.getCategories);
router.get('/search', productsController.searchProducts);
router.get('/:slug', productsController.getProduct);
router.post('/:id/reviews', authenticate, productsController.addReview);
router.get('/:id/reviews', productsController.getReviews);

export default router;
