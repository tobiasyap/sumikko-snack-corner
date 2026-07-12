import { motion, AnimatePresence } from 'framer-motion';
import { Snack, CHARACTER_NAMES } from '../../types';
import { formatExpiryDate, getExpiryStatus, daysUntilExpiry } from '../../utils/dateUtils';
import SnackIcon from './SnackIcon';
import SumikkoCharacter from '../Characters/SumikkoCharacter';

interface EatSnackModalProps {
  snack: Snack | null;
  onEat: (snack: Snack) => void;
  onCancel: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  safe: 'Fresh',
  warning: 'Eat soon!',
  expired: 'Expired',
};

const STATUS_COLORS: Record<string, string> = {
  safe: '#7bc47f',
  warning: '#e8a33e',
  expired: '#e85d75',
};

export default function EatSnackModal({ snack, onEat, onCancel }: EatSnackModalProps) {
  const status = snack ? getExpiryStatus(snack.expiryDate) : 'safe';
  const days = snack ? daysUntilExpiry(snack.expiryDate) : 0;

  return (
    <AnimatePresence>
      {snack && (
        <motion.div
          className="eat-snack-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(93,78,96,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: 16,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onCancel();
          }}
        >
          <motion.div
            className="eat-snack-modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              backgroundColor: '#FFF8F5',
              borderRadius: 22,
              border: '2px solid #F0DCD4',
              padding: '28px 28px 24px',
              width: '100%',
              maxWidth: 360,
              boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                marginBottom: 20,
              }}
            >
              <SnackIcon snack={snack} size={72} />

              <h3
                className="eat-snack-name"
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#5D4E60',
                  textAlign: 'center',
                }}
              >
                {snack.name}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SumikkoCharacter type={snack.characterType} size={48} />
                <span style={{ fontSize: 12, color: '#8B7D6B' }}>
                  guarded by {CHARACTER_NAMES[snack.characterType]}
                </span>
              </div>

              <div
                className="eat-snack-expiry-info"
                style={{
                  textAlign: 'center',
                  fontSize: 13,
                  color: '#8B7D6B',
                }}
              >
                <div>{formatExpiryDate(snack.expiryDate, snack.expiryIsApprox)}</div>
                <div
                  style={{
                    fontWeight: 600,
                    color: STATUS_COLORS[status],
                    marginTop: 2,
                  }}
                >
                  {STATUS_LABELS[status]}
                  {status !== 'expired'
                    ? ` - ${days} day${days !== 1 ? 's' : ''} left`
                    : ` - ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`}
                </div>
              </div>
            </div>

            <div
              className="eat-snack-actions"
              style={{ display: 'flex', gap: 10, justifyContent: 'center' }}
            >
              <button
                onClick={onCancel}
                className="eat-snack-cancel-btn"
                style={{
                  padding: '10px 20px',
                  borderRadius: 12,
                  border: '1.5px solid #E0D8D4',
                  backgroundColor: 'transparent',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#8B7D6B',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                Cancel Selection
              </button>

              <button
                onClick={() => onEat(snack)}
                className="eat-snack-eat-btn"
                style={{
                  padding: '10px 24px',
                  borderRadius: 12,
                  border: 'none',
                  backgroundColor: '#FFB7C5',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  boxShadow: '0 2px 8px rgba(255,183,197,0.3)',
                }}
              >
                Eat Now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
