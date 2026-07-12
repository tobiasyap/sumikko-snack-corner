import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UndoToastProps {
  visible: boolean;
  snackName: string;
  onUndo: () => void;
  onRate: (rating: number) => void;
  onDismiss: () => void;
  autoConfirmMs?: number;
}

export default function UndoToast({
  visible,
  snackName,
  onUndo,
  onRate,
  onDismiss,
  autoConfirmMs = 10000,
}: UndoToastProps) {
  const [progress, setProgress] = useState(100);
  const [phase, setPhase] = useState<'actions' | 'rating'>('actions');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!visible) {
      setProgress(100);
      setPhase('actions');
      setSelectedRating(null);
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
        onDismiss();
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [visible, autoConfirmMs, onDismiss]);

  function handleShowRating() {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('rating');
  }

  function handleConfirmRating() {
    if (selectedRating !== null) {
      onRate(selectedRating);
    }
  }

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
              minWidth: 280,
            }}
          >
            <AnimatePresence mode="wait">
              {phase === 'actions' ? (
                <motion.div
                  key="actions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 16 }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#5D4E60' }}>
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
                      transition: 'all 0.15s',
                    }}
                  >
                    Undo
                  </button>

                  <button
                    className="undo-toast-rate-btn"
                    onClick={handleShowRating}
                    style={{
                      background: '#FFB7C5',
                      border: 'none',
                      borderRadius: 10,
                      padding: '6px 14px',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    Rate
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="rating"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#7B5B6D', marginBottom: 10, textAlign: 'center' }}>
                    How was {snackName}?
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginBottom: 12 }}>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        onClick={() => setSelectedRating(num)}
                        className={`undo-toast-rating-circle${selectedRating === num ? ' selected' : ''}`}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          border: selectedRating === num ? '2px solid #FFB7C5' : '2px solid #E8DCD6',
                          backgroundColor: selectedRating === num ? '#FFB7C5' : '#fff',
                          color: selectedRating === num ? '#fff' : '#5D4E60',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                        }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    <button
                      className="undo-toast-back-btn"
                      onClick={() => { setPhase('actions'); onDismiss(); }}
                      style={{
                        background: 'none',
                        border: '1.5px solid #E0D8D4',
                        borderRadius: 10,
                        padding: '6px 14px',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#8B7D6B',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      Skip
                    </button>

                    <button
                      className="undo-toast-confirm-btn"
                      onClick={handleConfirmRating}
                      disabled={selectedRating === null}
                      style={{
                        background: selectedRating !== null ? '#FFB7C5' : '#E0D8D4',
                        border: 'none',
                        borderRadius: 10,
                        padding: '6px 14px',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#fff',
                        cursor: selectedRating !== null ? 'pointer' : 'not-allowed',
                        transition: 'all 0.15s',
                      }}
                    >
                      Confirm
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {phase === 'actions' && (
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
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
