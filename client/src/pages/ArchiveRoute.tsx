import { useState } from 'react';
import { useArchive, useDeleteArchived } from '../hooks/useArchive';
import { ArchivedSnack } from '../types';
import SumikkoCharacter from '../components/Characters/SumikkoCharacter';
import SnackIcon from '../components/Snacks/SnackIcon';
import { formatExpiryDate } from '../utils/dateUtils';

function getRatingTier(rating: number): { className: string; label: string; character: 'shirokuma' | 'penguin' | 'tonkatsu' | 'neko' | 'tokage' } {
  if (rating >= 9) return { className: 'rating-amazing', label: 'Amazing!', character: 'shirokuma' };
  if (rating >= 7) return { className: 'rating-great', label: 'Great!', character: 'penguin' };
  if (rating >= 5) return { className: 'rating-okay', label: 'Okay', character: 'neko' };
  if (rating >= 3) return { className: 'rating-meh', label: 'Meh...', character: 'tonkatsu' };
  return { className: 'rating-bad', label: 'Not great...', character: 'tokage' };
}

export default function ArchiveRoute() {
  const { data: archived, isLoading } = useArchive();
  const deleteMutation = useDeleteArchived();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  function handleDelete(item: ArchivedSnack) {
    if (confirmDelete === item.id) {
      deleteMutation.mutate(item.id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(item.id);
    }
  }

  if (isLoading) {
    return (
      <div className="archive-page">
        <div className="archive-loading">
          <SumikkoCharacter type="neko" size={100} />
          <p>Loading memories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="archive-page">
      <div className="archive-header">
        <SumikkoCharacter type="tonkatsu" size={80} />
        <h2>Snack Memories</h2>
        <p>{archived?.length || 0} snacks remembered</p>
      </div>

      {(!archived || archived.length === 0) ? (
        <div className="archive-empty">
          <SumikkoCharacter type="penguin" size={120} />
          <p>No snack memories yet!</p>
          <p className="archive-empty-sub">Eat some snacks from your vending machine to see them here.</p>
        </div>
      ) : (
        <div className="archive-grid">
          {archived.map(item => {
            const tier = getRatingTier(item.rating);
            return (
              <div key={item.id} className={`archive-card ${tier.className}`}>
                <button
                  className="archive-delete-btn"
                  onClick={() => handleDelete(item)}
                  title={confirmDelete === item.id ? 'Click again to confirm' : 'Delete'}
                >
                  {confirmDelete === item.id ? 'Sure?' : '×'}
                </button>

                <div className="archive-card-icon">
                  <SnackIcon snack={item} size={56} />
                </div>

                <h3 className="archive-card-name">{item.name}</h3>

                <div className="archive-card-rating">
                  <span className="archive-rating-number">{item.rating}</span>
                  <span className="archive-rating-label">{tier.label}</span>
                  <SumikkoCharacter type={tier.character} size={48} />
                </div>

                <div className="archive-card-meta">
                  <span>Eaten {new Date(item.eatenAt).toLocaleDateString()}</span>
                  <span>Expired {formatExpiryDate(item.originalExpiry, false)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
