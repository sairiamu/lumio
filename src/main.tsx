import React from "react";
import ReactDOM from "react-dom/client";
import { ReactFlowProvider } from '@xyflow/react';
import App from "./App";
import "./index.css";

console.log("VibePlan: Initializing...");

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ReactFlowProvider>
        <App />
      </ReactFlowProvider>
    </React.StrictMode>
  );
} else {
  console.error("VibePlan: Root element not found");
}
