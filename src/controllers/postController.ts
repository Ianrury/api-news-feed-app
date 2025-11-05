import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    const userId = req.userId!;

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Content is required' });
    }

    if (content.length > 200) {
      return res.status(422).json({ error: 'Content must not exceed 200 characters' });
    }

    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        userId
      },
      include: {
        user: {
          select: {
            username: true
          }
        }
      }
    });

    res.status(201).json({
      id: post.id,
      userid: post.userId,
      username: post.user.username,
      content: post.content,
      createdat: post.createdAt
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFeed = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followeeId: true }
    });

    const followingIds = following.map(f => f.followeeId);

    const posts = await prisma.post.findMany({
      where: {
        userId: {
          in: followingIds
        }
      },
      include: {
        user: {
          select: {
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    res.status(200).json({
      page,
      posts: posts.map(post => ({
        id: post.id,
        userid: post.userId,
        username: post.user.username,
        content: post.content,
        createdat: post.createdAt
      }))
    });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};