import { useState, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Snack } from '../../types';
import { useAddSnack } from '../../hooks/useSnacks';
import SumikkoCharacter from '../Characters/SumikkoCharacter';

interface AddSnackFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: (snack: Snack) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => currentYear + i);

export default function AddSnackForm({ isOpen, onClose, onAdded }: AddSnackFormProps) {
  const [name, setName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [approxMode, setApproxMode] = useState(false);
  const [approxMonth, setApproxMonth] = useState(new Date().getMonth());
  const [approxYear, setApproxYear] = useState(currentYear);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addMutation = useAddSnack();

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function resetForm() {
    setName('');
    setExpiryDate('');
    setApproxMode(false);
    setApproxMonth(new Date().getMonth());
    setApproxYear(currentYear);
    setImageFile(null);
    setImagePreview(null);
    setError('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a snack name.');
      return;
    }

    let finalDate: string;
    if (approxMode) {
      // Use the last day of the selected month
      const lastDay = new Date(approxYear, approxMonth + 1, 0).getDate();
      finalDate = `${approxYear}-${String(approxMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    } else {
      if (!expiryDate) {
        setError('Please enter an expiry date.');
        return;
      }
      finalDate = expiryDate;
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('expiryDate', finalDate);
    formData.append('expiryIsApprox', String(approxMode));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const snack = await addMutation.mutateAsync(formData);
      resetForm();
      onAdded(snack);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add snack.');
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="add-snack-overlay"
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
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="add-snack-modal"
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
              maxWidth: 380,
              boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
              position: 'relative',
            }}
          >
            {/* Corner decoration */}
            <div style={{ position: 'absolute', top: -30, right: 20 }}>
              <SumikkoCharacter type="penguin" size={56} />
            </div>

            <h3
              className="add-snack-title"
              style={{
                margin: '0 0 20px',
                fontSize: 18,
                fontWeight: 700,
                color: '#7B5B6D',
                textAlign: 'center',
              }}
            >
              Add a Snack
            </h3>

            <form onSubmit={handleSubmit} className="add-snack-form">
              {/* Name */}
              <div className="add-snack-field" style={{ marginBottom: 14 }}>
                <label
                  htmlFor="snack-name"
                  style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8B7D6B', marginBottom: 4 }}
                >
                  Snack Name
                </label>
                <input
                  id="snack-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Matcha KitKat"
                  className="add-snack-input"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 12,
                    border: '1.5px solid #E8DCD6',
                    fontSize: 14,
                    color: '#5D4E60',
                    backgroundColor: '#fff',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#D4C8E8')}
                  onBlur={(e) => (e.target.style.borderColor = '#E8DCD6')}
                />
              </div>

              {/* Approx toggle */}
              <div
                className="add-snack-toggle-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <button
                  type="button"
                  className="add-snack-toggle"
                  onClick={() => setApproxMode(!approxMode)}
                  style={{
                    width: 38,
                    height: 20,
                    borderRadius: 10,
                    border: 'none',
                    backgroundColor: approxMode ? '#D4C8E8' : '#E0D8D4',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    padding: 0,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: '#fff',
                      position: 'absolute',
                      top: 2,
                      left: approxMode ? 20 : 2,
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                    }}
                  />
                </button>
                <span style={{ fontSize: 12, color: '#8B7D6B' }}>
                  I only know month/year
                </span>
              </div>

              {/* Date input */}
              <div className="add-snack-field" style={{ marginBottom: 14 }}>
                <label
                  style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8B7D6B', marginBottom: 4 }}
                >
                  Expiry Date
                </label>

                {approxMode ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select
                      value={approxMonth}
                      onChange={(e) => setApproxMonth(Number(e.target.value))}
                      className="add-snack-select"
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: 12,
                        border: '1.5px solid #E8DCD6',
                        fontSize: 14,
                        color: '#5D4E60',
                        backgroundColor: '#fff',
                        outline: 'none',
                      }}
                    >
                      {MONTHS.map((m, i) => (
                        <option key={m} value={i}>{m}</option>
                      ))}
                    </select>

                    <select
                      value={approxYear}
                      onChange={(e) => setApproxYear(Number(e.target.value))}
                      className="add-snack-select"
                      style={{
                        width: 100,
                        padding: '10px 12px',
                        borderRadius: 12,
                        border: '1.5px solid #E8DCD6',
                        fontSize: 14,
                        color: '#5D4E60',
                        backgroundColor: '#fff',
                        outline: 'none',
                      }}
                    >
                      {YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="add-snack-input"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 12,
                      border: '1.5px solid #E8DCD6',
                      fontSize: 14,
                      color: '#5D4E60',
                      backgroundColor: '#fff',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#D4C8E8')}
                    onBlur={(e) => (e.target.style.borderColor = '#E8DCD6')}
                  />
                )}
              </div>

              {/* Image upload */}
              <div className="add-snack-field" style={{ marginBottom: 18 }}>
                <label
                  style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8B7D6B', marginBottom: 4 }}
                >
                  Photo (optional)
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="add-snack-upload-btn"
                    style={{
                      padding: '8px 16px',
                      borderRadius: 10,
                      border: '1.5px dashed #D4C8E8',
                      backgroundColor: 'transparent',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#7B6B8D',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    Choose File
                  </button>

                  {imagePreview && (
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '2px solid #F0DCD4',
                      }}
                    >
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div
                  className="add-snack-error"
                  style={{
                    fontSize: 12,
                    color: '#e85d75',
                    marginBottom: 12,
                    textAlign: 'center',
                  }}
                >
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div
                className="add-snack-actions"
                style={{ display: 'flex', gap: 10, justifyContent: 'center' }}
              >
                <button
                  type="button"
                  onClick={() => { resetForm(); onClose(); }}
                  className="add-snack-cancel-btn"
                  style={{
                    padding: '10px 22px',
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
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={addMutation.isPending}
                  className="add-snack-submit-btn"
                  style={{
                    padding: '10px 26px',
                    borderRadius: 12,
                    border: 'none',
                    backgroundColor: addMutation.isPending ? '#D4C8E8' : '#FFB7C5',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#fff',
                    cursor: addMutation.isPending ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: '0 2px 8px rgba(255,183,197,0.3)',
                  }}
                >
                  {addMutation.isPending ? 'Adding...' : 'Add Snack'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
