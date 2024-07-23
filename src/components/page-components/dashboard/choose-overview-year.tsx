"use client";
import React, { FC } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelectedYearStore } from "@/store/selected-year";

interface Props {}
const startYear = 2023;
const currentYear = new Date().getFullYear();

const years = Array.from(
  { length: currentYear - startYear + 1 },
  (_, i) => startYear + i
);

const ChooseOverviewYear: FC<Props> = ({}) => {
  const { year, setYear } = useSelectedYearStore();
  return (
    <div className="max-w-fit border border-neutral-500/50 bg-neutral-800/20 rounded p-5 my-5 items-end">
      <div className="flex items-center justify-between gap-5">
        <div className="text-2xl text-neutral-500">Current Year: {year}</div>
        <Select
          onValueChange={(value) => setYear(Number(value))}
          defaultValue={String(year)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Year</SelectLabel>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ChooseOverviewYear;
