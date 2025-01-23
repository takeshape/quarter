import { create } from "zustand";
import { persist } from 'zustand/middleware'

type Settings = {
  email: string;
  setEmail: (email: string) => void;
}

export const useSettingsStore = create<Settings>()(
  persist(
    (set) => ({
      email: '',
      setEmail: (email: string) => set({ email }),
    }),
    {
      name: 'settings-storage'
    }
  )
);