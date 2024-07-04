import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const currentYear = new Date().getFullYear();

interface yearState {
  year: number;
  setYear: (selectedYear: number) => void;
}

export const useSelectedYearStore = create<yearState>()(
  devtools(
    persist(
      (set) => ({
        year: currentYear,
        setYear: (selectedYear: number) =>
          set((state) => ({ year: selectedYear })),
      }),
      { name: "selectedYearStore" }
    )
  )
);
