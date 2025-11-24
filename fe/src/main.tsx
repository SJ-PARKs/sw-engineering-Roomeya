import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./api/config/amplify"; // Amplify 설정 초기화 (이 파일에서 이미 Amplify.configure 호출됨)
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
