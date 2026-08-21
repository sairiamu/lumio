import React, { useEffect, useRef, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CircuitNodeData } from '../../../store/circuitStore';

// The @wokwi/elements are web components, so we need to tell TypeScript about them
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wokwi-arduino-uno': any;
      'wokwi-led': any;
      'wokwi-resistor': any;
      'wokwi-pushbutton': any;
      'wokwi-potentiometer': any;
      'wokwi-buzzer': any;
      'wokwi-servo': any;
      'wokwi-breadboard': any;
    }
  }
}

interface PinInfo {
  name: string;
  x: number;
  y: number;
}

export const BaseCircuitNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as CircuitNodeData;
  const elementRef = useRef<any>(null);
  const [pins, setPins] = useState<PinInfo[]>([]);
  const Tag = nodeData.type as any;

  useEffect(() => {
    // We need to wait a bit for the web component to upgrade and expose pinInfo
    const checkPins = () => {
      if (elementRef.current && elementRef.current.pinInfo) {
        setPins(elementRef.current.pinInfo);
      } else {
        setTimeout(checkPins, 50);
      }
    };
    checkPins();
  }, [nodeData.type]);

  return (
    <div className={`relative ${selected ? 'ring-2 ring-indigo-500 rounded-sm' : ''}`}>
      <Tag ref={elementRef} {...(nodeData.attrs || {})} />

      {pins.map((pin) => (
        <Handle
          key={pin.name}
          id={pin.name}
          type="source"
          position={Position.Top}
          style={{
            left: pin.x,
            top: pin.y,
            width: 8,
            height: 8,
            background: 'rgba(79, 70, 229, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'all',
            zIndex: 10
          }}
          title={pin.name}
        />
      ))}
    </div>
  );
};
