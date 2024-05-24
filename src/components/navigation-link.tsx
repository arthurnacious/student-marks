import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Link from "next/link";
import React from "react";

interface Props {
  name: string;
  to: string;
  children: React.ReactNode;
}

const NavigationLink: React.FC<Props> = ({ name, to, children }) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={to}
            className="flex p-1 rounded cursor-pointer stroke-[0.75] hover:stroke-neutral-100 stroke-neutral-400 text-neutral-400 hover:text-neutral-100 place-items-center gap-3 hover:bg-neutral-700/30 transition-colors duration-100"
          >
            {children}
            <p className="text-inherit overflow-clip font-poppins truncate whitespace-nowrap tracking-wide">
              {name}
            </p>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NavigationLink;
