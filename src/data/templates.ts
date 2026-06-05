import { Node, Edge } from '@xyflow/react';
import { NodeData, EdgeData } from '../types';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string; // Now refers to a Lucide icon name
  nodes: Node<NodeData>[];
  edges: Edge<EdgeData>[];
}

const defaultEdgeData: EdgeData = {
  strokeColor: 'var(--text-muted)',
  strokeWidth: 2,
  strokeStyle: 'solid',
  animated: false,
  lineEnd: 'arrow',
  lineStart: 'none',
  pathType: 'smooth',
};

export const BUILT_IN_TEMPLATES: Template[] = [
  {
    id: 'system-architecture',
    name: 'System Architecture',
    description: 'High-level cloud infrastructure with load balancer, APIs, and databases.',
    category: 'Architecture',
    thumbnail: 'Server',
    nodes: [
      { id: 'client', type: 'rect', position: { x: 0, y: 150 }, data: { title: 'Client', description: 'Browser/Mobile', parameters: [] } },
      { id: 'lb', type: 'circle', position: { x: 150, y: 150 }, data: { title: 'Load Balancer', description: 'Nginx / ALB', parameters: [] } },
      { id: 'api1', type: 'rect', position: { x: 350, y: 50 }, data: { title: 'API Server 1', description: 'Node.js Service', parameters: [] } },
      { id: 'api2', type: 'rect', position: { x: 350, y: 250 }, data: { title: 'API Server 2', description: 'Node.js Service', parameters: [] } },
      { id: 'db', type: 'diamond', position: { x: 600, y: 150 }, data: { title: 'Database', description: 'PostgreSQL', parameters: [] } },
      { id: 'cache', type: 'rect', position: { x: 600, y: 0 }, data: { title: 'Cache', description: 'Redis', parameters: [] } },
      { id: 'cdn', type: 'rect', position: { x: 150, y: 0 }, data: { title: 'CDN', description: 'Cloudfront', parameters: [] } },
    ],
    edges: [
      { id: 'e1', source: 'client', target: 'lb', ...defaultEdgeData },
      { id: 'e2', source: 'lb', target: 'api1', ...defaultEdgeData },
      { id: 'e3', source: 'lb', target: 'api2', ...defaultEdgeData },
      { id: 'e4', source: 'api1', target: 'db', ...defaultEdgeData },
      { id: 'e5', source: 'api2', target: 'db', ...defaultEdgeData },
      { id: 'e6', source: 'api1', target: 'cache', ...defaultEdgeData },
    ],
  },
  {
    id: 'user-flow',
    name: 'User Flow',
    description: 'Typical user journey from landing page to dashboard and features.',
    category: 'Flow',
    thumbnail: 'GitBranch',
    nodes: [
      { id: 'start', type: 'circle', position: { x: 0, y: 100 }, data: { title: 'Start', description: '', parameters: [] } },
      { id: 'landing', type: 'rect', position: { x: 150, y: 100 }, data: { title: 'Landing Page', description: 'Marketing', parameters: [] } },
      { id: 'signup', type: 'rect', position: { x: 350, y: 100 }, data: { title: 'Sign Up', description: 'Auth Flow', parameters: [] } },
      { id: 'dashboard', type: 'diamond', position: { x: 550, y: 100 }, data: { title: 'Dashboard', description: 'Main Hub', parameters: [] } },
      { id: 'featureA', type: 'rect', position: { x: 750, y: 0 }, data: { title: 'Feature A', description: 'Settings', parameters: [] } },
      { id: 'featureB', type: 'rect', position: { x: 750, y: 200 }, data: { title: 'Feature B', description: 'Profile', parameters: [] } },
      { id: 'end', type: 'circle', position: { x: 950, y: 100 }, data: { title: 'End', description: '', parameters: [] } },
    ],
    edges: [
      { id: 'e1', source: 'start', target: 'landing', ...defaultEdgeData },
      { id: 'e2', source: 'landing', target: 'signup', ...defaultEdgeData },
      { id: 'e3', source: 'signup', target: 'dashboard', ...defaultEdgeData },
      { id: 'e4', source: 'dashboard', target: 'featureA', ...defaultEdgeData },
      { id: 'e5', source: 'dashboard', target: 'featureB', ...defaultEdgeData },
      { id: 'e6', source: 'featureA', target: 'end', ...defaultEdgeData },
      { id: 'e7', source: 'featureB', target: 'end', ...defaultEdgeData },
    ],
  },
  {
    id: 'erd',
    name: 'Entity Relationship',
    description: 'Database schema showing entities and their relationships.',
    category: 'Data',
    thumbnail: 'Database',
    nodes: [
      { id: 'user', type: 'card', position: { x: 0, y: 0 }, data: { title: 'User', description: 'id, email, password', parameters: [] } },
      { id: 'order', type: 'card', position: { x: 250, y: 0 }, data: { title: 'Order', description: 'id, user_id, total', parameters: [] } },
      { id: 'product', type: 'card', position: { x: 250, y: 200 }, data: { title: 'Product', description: 'id, name, price', parameters: [] } },
      { id: 'category', type: 'card', position: { x: 500, y: 200 }, data: { title: 'Category', description: 'id, name', parameters: [] } },
      { id: 'payment', type: 'card', position: { x: 500, y: 0 }, data: { title: 'Payment', description: 'id, order_id, status', parameters: [] } },
    ],
    edges: [
      { id: 'e1', source: 'user', target: 'order', ...defaultEdgeData, data: { ...defaultEdgeData, label: 'has many' } },
      { id: 'e2', source: 'order', target: 'product', ...defaultEdgeData, data: { ...defaultEdgeData, label: 'belongs to' } },
      { id: 'e3', source: 'product', target: 'category', ...defaultEdgeData, data: { ...defaultEdgeData, label: 'belongs to' } },
      { id: 'e4', source: 'order', target: 'payment', ...defaultEdgeData, data: { ...defaultEdgeData, label: 'has one' } },
    ],
  },
  {
    id: 'lesson-plan',
    name: 'Lesson Plan',
    description: 'Sequential flow for educational content and activities.',
    category: 'Education',
    thumbnail: 'GraduationCap',
    nodes: [
      { id: 'objective', type: 'rect', position: { x: 200, y: 0 }, data: { title: 'Objective', description: 'Learning goals', parameters: [] } },
      { id: 'intro', type: 'rect', position: { x: 200, y: 100 }, data: { title: 'Introduction', description: 'Hook & Overview', parameters: [] } },
      { id: 'concept1', type: 'rect', position: { x: 200, y: 200 }, data: { title: 'Concept 1', description: 'Core Theory', parameters: [] } },
      { id: 'concept2', type: 'rect', position: { x: 200, y: 300 }, data: { title: 'Concept 2', description: 'Application', parameters: [] } },
      { id: 'activity', type: 'rect', position: { x: 200, y: 400 }, data: { title: 'Activity', description: 'Hands-on task', parameters: [] } },
      { id: 'assessment', type: 'rect', position: { x: 200, y: 500 }, data: { title: 'Assessment', description: 'Quiz / Test', parameters: [] } },
      { id: 'summary', type: 'rect', position: { x: 200, y: 600 }, data: { title: 'Summary', description: 'Key takeaways', parameters: [] } },
    ],
    edges: [
      { id: 'e1', source: 'objective', target: 'intro', ...defaultEdgeData },
      { id: 'e2', source: 'intro', target: 'concept1', ...defaultEdgeData },
      { id: 'e3', source: 'concept1', target: 'concept2', ...defaultEdgeData },
      { id: 'e4', source: 'concept2', target: 'activity', ...defaultEdgeData },
      { id: 'e5', source: 'activity', target: 'assessment', ...defaultEdgeData },
      { id: 'e6', source: 'assessment', target: 'summary', ...defaultEdgeData },
    ],
  },
  {
    id: 'kanban',
    name: 'Kanban Board',
    description: 'Task management layout with columns and cards.',
    category: 'Custom',
    thumbnail: 'Columns',
    nodes: [
      { id: 'todo-h', type: 'text', position: { x: 0, y: 0 }, data: { title: 'TODO', description: '', parameters: [] } },
      { id: 'todo-1', type: 'card', position: { x: 0, y: 50 }, data: { title: 'Task 1', description: 'Research templates', parameters: [] } },
      { id: 'todo-2', type: 'card', position: { x: 0, y: 180 }, data: { title: 'Task 2', description: 'Implement modal', parameters: [] } },

      { id: 'doing-h', type: 'text', position: { x: 250, y: 0 }, data: { title: 'IN PROGRESS', description: '', parameters: [] } },
      { id: 'doing-1', type: 'card', position: { x: 250, y: 50 }, data: { title: 'Task 3', description: 'Drafting UI', parameters: [] } },

      { id: 'done-h', type: 'text', position: { x: 500, y: 0 }, data: { title: 'DONE', description: '', parameters: [] } },
      { id: 'done-1', type: 'card', position: { x: 500, y: 50 }, data: { title: 'Task 4', description: 'Setup project', parameters: [] } },
      { id: 'done-2', type: 'card', position: { x: 500, y: 180 }, data: { title: 'Task 5', description: 'Define types', parameters: [] } },
    ],
    edges: [],
  },
];
