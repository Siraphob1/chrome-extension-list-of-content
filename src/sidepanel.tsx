import React from "react";
import ReactDOM from "react-dom/client";
import SidePanel from "./pages/SidePanel";

const rootElement = document.getElementById("sidepanel-root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <SidePanel />
    </React.StrictMode>
  );
}
