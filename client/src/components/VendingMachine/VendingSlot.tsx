import { useState, useRef } from 'react';
import { Snack } from '../../types';
import { getExpiryStatus } from '../../utils/dateUtils';
import SnackIcon from '../Snacks/SnackIcon';
import SnackBubble from './SnackBubble';

interface VendingSlotProps {
  snack?: Snack;
  onClick: () => void;
  isEmpty?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  safe: '#7bc47f',
  warning: '#e8a33e',
  expired: '#e85d75',
};

function CoilSVG() {
  return (
    <svg
      className="vending-slot-coil"
      viewBox="0 0 60 24"
      style={{
        position: 'absolute',
        bottom: 4,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        opacity: 0.18,
        pointerEvents: 'none',
      }}
    >
      <path
        d="M4 20 Q10 4, 16 20 Q22 4, 28 20 Q34 4, 40 20 Q46 4, 52 20 Q58 4, 58 12"
        fill="none"
        stroke="#8B7D6B"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function VendingSlot({ snack, onClick, isEmpty }: VendingSlotProps) {
  const [hovered, setHovered] = useState(false);
  const slotRef = useRef<HTMLDivElement>(null);

  if (isEmpty || !snack) {
    return (
      <button
        className="vending-slot vending-slot-empty"
        onClick={onClick}
        style={{
          width: '100%',
          aspectRatio: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed #D4C8E8',
          borderRadius: 14,
          backgroundColor: 'rgba(255,255,255,0.3)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = '#FFB7C5';
          (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,183,197,0.08)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = '#D4C8E8';
          (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.3)';
        }}
      >
        <span
          style={{
            fontSize: 28,
            color: '#D4C8E8',
            fontWeight: 300,
            lineHeight: 1,
          }}
        >
          +
        </span>
      </button>
    );
  }

  const status = getExpiryStatus(snack.expiryDate);

  return (
    <div
      ref={slotRef}
      className="vending-slot vending-slot-occupied"
      style={{
        width: '100%',
        aspectRatio: '1',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        backgroundColor: hovered ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.35)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: '2px solid transparent',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CoilSVG />

      <div
        className="vending-slot-icon-wrapper"
        style={{
          position: 'relative',
          zIndex: 2,
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.2s ease',
        }}
      >
        <SnackIcon snack={snack} size={52} />
      </div>

      {/* Expiry status indicator */}
      <div
        className="vending-slot-status"
        style={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: STATUS_COLORS[status],
          border: '2px solid rgba(255,255,255,0.8)',
          zIndex: 3,
        }}
      />

      {/* Hover tooltip */}
      <SnackBubble snack={snack} visible={hovered} anchorEl={slotRef.current} />
    </div>
  );
}
