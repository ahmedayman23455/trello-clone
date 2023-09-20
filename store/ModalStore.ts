import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set, get) => ({
  isOpen: false,
  openModal: () => {
    console.log("modal open");
    set({ isOpen: true });
  },

  closeModal: () => {
    console.log("modal close");

    set({ isOpen: false });
  },
}));
