import React, { useEffect, useState } from 'react';

const splashStyles = `
  @keyframes logoIn {
    from { opacity: 0; transform: scale(0.7); filter: blur(8px); }
    to   { opacity: 1; transform: scale(1);   filter: blur(0);   }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes taglineFade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes fillBar {
    from { width: 0%; }
    to   { width: 100%; }
  }
  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to   { opacity: 0; transform: translateY(-8px); }
  }
  @keyframes pulseGlow {
    0% { transform: scale(1); opacity: 0.15; }
    50% { transform: scale(1.15); opacity: 0.2; }
    100% { transform: scale(1); opacity: 0.15; }
  }

  .splash-container {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .splash-exit {
    animation: fadeOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .logo-wrapper {
    position: relative;
    margin-bottom: 24px;
    animation: logoIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .logo-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, var(--accent-light), transparent 70%);
    border-radius: 50%;
    z-index: -1;
    animation: pulseGlow 3s infinite ease-in-out;
  }

  .app-name {
    font-family: 'Sora', sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 8px;
    opacity: 0;
    animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards;
  }

  .tagline {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: var(--text-muted);
    margin-bottom: 32px;
    opacity: 0;
    animation: taglineFade 0.4s ease-out 0.7s forwards;
  }

  .progress-container {
    width: 200px;
    height: 3px;
    background: #3A3D4A;
    border-radius: 10px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, var(--accent), var(--success));
    border-radius: 10px;
    animation: fillBar 0.6s ease-in-out 1s forwards;
  }
`;

interface SplashScreenProps {
  onAnimationEnd?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationEnd }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Phase 5 starts at 1800ms
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1800);

    // Fade out duration is 400ms (1800 + 400 = 2200)
    const completeTimer = setTimeout(() => {
      if (onAnimationEnd) onAnimationEnd();
    }, 2200);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onAnimationEnd]);

  return (
    <div className={`splash-container ${isExiting ? 'splash-exit' : ''}`}>
      <style>{splashStyles}</style>

      {/* Background glow effects */}
      <div className="logo-glow" style={{ animationDelay: '0s', width: '300px', height: '300px' }} />
      <div className="logo-glow" style={{ animationDelay: '-1s', width: '200px', height: '200px', left: '45%', top: '45%' }} />
      <div className="logo-glow" style={{ animationDelay: '-2s', width: '250px', height: '250px', left: '55%', top: '55%' }} />

      <div className="logo-wrapper">
        <img src="/lumio.svg" alt="Lumio Logo" width="80" height="80" />
      </div>

      <h1 className="app-name">Lumio</h1>
      <p className="tagline">Illuminate Your Ideas</p>

      <div className="progress-container">
        <div className="progress-bar" />
      </div>
    </div>
  );
};
