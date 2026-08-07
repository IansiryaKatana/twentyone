import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouterState } from "@tanstack/react-router";
import { getSupabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import {
  emptyCmsSnapshot,
  isCmsSnapshotEmpty,
  loadCmsSnapshot,
} from "@/lib/cms/loadCmsSnapshot";
import type { CmsSnapshot } from "@/lib/cms/types";

type CmsMode = "static" | "live";

type CmsContextValue = {
  mode: CmsMode;
  snapshot: CmsSnapshot | null;
  loading: boolean;
  cmsEmpty: boolean;
  refetch: () => Promise<void>;
};

const CmsContext = createContext<CmsContextValue | null>(null);

export function CmsProvider({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const configured = isSupabaseConfigured();

  const [mode, setMode] = useState<CmsMode>(configured ? "live" : "static");
  const [snapshot, setSnapshot] = useState<CmsSnapshot | null>(null);
  const [loading, setLoading] = useState(configured);
  const [cmsEmpty, setCmsEmpty] = useState(false);

  const fetchSnapshot = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) {
      setMode("static");
      setSnapshot(null);
      setCmsEmpty(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const next = await loadCmsSnapshot(sb);
      setSnapshot(next);
      setCmsEmpty(isCmsSnapshotEmpty(next));
      setMode("live");
    } catch (error) {
      console.error("[CmsProvider] snapshot load failed:", error);
      setSnapshot(emptyCmsSnapshot());
      setCmsEmpty(true);
      setMode("static");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!configured) {
      setMode("static");
      setSnapshot(null);
      setCmsEmpty(false);
      setLoading(false);
      return;
    }

    if (pathname.startsWith("/admin")) {
      setLoading(false);
      return;
    }

    void fetchSnapshot();
  }, [configured, pathname, fetchSnapshot]);

  const refetch = useCallback(async () => {
    if (!configured) return;
    await fetchSnapshot();
  }, [configured, fetchSnapshot]);

  const value = useMemo<CmsContextValue>(
    () => ({
      mode,
      snapshot,
      loading,
      cmsEmpty,
      refetch,
    }),
    [mode, snapshot, loading, cmsEmpty, refetch],
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms(): CmsContextValue {
  const ctx = useContext(CmsContext);
  if (!ctx) {
    throw new Error("useCms must be used within CmsProvider");
  }
  return ctx;
}
