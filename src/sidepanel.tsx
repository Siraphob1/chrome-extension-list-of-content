import SidePanel from "@pages/SidePanel";
import React from "react";
import ReactDOM from "react-dom/client";

const rootElement = document.getElementById("sidepanel-root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <SidePanel />
    </React.StrictMode>
  );
}
