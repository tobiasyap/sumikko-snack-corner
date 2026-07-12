import { useState, useCallback, useRef } from 'react';
import { useSnacks, useEatSnack, useRefreshSnacks } from '../hooks/useSnacks';
import { Snack } from '../types';
import VendingMachine from '../components/VendingMachine/VendingMachine';
import AddSnackForm from '../components/Snacks/AddSnackForm';
import EatSnackModal from '../components/Snacks/EatSnackModal';
import AddSnackAnimation from '../components/Animations/AddSnackAnimation';
import EatSnackAnimation from '../components/Animations/EatSnackAnimation';
import UndoToast from '../components/Animations/UndoToast';
import SumikkoCharacter from '../components/Characters/SumikkoCharacter';

export default function HomePage() {
  const { data: snacks, isLoading } = useSnacks();
  const eatSnack = useEatSnack();
  const refreshSnacks = useRefreshSnacks();

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSnack, setSelectedSnack] = useState<Snack | null>(null);

  // Animation states
  const [addingSnack, setAddingSnack] = useState<Snack | null>(null);
  const [addTargetPos, setAddTargetPos] = useState<{ x: number; y: number } | null>(null);
  const [eatingSnack, setEatingSnack] = useState<Snack | null>(null);
  const [eatSourcePos, setEatSourcePos] = useState<{ x: number; y: number } | null>(null);

  // Undo state
  const [undoSnack, setUndoSnack] = useState<Snack | null>(null);
  const [showRating, setShowRating] = useState(false);

  const slotRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const registerSlotRef = useCallback((slotPos: number, el: HTMLDivElement | null) => {
    if (el) {
      slotRefs.current.set(slotPos, el);
    } else {
      slotRefs.current.delete(slotPos);
    }
  }, []);

  function getSlotPosition(slotPos: number): { x: number; y: number } | null {
    const el = slotRefs.current.get(slotPos);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  function handleSnackAdded(snack: Snack) {
    setShowAddForm(false);
    setTimeout(() => {
      const pos = getSlotPosition(snack.slotPosition);
      setAddTargetPos(pos);
      setAddingSnack(snack);
    }, 100);
  }

  function handleSnackClick(snack: Snack) {
    setSelectedSnack(snack);
  }

  function handleEat(snack: Snack) {
    setSelectedSnack(null);
    const pos = getSlotPosition(snack.slotPosition);
    setEatSourcePos(pos);
    setEatingSnack(snack);
  }

  function handleEatAnimationComplete() {
    setEatingSnack(null);
    setEatSourcePos(null);
    if (eatingSnack) {
      setUndoSnack(eatingSnack);
    }
  }

  function handleUndo() {
    setUndoSnack(null);
    setShowRating(false);
  }

  function handleConfirmEat() {
    setShowRating(true);
  }

  function handleRate(snack: Snack, rating: number) {
    eatSnack.mutate({ id: snack.id, rating });
    setUndoSnack(null);
    setShowRating(false);
  }

  if (isLoading) {
    return (
      <div className="home-loading">
        <SumikkoCharacter type="shirokuma" size={120} />
        <p>Loading your snacks...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <VendingMachine
        snacks={snacks || []}
        onSnackClick={handleSnackClick}
        onAddClick={() => setShowAddForm(true)}
        registerSlotRef={registerSlotRef}
      />

      <AddSnackForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAdded={handleSnackAdded}
      />

      <EatSnackModal
        snack={selectedSnack}
        onEat={handleEat}
        onCancel={() => setSelectedSnack(null)}
      />

      <AddSnackAnimation
        snack={addingSnack}
        targetPosition={addTargetPos}
        onComplete={() => {
          setAddingSnack(null);
          setAddTargetPos(null);
          refreshSnacks();
        }}
      />

      <EatSnackAnimation
        snack={eatingSnack}
        sourcePosition={eatSourcePos}
        onComplete={handleEatAnimationComplete}
      />

      {undoSnack && !showRating && (
        <UndoToast
          visible={true}
          snackName={undoSnack.name}
          onUndo={handleUndo}
          onConfirm={handleConfirmEat}
        />
      )}

      {undoSnack && showRating && (
        <EatSnackModal
          snack={undoSnack}
          onEat={(snack: Snack, rating: number) => handleRate(snack, rating)}
          onCancel={handleUndo}
          startAtRating
        />
      )}
    </div>
  );
}
