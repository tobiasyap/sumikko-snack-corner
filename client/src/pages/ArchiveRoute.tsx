import { useState } from 'react';
import { useArchive, useDeleteArchived, useUpdateRating } from '../hooks/useArchive';
import { ArchivedSnack } from '../types';
import SumikkoCharacter from '../components/Characters/SumikkoCharacter';
import SnackIcon from '../components/Snacks/SnackIcon';
import { formatExpiryDate } from '../utils/dateUtils';

function getRatingTier(rating: number | null): { className: string; label: string; character: 'shirokuma' | 'penguin' | 'tonkatsu' | 'neko' | 'tokage' } {
  if (rating === null || rating === undefined) return { className: '', label: 'Unrated', character: 'neko' };
  if (rating >= 9) return { className: 'rating-amazing', label: 'Amazing!', character: 'shirokuma' };
  if (rating >= 7) return { className: 'rating-great', label: 'Great!', character: 'penguin' };
  if (rating >= 5) return { className: 'rating-okay', label: 'Okay', character: 'neko' };
  if (rating >= 3) return { className: 'rating-meh', label: 'Meh...', character: 'tonkatsu' };
  return { className: 'rating-bad', label: 'Not great...', character: 'tokage' };
}

export default function ArchiveRoute() {
  const { data: archived, isLoading } = useArchive();
  const deleteMutation = useDeleteArchived();
  const updateRating = useUpdateRating();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [ratingItemId, setRatingItemId] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  function handleDelete(item: ArchivedSnack) {
    if (confirmDelete === item.id) {
      deleteMutation.mutate(item.id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(item.id);
    }
  }

  function handleStartRating(item: ArchivedSnack) {
    setRatingItemId(item.id);
    setSelectedRating(item.rating);
  }

  function handleConfirmRating() {
    if (ratingItemId !== null && selectedRating !== null) {
      updateRating.mutate({ id: ratingItemId, rating: selectedRating });
      setRatingItemId(null);
      setSelectedRating(null);
    }
  }

  function handleCancelRating() {
    setRatingItemId(null);
    setSelectedRating(null);
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
            const isRating = ratingItemId === item.id;

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

                {isRating ? (
                  <div className="archive-card-rating-edit">
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                        <button
                          key={num}
                          onClick={() => setSelectedRating(num)}
                          className={`archive-rating-circle${selectedRating === num ? ' selected' : ''}`}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            border: selectedRating === num ? '2px solid #FFB7C5' : '2px solid #E8DCD6',
                            backgroundColor: selectedRating === num ? '#FFB7C5' : '#fff',
                            color: selectedRating === num ? '#fff' : '#5D4E60',
                            fontSize: 11,
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
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button
                        className="archive-rating-cancel-btn"
                        onClick={handleCancelRating}
                        style={{
                          background: 'none',
                          border: '1.5px solid #E0D8D4',
                          borderRadius: 8,
                          padding: '4px 12px',
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#8B7D6B',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="archive-rating-confirm-btn"
                        onClick={handleConfirmRating}
                        disabled={selectedRating === null}
                        style={{
                          background: selectedRating !== null ? '#FFB7C5' : '#E0D8D4',
                          border: 'none',
                          borderRadius: 8,
                          padding: '4px 12px',
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#fff',
                          cursor: selectedRating !== null ? 'pointer' : 'not-allowed',
                          transition: 'all 0.15s',
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="archive-card-rating"
                    onClick={() => handleStartRating(item)}
                    style={{ cursor: 'pointer' }}
                    title={item.rating !== null ? 'Click to update rating' : 'Click to rate'}
                  >
                    <span className="archive-rating-number">
                      {item.rating !== null ? item.rating : '?'}
                    </span>
                    <span className="archive-rating-label">{tier.label}</span>
                    <SumikkoCharacter type={tier.character} size={48} />
                  </div>
                )}

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
