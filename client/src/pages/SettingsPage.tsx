import { useState, FormEvent } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import SumikkoCharacter from '../components/Characters/SumikkoCharacter';

export default function SettingsPage() {
  const { user } = useAuth();
  const [appPass, setAppPass] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setStatus('saving');
    try {
      await api.put('/settings/email', { gmailAppPass: appPass });
      setStatus('success');
      setMessage('App Password saved!');
      setAppPass('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
    }
  }

  async function handleTest() {
    setStatus('testing');
    try {
      await api.post('/settings/email/test');
      setStatus('success');
      setMessage('Test email sent! Check your inbox.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-card">
        <div className="settings-header">
          <SumikkoCharacter type="penguin" size={80} />
          <h2>Email Notifications</h2>
        </div>

        <div className="settings-info">
          <p>Get notified 1 month before your snacks expire!</p>
          <p className="settings-email">Notifications will be sent to: <strong>{user?.email}</strong></p>
        </div>

        <div className="settings-setup-guide">
          <h3>Setup Gmail App Password</h3>
          <ol>
            <li>Go to your <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer">Google Account Security</a></li>
            <li>Enable <strong>2-Step Verification</strong> (required)</li>
            <li>Search for <strong>"App Passwords"</strong> in your Google Account settings</li>
            <li>Create a new App Password for "Mail"</li>
            <li>Copy the 16-character password below</li>
          </ol>
        </div>

        <form onSubmit={handleSave} className="settings-form">
          <div className="form-group">
            <label htmlFor="appPass">Gmail App Password</label>
            <input
              id="appPass"
              type="password"
              value={appPass}
              onChange={e => setAppPass(e.target.value)}
              placeholder="xxxx xxxx xxxx xxxx"
              required
            />
          </div>

          <div className="settings-actions">
            <button type="submit" className="btn-primary" disabled={status === 'saving'}>
              {status === 'saving' ? 'Saving...' : 'Save Password'}
            </button>
            {user?.hasEmailSetup && (
              <button type="button" className="btn-secondary" onClick={handleTest} disabled={status === 'testing'}>
                {status === 'testing' ? 'Sending...' : 'Send Test Email'}
              </button>
            )}
          </div>
        </form>

        {message && (
          <div className={`settings-message ${status}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
