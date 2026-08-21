import React from 'react';
import { NodeProps } from '@xyflow/react';
import { BaseCircuitNode } from './BaseCircuitNode';

export const BuzzerNode: React.FC<NodeProps> = (props) => {
  return <BaseCircuitNode {...props} />;
};
