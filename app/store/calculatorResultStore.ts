import { createStore } from 'zustand/vanilla';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CalculatorState {
    results: CalculateResult[];
    addResult: (result: CalculateResult) => void;
    deleteResult: (id: string) => void;
    updateResult: (updatedResult: CalculateResult) => void;
    toggleChecked: (id: string) => void;
    updateMemo: (id: string, memo: string) => void;
}

const useCalculatorResultStore = createStore<CalculatorState>()(
    persist(
        (set) => ({
            results: [],

            addResult: (result: CalculateResult) =>
                set((state) => ({ results: [...state.results, result] })),

            deleteResult: (id: string) =>
                set((state) => ({
                    results: state.results.filter((result) => result.id !== id),
                })),

            updateResult: (updatedResult: CalculateResult) =>
                set((state) => ({
                    results: state.results.map((result) =>
                        result.id === updatedResult.id ? updatedResult : result
                    ),
                })),

            toggleChecked: (id: string) =>
                set((state) => ({
                    results: state.results.map((result) =>
                        result.id === id ? { ...result, checked: !result.checked } : result
                    ),
                })),

            updateMemo: (id: string, memo: string) =>
                set((state) => ({
                    results: state.results.map((result) =>
                        result.id === id ? { ...result, memo } : result
                    ),
                })),
        }),
        {
            name: 'calculator-results',
            storage: createJSONStorage(() => {
                // 클라이언트 사이드에서만 sessionStorage 사용
                if (typeof window !== 'undefined') {
                    return window.sessionStorage;
                }
                return {
                    getItem: () => null,
                    setItem: () => {},
                    removeItem: () => {},
                };
            }),
        }
    )
);

export default useCalculatorResultStore;
