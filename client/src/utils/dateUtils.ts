export function formatExpiryDate(dateStr: string, isApprox: boolean): string {
  const date = new Date(dateStr);
  if (isApprox) {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  }
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function getExpiryStatus(dateStr: string): 'safe' | 'warning' | 'expired' {
  const now = new Date();
  const expiry = new Date(dateStr);
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return 'expired';
  if (diffDays <= 30) return 'warning';
  return 'safe';
}

export function daysUntilExpiry(dateStr: string): number {
  const now = new Date();
  const expiry = new Date(dateStr);
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
