import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { createPost, getFeed } from '../controllers/postController';

const router = Router();

router.post('/posts', authenticateToken, createPost);
router.get('/feed', authenticateToken, getFeed);

export default router;