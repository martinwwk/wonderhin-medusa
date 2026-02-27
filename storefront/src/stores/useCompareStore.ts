// 📁 stores/useCompareStore.ts
import { create } from 'zustand'
import { Product } from '@/types/template'
import { persist } from 'zustand/middleware'

const MAX_COMPARE = 4;

type CompareState = {
    compareList: Product[];
    addToCompare: (product: Product) => void;
    removeFromCompare: (productId: number) => void;
    clearCompare: () => void;
}

export const useCompareStore = create<CompareState>()(
    persist(
        (set, get) => ({
            compareList: [],
            addToCompare: (product) => {
                const current = get().compareList;
                if (current.find((p) => p.id === product.id)) return;
                if (current.length >= MAX_COMPARE) return;
                set({ compareList: [...current, product] });
            },

            removeFromCompare: (productId) => {
                set((state) => ({
                    compareList: state.compareList.filter((p) => p.id !== productId),
                }));
            },

            clearCompare: () => set({ compareList: [] }),
        }),
        {
            name: 'glozin-compares', // localStorage key
        }
    )
);
