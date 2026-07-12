import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UndoToastProps {
  visible: boolean;
  snackName: string;
  onUndo: () => void;
  onConfirm: () => void;
  autoConfirmMs?: number;
}

export default function UndoToast({
  visible,
  snackName,
  onUndo,
  onConfirm,
  autoConfirmMs = 10000,
}: UndoToastProps) {
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!visible) {
      setProgress(100);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    startRef.current = Date.now();
    setProgress(100);

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const remaining = Math.max(0, 100 - (elapsed / autoConfirmMs) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        onConfirm();
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [visible, autoConfirmMs, onConfirm]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="undo-toast-wrapper"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          style={{
            position: 'fixed',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
          }}
        >
          <div
            className="undo-toast"
            style={{
              backgroundColor: '#FFF5F0',
              border: '2px solid #F0DCD4',
              borderRadius: 16,
              padding: '14px 20px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              minWidth: 280,
            }}
          >
            <span
              className="undo-toast-message"
              style={{ fontSize: 14, fontWeight: 600, color: '#5D4E60' }}
            >
              Ate {snackName}!
            </span>

            <button
              className="undo-toast-undo-btn"
              onClick={onUndo}
              style={{
                background: 'none',
                border: '1.5px solid #D4C8E8',
                borderRadius: 10,
                padding: '6px 14px',
                fontSize: 13,
                fontWeight: 600,
                color: '#7B6B8D',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.background = '#EDE6F5')
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.background = 'none')
              }
            >
              Undo
            </button>

            <button
              className="undo-toast-rate-btn"
              onClick={onConfirm}
              style={{
                background: '#FFB7C5',
                border: 'none',
                borderRadius: 10,
                padding: '6px 14px',
                fontSize: 13,
                fontWeight: 600,
                color: '#fff',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.background = '#FF9AB0')
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.background = '#FFB7C5')
              }
            >
              Rate
            </button>
          </div>

          {/* Progress bar */}
          <div
            className="undo-toast-progress-track"
            style={{
              width: '100%',
              height: 4,
              backgroundColor: '#F0DCD4',
              borderRadius: '0 0 8px 8px',
              overflow: 'hidden',
              marginTop: -2,
            }}
          >
            <div
              className="undo-toast-progress-bar"
              style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: '#FFB7C5',
                borderRadius: '0 0 8px 8px',
                transition: 'width 0.05s linear',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
