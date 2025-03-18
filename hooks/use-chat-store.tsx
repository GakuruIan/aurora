import { create } from "zustand";

interface chatState {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
}

export const useChatStore = create<chatState>((set) => ({
  isOpen: false,
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
}));
