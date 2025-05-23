import { create } from "zustand";

export type ModalType =
  | "CreateNote"
  | "EditNote"
  | "DeleteNote"
  | "CreateNoteCategory"
  | "EditCategory"
  | "DeleteCategory"
  | "Search";

import { NotesWithCategory } from "@/types";

interface NoteCategory {
  id: string;
  name: string;
  colorCode: string;
}

interface ModalData {
  note?: NotesWithCategory;
  category?: NoteCategory;
}

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: ModalData;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
