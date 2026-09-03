"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

export type AppView = "list" | "detail" | "arch";

interface AppState {
  selectedSlug: string | null;
  view: AppView;
  openProject: (slug: string) => void;
  openArch: (slug: string) => void;
  closeProject: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [view, setView] = useState<AppView>("list");

  const openProject = useCallback((slug: string) => {
    setSelectedSlug(slug);
    setView("detail");
  }, []);

  const openArch = useCallback((slug: string) => {
    setSelectedSlug(slug);
    setView("arch");
  }, []);

  const closeProject = useCallback(() => {
    setSelectedSlug(null);
    setView("list");
  }, []);

  const value = useMemo(
    () => ({ selectedSlug, view, openProject, openArch, closeProject }),
    [selectedSlug, view, openProject, openArch, closeProject],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppContextProvider");
  return ctx;
}
