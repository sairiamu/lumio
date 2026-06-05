import React from "react";
import ReactDOM from "react-dom/client";
import { ReactFlowProvider } from '@xyflow/react';
import App from "./App";
import { ShareViewer } from "./pages/ShareViewer";
import "./index.css";

console.log("VibePlan: Initializing...");

const Main: React.FC = () => {
  const isSharePage = window.location.hash.length > 50; // Simple heuristic for now

  if (isSharePage) {
    return <ShareViewer />;
  }

  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
};

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Main />
    </React.StrictMode>
  );
} else {
  console.error("VibePlan: Root element not found");
}
