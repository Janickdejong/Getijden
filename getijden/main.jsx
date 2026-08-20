import React from "react";
import { createRoot } from "react-dom/client";
import Getijden from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Getijden />
  </React.StrictMode>
);

// offline: de app is statisch, dus alles mag in de cache
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
