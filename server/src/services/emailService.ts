import nodemailer from 'nodemailer';

export async function sendExpiryNotification(
  gmailAddress: string,
  gmailAppPass: string,
  snackName: string,
  expiryDate: Date
) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailAddress, pass: gmailAppPass },
  });

  const formattedDate = expiryDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  await transporter.sendMail({
    from: `"Sumikko Snack Corner" <${gmailAddress}>`,
    to: gmailAddress,
    subject: `Your snack "${snackName}" is expiring soon!`,
    html: `
      <div style="font-family: 'Nunito', sans-serif; background: #FFF5F5; padding: 32px; border-radius: 16px; max-width: 480px; margin: 0 auto; border: 2px solid #FFE4E8;">
        <h2 style="color: #5D4E60; text-align: center; margin-bottom: 8px;">Snack Alert!</h2>
        <p style="color: #8B7B8E; text-align: center; font-size: 14px; margin-top: 0;">from Sumikko Snack Corner</p>
        <div style="background: white; border-radius: 12px; padding: 24px; margin: 16px 0; border: 1px solid #E8D8E8;">
          <p style="color: #5D4E60; font-size: 18px; text-align: center; margin: 0;">
            <strong>${snackName}</strong>
          </p>
          <p style="color: #E8866A; font-size: 14px; text-align: center; margin: 8px 0 0;">
            expires on <strong>${formattedDate}</strong>
          </p>
        </div>
        <p style="color: #8B7B8E; text-align: center; font-size: 14px;">
          Time to enjoy it before it goes bad!
        </p>
      </div>
    `,
  });
}
