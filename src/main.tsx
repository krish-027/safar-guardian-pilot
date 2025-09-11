import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeData } from "./lib/storageHelper";

// Initialize data on app start
initializeData();

createRoot(document.getElementById("root")!).render(<App />);
