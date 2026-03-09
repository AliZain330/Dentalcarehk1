import { useMemo } from "react";
import { basicSystemSettings, type BasicSystemSettings } from "@/admin/data/adminSystemSettingsData";

const STORAGE_KEY = "admin-system-basic-settings";

export const useAdminSystemSettings = () => {
  return useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return basicSystemSettings;
      const parsed = JSON.parse(raw) as Partial<BasicSystemSettings>;
      return { ...basicSystemSettings, ...parsed };
    } catch {
      return basicSystemSettings;
    }
  }, []);
};

export const persistAdminSystemSettings = (settings: BasicSystemSettings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};
