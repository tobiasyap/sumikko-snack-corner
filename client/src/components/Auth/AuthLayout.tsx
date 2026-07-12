import { ReactNode } from 'react';
import SumikkoCharacter from '../Characters/SumikkoCharacter';

export default function AuthLayout({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-characters-row">
            <SumikkoCharacter type="shirokuma" size={120} />
            <SumikkoCharacter type="penguin" size={120} />
            <SumikkoCharacter type="tonkatsu" size={120} />
          </div>
          <h1>{title}</h1>
          <p className="auth-subtitle">Sumikko Snack Corner</p>
          <div className="auth-characters-row">
            <SumikkoCharacter type="neko" size={120} />
            <SumikkoCharacter type="tokage" size={120} />
            <SumikkoCharacter type="yamapenguin" size={120} />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
