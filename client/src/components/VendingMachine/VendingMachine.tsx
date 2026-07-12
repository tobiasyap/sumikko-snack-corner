import { Snack } from '../../types';
import SumikkoCharacter from '../Characters/SumikkoCharacter';
import VendingSlot from './VendingSlot';

interface VendingMachineProps {
  snacks: Snack[];
  onSnackClick: (snack: Snack) => void;
  onAddClick: () => void;
  registerSlotRef?: (slotPos: number, el: HTMLDivElement | null) => void;
}

const TOTAL_SLOTS = 12;
const COLUMNS = 4;

export default function VendingMachine({ snacks, onSnackClick, onAddClick, registerSlotRef }: VendingMachineProps) {
  // Build a slot map: position -> snack
  const slotMap = new Map<number, Snack>();
  snacks.forEach((s) => slotMap.set(s.slotPosition, s));

  const slots = Array.from({ length: TOTAL_SLOTS }, (_, i) => i);
  const rows: number[][] = [];
  for (let i = 0; i < slots.length; i += COLUMNS) {
    rows.push(slots.slice(i, i + COLUMNS));
  }

  return (
    <div
      className="vending-machine"
      style={{
        maxWidth: 560,
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* Machine frame */}
      <div
        className="vending-machine-frame"
        style={{
          background: 'linear-gradient(180deg, #F8E8F0 0%, #EDD8E8 40%, #E8D0E4 100%)',
          borderRadius: 28,
          border: '3px solid #D4B8CC',
          boxShadow: '0 8px 32px rgba(140,100,130,0.15), inset 0 1px 0 rgba(255,255,255,0.5)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          className="vending-machine-header"
          style={{
            padding: '16px 20px 12px',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div
            className="vending-machine-header-characters"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              gap: 8,
              marginBottom: 4,
            }}
          >
            <SumikkoCharacter type="shirokuma" size={48} />
            <SumikkoCharacter type="penguin" size={48} />
            <SumikkoCharacter type="tonkatsu" size={48} />
          </div>

          <h2
            className="vending-machine-title"
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: '#7B5B6D',
              letterSpacing: 0.5,
            }}
          >
            Sumikko Snack Corner
          </h2>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              gap: 8,
              marginTop: 4,
            }}
          >
            <SumikkoCharacter type="neko" size={48} />
            <SumikkoCharacter type="tokage" size={48} />
            <SumikkoCharacter type="yamapenguin" size={48} />
          </div>
        </div>

        {/* Glass panel */}
        <div
          className="vending-machine-glass"
          style={{
            margin: '0 14px',
            padding: 14,
            background: 'linear-gradient(180deg, rgba(200,220,240,0.25) 0%, rgba(200,210,230,0.15) 100%)',
            borderRadius: 18,
            border: '2px solid rgba(180,160,200,0.3)',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {rows.map((row, rowIdx) => (
            <div key={rowIdx}>
              {/* Slot row */}
              <div
                className="vending-machine-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${COLUMNS}, 1fr)`,
                  gap: 8,
                }}
              >
                {row.map((slotIdx) => {
                  const snack = slotMap.get(slotIdx);
                  return (
                    <div key={slotIdx} ref={(el) => registerSlotRef?.(slotIdx, el)}>
                      <VendingSlot
                        snack={snack}
                        isEmpty={!snack}
                        onClick={() => (snack ? onSnackClick(snack) : onAddClick())}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Shelf divider (between rows, not after the last) */}
              {rowIdx < rows.length - 1 && (
                <div
                  className="vending-machine-shelf"
                  style={{
                    height: 3,
                    margin: '6px 0',
                    background: 'linear-gradient(90deg, transparent 0%, #C0B0BC 20%, #A898A8 50%, #C0B0BC 80%, transparent 100%)',
                    borderRadius: 2,
                    opacity: 0.5,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Bottom panel */}
        <div
          className="vending-machine-bottom"
          style={{
            padding: '16px 14px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {/* Dispense opening */}
          <div
            className="vending-machine-dispenser"
            style={{
              width: '70%',
              height: 36,
              backgroundColor: '#3D2E38',
              borderRadius: '0 0 14px 14px',
              border: '2px solid #5D4E56',
              borderTop: 'none',
              boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.4)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Flap highlight */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '10%',
                right: '10%',
                height: 2,
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: 1,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
