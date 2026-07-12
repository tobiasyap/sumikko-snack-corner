import { Router, Response } from 'express';
import prisma from '../lib/prisma.js';
import { AuthRequest, authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const archived = await prisma.archivedSnack.findMany({
      where: { userId: req.userId },
      orderBy: { eatenAt: 'desc' },
    });
    res.json(archived);
  } catch (error) {
    console.error('Get archive error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const item = await prisma.archivedSnack.findFirst({
      where: { id, userId: req.userId },
    });

    if (!item) {
      res.status(404).json({ error: 'Archived snack not found' });
      return;
    }

    await prisma.archivedSnack.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete archive error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
