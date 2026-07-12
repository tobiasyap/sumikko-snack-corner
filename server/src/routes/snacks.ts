import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../lib/prisma.js';
import { AuthRequest, authMiddleware } from '../middleware/authMiddleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHARACTERS = ['shirokuma', 'penguin', 'tonkatsu', 'neko', 'tokage', 'yamapenguin'] as const;

let characterBag: string[] = [];
function nextCharacter(): string {
  if (characterBag.length === 0) {
    characterBag = [...CHARACTERS].sort(() => Math.random() - 0.5);
  }
  return characterBag.pop()!;
}

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const snacks = await prisma.snack.findMany({
      where: { userId: req.userId },
      orderBy: { slotPosition: 'asc' },
    });
    res.json(snacks);
  } catch (error) {
    console.error('Get snacks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, expiryDate, expiryIsApprox } = req.body;

    if (!name || !expiryDate) {
      res.status(400).json({ error: 'Name and expiry date are required' });
      return;
    }

    const existingSnacks = await prisma.snack.findMany({
      where: { userId: req.userId },
      select: { slotPosition: true },
      orderBy: { slotPosition: 'asc' },
    });

    const usedPositions = new Set(existingSnacks.map(s => s.slotPosition));
    let nextSlot = 0;
    while (usedPositions.has(nextSlot)) nextSlot++;

    const characterType = nextCharacter();

    const snack = await prisma.snack.create({
      data: {
        name,
        expiryDate: new Date(expiryDate),
        expiryIsApprox: expiryIsApprox === 'true',
        imagePath: req.file ? req.file.filename : null,
        characterType,
        slotPosition: nextSlot,
        userId: req.userId!,
      },
    });

    res.status(201).json(snack);
  } catch (error) {
    console.error('Create snack error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const snack = await prisma.snack.findFirst({
      where: { id, userId: req.userId },
    });

    if (!snack) {
      res.status(404).json({ error: 'Snack not found' });
      return;
    }

    await prisma.snack.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete snack error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/eat', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { rating } = req.body;

    if (rating !== undefined && rating !== null && (rating < 1 || rating > 10)) {
      res.status(400).json({ error: 'Rating must be between 1 and 10' });
      return;
    }

    const snack = await prisma.snack.findFirst({
      where: { id, userId: req.userId },
    });

    if (!snack) {
      res.status(404).json({ error: 'Snack not found' });
      return;
    }

    const [archivedSnack] = await prisma.$transaction([
      prisma.archivedSnack.create({
        data: {
          name: snack.name,
          imagePath: snack.imagePath,
          rating: rating ? parseInt(rating) : null,
          originalExpiry: snack.expiryDate,
          expiryIsApprox: snack.expiryIsApprox,
          characterType: snack.characterType,
          slotPosition: snack.slotPosition,
          userId: req.userId!,
        },
      }),
      prisma.snack.delete({ where: { id } }),
    ]);

    res.json(archivedSnack);
  } catch (error) {
    console.error('Eat snack error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
