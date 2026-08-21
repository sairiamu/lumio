import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom/client";
import { ReactFlowProvider } from "@xyflow/react";
import App, { markSplashAsShown } from "./App";
import { ShareViewer } from "./pages/ShareViewer";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { SplashScreen } from "./components/shell/SplashScreen";
import { V2_ENABLED } from "./config";
import { ensureProjectsDir } from "./utils/projectDir";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "./index.css";

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
        console.error("V2Shell Init Error:", error);
      }
    };
    initApp();
  }, []);

  const handleSplashEnd = useCallback(() => {
    setShowSplash(false);
    markSplashAsShown();
  }, []);

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

  return (
    <ReactFlowProvider>
      {V2_ENABLED ? <V2Shell /> : <App />}
      <div className="fixed bottom-0 left-0 bg-red-600 text-white text-[9px] z-[9999] px-2 font-mono pointer-events-none rounded-tr-md">
        LUMIO CORE ACTIVE | {new Date().toLocaleTimeString()}
      </div>
    </ReactFlowProvider>
  );
};

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<Main />);
}
