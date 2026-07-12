import cron from 'node-cron';
import prisma from '../lib/prisma.js';
import { decrypt } from '../routes/settings.js';
import { sendExpiryNotification } from './emailService.js';

export function startCronJobs() {
  cron.schedule('0 9 * * *', async () => {
    console.log('[Cron] Checking for expiring snacks...');

    try {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const expiringSnacks = await prisma.snack.findMany({
        where: {
          expiryDate: { lte: thirtyDaysFromNow },
          notifiedAt: null,
        },
        include: { user: true },
      });

      console.log(`[Cron] Found ${expiringSnacks.length} snacks expiring within 30 days`);

      for (const snack of expiringSnacks) {
        if (!snack.user.gmailAppPass) continue;

        try {
          const appPass = decrypt(snack.user.gmailAppPass);
          await sendExpiryNotification(
            snack.user.email,
            appPass,
            snack.name,
            snack.expiryDate
          );

          await prisma.snack.update({
            where: { id: snack.id },
            data: { notifiedAt: new Date() },
          });

          console.log(`[Cron] Sent notification for "${snack.name}" to ${snack.user.email}`);
        } catch (error) {
          console.error(`[Cron] Failed to notify for snack ${snack.id}:`, error);
        }
      }
    } catch (error) {
      console.error('[Cron] Error checking expiring snacks:', error);
    }
  });

  console.log('[Cron] Daily expiry check scheduled for 9:00 AM');
}
