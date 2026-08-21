import React from 'react';

interface LoginProps {
  onAuthenticated: () => void;
}

export const Login: React.FC<LoginProps> = ({ onAuthenticated }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent)] opacity-10 blur-[120px] rounded-full pointer-events-none" />

      <div className="glass-panel p-12 rounded-3xl flex flex-col items-center gap-8 shadow-2xl relative z-10 max-w-md w-full border border-white/10">
        <div className="flex flex-col items-center gap-4">
          <img src="/lumio.svg" alt="Lumio Logo" className="w-20 h-20" />
          <h1 className="text-4xl font-bold font-sora">Lumio</h1>
          <p className="text-[var(--text-muted)] text-center font-inter">
            Illuminate your ideas with visual communication and sketching.
          </p>
        </div>

        <button
          onClick={onAuthenticated}
          className="w-full py-4 px-6 bg-[var(--accent)] hover:bg-[var(--accent-light)] text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-[var(--accent)]/20 active:scale-95"
          aria-label="Get Started"
        >
          Get Started
        </button>

        <p className="text-[var(--text-muted)] text-[12px] font-inter">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
