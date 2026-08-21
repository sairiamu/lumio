import React, { useState } from 'react';
import { ProjectShell } from './pages/ProjectShell';
import { ElementalSketch } from './pages/ElementalSketch';
import { SplashScreen } from './components/shell/SplashScreen';
import { useCanvasStore } from './store/canvasStore';

// Prevents splash from showing on hot reloads
let hasShownSplash = false;

export const markSplashAsShown = () => {
  hasShownSplash = true;
};

const ElectricalStub: React.FC = () => (
  <div className="flex-1 flex items-center justify-center bg-[var(--canvas)] text-[var(--text-muted)]">
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2">Electrical Mode</h2>
      <p>Arduino design and simulation coming in Stage 6.</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const { projectType } = useCanvasStore();
  const [showSplash, setShowSplash] = useState(!hasShownSplash);

  const handleSplashEnd = () => {
    setShowSplash(false);
    hasShownSplash = true;
  };

  return (
    <ProjectShell>
      {projectType === 'elemental-sketch' ? (
        <ElementalSketch />
      ) : (
        <ElectricalStub />
      )}
      {showSplash && <SplashScreen onAnimationEnd={handleSplashEnd} />}
    </ProjectShell>
  );
};

export default App;


export default App;
