import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./api/config/amplify"; // Amplify 설정 초기화
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
