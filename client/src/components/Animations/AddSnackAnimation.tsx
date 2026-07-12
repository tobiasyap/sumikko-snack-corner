import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Snack } from '../../types';
import SumikkoCharacter from '../Characters/SumikkoCharacter';
import SnackIcon from '../Snacks/SnackIcon';

interface AddSnackAnimationProps {
  snack: Snack | null;
  targetPosition: { x: number; y: number } | null;
  onComplete: () => void;
}

type Phase = 'enter' | 'walk' | 'deliver' | 'wave' | 'exit';

export default function AddSnackAnimation({ snack, targetPosition, onComplete }: AddSnackAnimationProps) {
  const [phase, setPhase] = useState<Phase | null>(null);

  useEffect(() => {
    if (!snack || !targetPosition) {
      setPhase(null);
      return;
    }

    setPhase('enter');

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase('walk'), 400));
    timers.push(setTimeout(() => setPhase('deliver'), 1400));
    timers.push(setTimeout(() => setPhase('wave'), 2200));
    timers.push(setTimeout(() => setPhase('exit'), 2700));
    timers.push(setTimeout(() => {
      setPhase(null);
      onComplete();
    }, 3100));

    return () => { timers.forEach(clearTimeout); };
  }, [snack, targetPosition, onComplete]);

  if (!phase || !snack || !targetPosition) return null;

  const windowW = typeof window !== 'undefined' ? window.innerWidth : 1000;
  const windowH = typeof window !== 'undefined' ? window.innerHeight : 800;

  const charX =
    phase === 'enter' ? 60
    : phase === 'exit' ? windowW + 80
    : windowW / 2 - 30;

  const charY = windowH - 120;
  const bounceY = phase === 'walk' ? -12 : 0;

  return (
    <div className="animation-overlay" style={{ position: 'fixed', inset: 0, zIndex: 55, pointerEvents: 'none', overflow: 'hidden' }}>
      <AnimatePresence>
        <motion.div
          key="character"
          initial={{ x: -80, y: charY, opacity: 0 }}
          animate={{
            x: charX,
            y: charY + bounceY,
            opacity: phase === 'exit' ? 0 : 1,
            scale: phase === 'wave' ? 1.1 : 1,
            rotate: phase === 'wave' ? [0, -8, 8, -5, 0] : 0,
          }}
          transition={{
            x: { duration: 0.8, ease: 'easeInOut' },
            y: { duration: 0.3, ease: 'easeInOut', repeat: phase === 'walk' ? 3 : 0, repeatType: 'reverse' },
            opacity: { duration: 0.3 },
            rotate: { duration: 0.5 },
          }}
          style={{ position: 'absolute', zIndex: 2 }}
        >
          <SumikkoCharacter type={snack.characterType} size={100} />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {(phase === 'deliver' || phase === 'wave') && (
          <motion.div
            key="snack-icon"
            initial={{ x: windowW / 2 - 20, y: charY - 20, opacity: 1, scale: 1 }}
            animate={{ x: targetPosition.x, y: targetPosition.y, opacity: phase === 'wave' ? 0.6 : 1, scale: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ position: 'absolute', zIndex: 3 }}
          >
            <SnackIcon snack={snack} size={44} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
