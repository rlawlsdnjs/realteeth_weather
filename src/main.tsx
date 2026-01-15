import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import "./app/styles/index.css";
import { QueryProvider } from "./shared/lib/queryClient";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </React.StrictMode>
);
