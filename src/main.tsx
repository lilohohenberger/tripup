import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { registerServiceWorker } from "./lib/notifications";
import { installKeyboardViewportFix } from "./lib/viewport";

registerServiceWorker();
installKeyboardViewportFix();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
