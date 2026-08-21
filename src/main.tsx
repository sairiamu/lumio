import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App, { markSplashAsShown } from "./App";
import { ShareViewer } from "./pages/ShareViewer";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { SplashScreen } from "./components/shell/SplashScreen";
import { V2_ENABLED } from "./config";
import { ensureProjectsDir } from "./utils/projectDir";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "./index.css";

console.log("Lumio: Initializing...");

const V2Shell: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projectSelected, setProjectSelected] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        await ensureProjectsDir();
        const win = getCurrentWindow();
        await win.show();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };
    initApp();
  }, []);

  const handleSplashEnd = () => {
    setShowSplash(false);
    markSplashAsShown();
  };

  if (showSplash) {
    return <SplashScreen onAnimationEnd={handleSplashEnd} />;
  }

  if (!isAuthenticated) {
    return <Login onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  if (!projectSelected) {
    return <Dashboard onProjectSelected={() => setProjectSelected(true)} />;
  }

  return <App />;
};

const Main: React.FC = () => {
  const isSharePage = window.location.hash.length > 50;

  if (isSharePage) {
    return <ShareViewer />;
  }

  if (V2_ENABLED) {
    return <V2Shell />;
  }

  return <App />;
};

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Main />
    </React.StrictMode>
  );
}
