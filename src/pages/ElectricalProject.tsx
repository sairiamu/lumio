import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { CircuitCanvas } from '../components/canvas/CircuitCanvas';
import { ComponentPalette } from '../components/panels/ComponentPalette';
import { useCircuitKeyboardShortcuts } from '../hooks/useCircuitKeyboardShortcuts';

const ElectricalProjectInner: React.FC = () => {
  useCircuitKeyboardShortcuts();

  return (
    <div className="flex flex-1 relative overflow-hidden bg-[var(--canvas)]">
      <ComponentPalette />
      <main className="flex-1 relative overflow-hidden">
        <CircuitCanvas />
      </main>

      {/* Visual Debug Indicator */}
      <div className="absolute top-12 left-20 bg-emerald-600 px-2 py-1 rounded text-white text-[10px] z-[100] shadow-lg pointer-events-none font-bold">
        LUMIO ELECTRICAL
      </div>
    </div>
  );
};

export const ElectricalProject: React.FC = () => {
  return <ElectricalProjectInner />;
};
