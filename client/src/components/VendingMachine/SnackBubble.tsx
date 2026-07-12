import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Snack } from '../../types';
import { formatExpiryDate, daysUntilExpiry, getExpiryStatus } from '../../utils/dateUtils';

interface SnackBubbleProps {
  snack: Snack;
  visible: boolean;
  anchorEl: HTMLElement | null;
}

export default function SnackBubble({ snack, visible, anchorEl }: SnackBubbleProps) {
  const days = daysUntilExpiry(snack.expiryDate);
  const status = getExpiryStatus(snack.expiryDate);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number; tailOffset: number } | null>(null);

  const statusLabel =
    status === 'expired'
      ? `Expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`
      : `${days} day${days !== 1 ? 's' : ''} left`;

  const statusColor =
    status === 'expired' ? '#e85d75' : status === 'warning' ? '#e8a33e' : '#7bc47f';

  useLayoutEffect(() => {
    if (!visible) {
      setPos(null);
      return;
    }
    if (!anchorEl || !bubbleRef.current) return;

    const anchorRect = anchorEl.getBoundingClientRect();
    const bubbleW = bubbleRef.current.offsetWidth;
    const bubbleH = bubbleRef.current.offsetHeight;
    const MARGIN = 8;
    const GAP = 10;

    const anchorCenterX = anchorRect.left + anchorRect.width / 2;
    let left = anchorCenterX - bubbleW / 2;

    if (left < MARGIN) left = MARGIN;
    if (left + bubbleW > window.innerWidth - MARGIN) {
      left = window.innerWidth - MARGIN - bubbleW;
    }

    const tailOffset = anchorCenterX - left;
    const top = anchorRect.top - bubbleH - GAP;

    setPos({ left, top, tailOffset });
  }, [visible, anchorEl, snack]);

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={bubbleRef}
          className="snack-bubble"
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.9 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            left: pos?.left ?? -9999,
            top: pos?.top ?? -9999,
            visibility: pos ? 'visible' : 'hidden',
            backgroundColor: '#FFF5F0',
            border: '2px solid #F0DCD4',
            borderRadius: 14,
            padding: '8px 14px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            pointerEvents: 'none',
          }}
        >
          <div
            className="snack-bubble-name"
            style={{ fontWeight: 600, fontSize: 13, color: '#5D4E60', marginBottom: 2 }}
          >
            {snack.name}
          </div>

          <div
            className="snack-bubble-expiry"
            style={{ fontSize: 11, color: '#8B7D6B' }}
          >
            {formatExpiryDate(snack.expiryDate, snack.expiryIsApprox)}
          </div>

          <div
            className="snack-bubble-days"
            style={{ fontSize: 11, fontWeight: 600, color: statusColor, marginTop: 2 }}
          >
            {statusLabel}
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: -7,
              left: pos?.tailOffset ?? 0,
              transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderTop: '7px solid #F0DCD4',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -5,
              left: pos?.tailOffset ?? 0,
              transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #FFF5F0',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
