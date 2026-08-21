import React, { useState } from 'react';
import { ProjectShell } from './pages/ProjectShell';
import { ElementalSketch } from './pages/ElementalSketch';
import { ElectricalProject } from './pages/ElectricalProject';
import { SplashScreen } from './components/shell/SplashScreen';
import { useCanvasStore } from './store/canvasStore';

// Prevents splash from showing on hot reloads
let hasShownSplash = false;

export const markSplashAsShown = () => {
  hasShownSplash = true;
};

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
        <ElectricalProject />
      )}
      {showSplash && <SplashScreen onAnimationEnd={handleSplashEnd} />}
    </ProjectShell>
  );
};

export default App;
