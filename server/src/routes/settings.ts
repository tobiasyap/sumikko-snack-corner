import { Router, Response } from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import prisma from '../lib/prisma.js';
import { AuthRequest, authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
router.use(authMiddleware);

function encrypt(text: string): string {
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY!, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY!, 'salt', 32);
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

router.put('/email', async (req: AuthRequest, res: Response) => {
  try {
    const { gmailAppPass } = req.body;

    if (!gmailAppPass) {
      res.status(400).json({ error: 'Gmail App Password is required' });
      return;
    }

    const encryptedPass = encrypt(gmailAppPass);

    await prisma.user.update({
      where: { id: req.userId },
      data: { gmailAppPass: encryptedPass },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Update email settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/email/test', async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user || !user.gmailAppPass) {
      res.status(400).json({ error: 'Email not configured. Please set up your Gmail App Password first.' });
      return;
    }

    const appPass = decrypt(user.gmailAppPass);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: user.email, pass: appPass },
    });

    await transporter.sendMail({
      from: `"Sumikko Snack Corner" <${user.email}>`,
      to: user.email,
      subject: 'Test Email from Sumikko Snack Corner',
      html: `
        <div style="font-family: 'Nunito', sans-serif; background: #FFF5F5; padding: 32px; border-radius: 16px; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #5D4E60; text-align: center;">Your email is set up!</h2>
          <p style="color: #8B7B8E; text-align: center;">
            Sumikko Snack Corner will notify you when your snacks are about to expire.
          </p>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Test email error:', error);
    res.status(500).json({ error: `Failed to send test email: ${error.message}` });
  }
});

export default router;
