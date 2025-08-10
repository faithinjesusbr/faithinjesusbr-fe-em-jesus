import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";

// se o arquivo estiver em client/src/components/ui/tooltip.tsx use este import:
import { TooltipProvider } from "@/components/ui/tooltip";
// se você colocou o arquivo em client/src/components/tooltip.tsx, troque a linha acima por:
// import { TooltipProvider } from "@/components/tooltip";

import { Toaster } from "@/components/ui/toaster";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TooltipProvider>
      <App />
      <Toaster />
    </TooltipProvider>
  </React.StrictMode>
);
