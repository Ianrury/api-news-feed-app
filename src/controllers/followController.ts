import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

export const followUser = async (req: AuthRequest, res: Response) => {
  try {
    const followerId = req.userId!;
    const followeeId = parseInt(req.params.userid);

    if (isNaN(followeeId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (followerId === followeeId) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    const followee = await prisma.user.findUnique({
      where: { id: followeeId }
    });

    if (!followee) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followeeId: {
          followerId,
          followeeId
        }
      }
    });

    if (existingFollow) {
      return res.status(400).json({ error: 'You are already following this user' });
    }

    await prisma.follow.create({
      data: {
        followerId,
        followeeId
      }
    });

    res.status(200).json({
      message: `You are now following user ${followeeId}`
    });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const unfollowUser = async (req: AuthRequest, res: Response) => {
  try {
    const followerId = req.userId!;
    const followeeId = parseInt(req.params.userid);

    if (isNaN(followeeId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followeeId: {
          followerId,
          followeeId
        }
      }
    });

    if (!existingFollow) {
      return res.status(404).json({ error: 'You are not following this user' });
    }

    await prisma.follow.delete({
      where: {
        followerId_followeeId: {
          followerId,
          followeeId
        }
      }
    });

    res.status(200).json({
      message: `You unfollowed user ${followeeId}`
    });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = req.userId!;

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: currentUserId
        }
      },
      select: {
        id: true,
        username: true,
        _count: {
          select: {
            followers: true,
            posts: true
          }
        }
      }
    });

    const following = await prisma.follow.findMany({
      where: { followerId: currentUserId },
      select: { followeeId: true }
    });

    const followingIds = new Set(following.map(f => f.followeeId));

    const usersWithFollowStatus = users.map(user => ({
      id: user.id,
      username: user.username,
      followersCount: user._count.followers,
      postsCount: user._count.posts,
      isFollowing: followingIds.has(user.id)
    }));

    res.status(200).json({ users: usersWithFollowStatus });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};