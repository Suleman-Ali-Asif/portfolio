"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export type AppMode = "gui" | "terminal";
export type AppView = "list" | "detail" | "arch";

const STORAGE_KEY = "portfolio-mode";

interface AppState {
  mode: AppMode;
  isReady: boolean;
  hasChosenMode: boolean;
  selectedSlug: string | null;
  view: AppView;
  setMode: (mode: AppMode) => void;
  openProject: (slug: string) => void;
  openArch: (slug: string) => void;
  closeProject: () => void;
  toggleMode: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>("terminal");
  const [isReady, setIsReady] = useState(false);
  const [hasChosenMode, setHasChosenMode] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [view, setView] = useState<AppView>("list");

  // Read persisted choice from localStorage on first mount.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as AppMode | null;
    if (stored === "gui" || stored === "terminal") {
      setModeState(stored);
      setHasChosenMode(true);
    }
    setIsReady(true);
  }, []);

  const setMode = (m: AppMode) => {
    setModeState(m);
    setHasChosenMode(true);
    localStorage.setItem(STORAGE_KEY, m);
  };

  const openProject = (slug: string) => {
    setSelectedSlug(slug);
    setView("detail");
    setMode("gui");
  };

  const openArch = (slug: string) => {
    setSelectedSlug(slug);
    setView("arch");
    setMode("gui");
  };

  const closeProject = () => {
    setSelectedSlug(null);
    setView("list");
  };

  const toggleMode = () => {
    const next: AppMode = mode === "gui" ? "terminal" : "gui";
    setMode(next);
  };

  return (
    <AppContext.Provider
      value={{
        mode,
        isReady,
        hasChosenMode,
        selectedSlug,
        view,
        setMode,
        openProject,
        openArch,
        closeProject,
        toggleMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppContextProvider");
  return ctx;
}
