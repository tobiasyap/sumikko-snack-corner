import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Snack } from '../../types';
import SumikkoCharacter from '../Characters/SumikkoCharacter';
import SnackIcon from '../Snacks/SnackIcon';

interface EatSnackAnimationProps {
  snack: Snack | null;
  sourcePosition: { x: number; y: number } | null;
  onComplete: () => void;
}

type Phase = 'enter' | 'reach' | 'drop' | 'pickup' | 'exit';

export default function EatSnackAnimation({ snack, sourcePosition, onComplete }: EatSnackAnimationProps) {
  const [phase, setPhase] = useState<Phase | null>(null);

  useEffect(() => {
    if (!snack || !sourcePosition) {
      setPhase(null);
      return;
    }

    setPhase('enter');

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase('reach'), 600));
    timers.push(setTimeout(() => setPhase('drop'), 1200));
    timers.push(setTimeout(() => setPhase('pickup'), 2200));
    timers.push(setTimeout(() => setPhase('exit'), 2800));
    timers.push(setTimeout(() => {
      setPhase(null);
      onComplete();
    }, 3500));

    return () => { timers.forEach(clearTimeout); };
  }, [snack, sourcePosition, onComplete]);

  if (!phase || !snack || !sourcePosition) return null;

  const windowW = typeof window !== 'undefined' ? window.innerWidth : 1000;
  const windowH = typeof window !== 'undefined' ? window.innerHeight : 800;
  const floorY = windowH - 120;
  const charTargetX = sourcePosition.x + 30;

  const charScaleY = phase === 'reach' ? 1.12 : 1;
  const charScaleX = phase === 'reach' ? 0.92 : 1;

  const snackStartY = sourcePosition.y;
  const snackFloorY = floorY - 10;

  return (
    <div className="animation-overlay" style={{ position: 'fixed', inset: 0, zIndex: 55, pointerEvents: 'none', overflow: 'hidden' }}>
      <AnimatePresence>
        <motion.div
          key="character"
          initial={{ x: windowW + 80, y: floorY }}
          animate={{
            x: phase === 'exit' ? windowW + 100 : charTargetX,
            y: floorY,
            scaleX: charScaleX,
            scaleY: charScaleY,
            opacity: phase === 'exit' ? 0 : 1,
          }}
          transition={{
            x: { duration: 0.6, ease: 'easeInOut' },
            scaleX: { duration: 0.3 },
            scaleY: { duration: 0.3 },
            opacity: { duration: 0.4 },
          }}
          style={{ position: 'absolute', zIndex: 2, transformOrigin: 'bottom center' }}
        >
          <SumikkoCharacter type={snack.characterType} size={100} flipped />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {phase !== 'exit' && (
          <motion.div
            key="snack-icon"
            initial={{ x: sourcePosition.x, y: snackStartY, opacity: 1 }}
            animate={{
              x: phase === 'pickup' ? charTargetX + 10 : sourcePosition.x,
              y: phase === 'drop' || phase === 'pickup' ? snackFloorY : snackStartY,
              opacity: phase === 'pickup' ? 0.5 : 1,
              scale: phase === 'pickup' ? 0.6 : 1,
            }}
            exit={{ opacity: 0 }}
            transition={
              phase === 'drop'
                ? { y: { type: 'spring', stiffness: 200, damping: 12, mass: 0.8 } }
                : { duration: 0.4, ease: 'easeInOut' }
            }
            style={{ position: 'absolute', zIndex: 3 }}
          >
            <SnackIcon snack={snack} size={44} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
