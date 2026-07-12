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

router.patch('/:id/rating', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 10) {
      res.status(400).json({ error: 'Rating must be between 1 and 10' });
      return;
    }

    const item = await prisma.archivedSnack.findFirst({
      where: { id, userId: req.userId },
    });

    if (!item) {
      res.status(404).json({ error: 'Archived snack not found' });
      return;
    }

    const updated = await prisma.archivedSnack.update({
      where: { id },
      data: { rating: parseInt(rating) },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/undo', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const item = await prisma.archivedSnack.findFirst({
      where: { id, userId: req.userId },
    });

    if (!item) {
      res.status(404).json({ error: 'Archived snack not found' });
      return;
    }

    const existingSnacks = await prisma.snack.findMany({
      where: { userId: req.userId },
      select: { slotPosition: true },
    });
    const usedPositions = new Set(existingSnacks.map(s => s.slotPosition));

    let slotPosition = item.slotPosition ?? 0;
    if (usedPositions.has(slotPosition)) {
      slotPosition = 0;
      while (usedPositions.has(slotPosition)) slotPosition++;
    }

    const [restoredSnack] = await prisma.$transaction([
      prisma.snack.create({
        data: {
          name: item.name,
          imagePath: item.imagePath,
          expiryDate: item.originalExpiry,
          expiryIsApprox: item.expiryIsApprox ?? false,
          characterType: item.characterType ?? 'shirokuma',
          slotPosition,
          userId: req.userId!,
        },
      }),
      prisma.archivedSnack.delete({ where: { id } }),
    ]);

    res.json(restoredSnack);
  } catch (error) {
    console.error('Undo eat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
