"use client";

import React, {
  useState,
  ChangeEvent,
  MouseEvent,
  useEffect,
  useRef,
  forwardRef,
} from "react";
import { Input } from "@/components/ui/input";
import { ArrowUpCircle, CheckIcon, LucideXCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  value?: (string | number)[];
  options?: { value: string | number; label: string | number }[];
  isLoading?: boolean;
  onChange?: (value: (string | number)[]) => void;
}

const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  ({ value = [], options = [], isLoading = false, onChange }, ref) => {
    const [selectedOptions, setSelectedOptions] =
      useState<(string | number)[]>(value);
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");
    const containerRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //   setSelectedOptions(value);
    // }, [value]);

    const toggleDropdown = () => {
      setDropdownVisible(!dropdownVisible);
    };

    const selectOption = (option: {
      value: string | number;
      label: string | number;
    }) => {
      const isSelected = selectedOptions.includes(option.value);

      const newVal = isSelected
        ? selectedOptions.filter((selected) => selected !== option.value)
        : [...selectedOptions, option.value];

      if (onChange) {
        onChange(newVal);
      }

      setFilter("");
      setDropdownVisible(false);
    };

    const removeOption = (option: {
      value: string | number;
      label: string | number;
    }) => {
      setSelectedOptions(
        selectedOptions.filter((selected) => selected !== option.value)
      );
    };

    const clearSelections = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setSelectedOptions([]);
      if (onChange) {
        onChange([]);
      }
    };

    const filteredOptions = options.filter((option) =>
      option.label.toString().toLowerCase().includes(filter.toLowerCase())
    );

    useEffect(() => {
      const handleClickOutside = (event: Event) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setDropdownVisible(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    if (isLoading) {
      return (
        <div className="relative w-full h-14 bg-neutral-900 rounded-md animate-pulse" />
      );
    }

    return (
      <div ref={containerRef} className="relative w-full">
        <div
          className="flex items-center justify-between border border-gray-300 rounded-md p-2 cursor-text truncate"
          onClick={toggleDropdown}
        >
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Select Options..."
              className="flex-grow outline-none"
              value={filter}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFilter(e.target.value)
              }
            />
            <div className="flex gap-2">
              {selectedOptions.map((option) => {
                const selectedOption = options.find(
                  (opt) => opt.value === option
                );
                return (
                  <div
                    key={option}
                    className="bg-neutral-950 border border-slate-100 text-white rounded-md px-2 py-1 flex items-center text-nowrap"
                  >
                    {selectedOption?.label}
                    <span
                      className="ml-2 cursor-pointer hover:text-red-500 duration-150"
                      onClick={(e) => {
                        e.stopPropagation();
                        const selectedOption = options.find(
                          (opt) => opt.value === option
                        );
                        if (selectedOption) {
                          removeOption(selectedOption);
                        }
                      }}
                    >
                      <LucideXCircle />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <button
              className="text-gray-500 text-xl ml-2 hover:text-red-500 duration-150"
              aria-label="Clear selections"
              type="button"
              onClick={clearSelections}
            >
              <LucideXCircle />
            </button>
            <button
              className="text-gray-500 text-xl ml-2"
              aria-label="Toggle dropdown"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown();
              }}
            >
              <ArrowUpCircle
                className={cn(
                  dropdownVisible ? "rotate-180" : "rotate-0",
                  "duration-150"
                )}
              />
            </button>
          </div>
        </div>
        {dropdownVisible && (
          <div className="absolute w-full mt-1 max-h-40 overflow-y-auto border border-gray-300 rounded-md bg-neutral-900 z-10">
            {filteredOptions.map((option) => {
              const isSelected = selectedOptions.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={cn(
                    "flex gap-2 items-center p-2 cursor-pointer hover:bg-neutral-600 duration-300 capitalize",
                    isSelected && "bg-neutral-800"
                  )}
                  onClick={() => selectOption(option)}
                >
                  {option.label}{" "}
                  {isSelected && <CheckIcon className="size-3" />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

// Set the display name for the component
MultiSelect.displayName = "MultiSelect";

export default MultiSelect;
