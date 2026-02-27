import { create } from 'zustand';
import {PropsInstagram} from "@/components/instagram/data";
import {Product} from "@/types/template";

export type MODAL_VIEWS =
    | 'LOGIN_VIEW'
    | 'SIGNUP_VIEW'
    | 'FORGET_PASSWORD'
    | 'PRODUCT_VIDEO'
    | 'PRODUCT_VIEW'
    | 'INSTAGRAM_VIEW';

type ModalData = PropsInstagram |  Product | null;

interface ModalState {
    view?: MODAL_VIEWS;
    data?: ModalData | null;
    isOpen: boolean;
    openModal: (view?: MODAL_VIEWS, data?: ModalData) => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalState>(
    (set) => ({
    view: undefined,
    data: null,
    isOpen: false,
    openModal: (view, data) => set({ isOpen: true, view, data }),
    closeModal: () => set({ isOpen: false, view: undefined, data: null }),
}));
