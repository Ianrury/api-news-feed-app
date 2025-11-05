import { Router } from 'express';
import { followUser, unfollowUser, getUsers } from '../controllers/followController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/users', authenticateToken, getUsers);
router.post('/follow/:userid', authenticateToken, followUser);
router.delete('/follow/:userid', authenticateToken, unfollowUser);

export default router;