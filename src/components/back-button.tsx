"use client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

const BackButton: FC<Props> = ({ children, className }) => {
  const router = useRouter();
  return (
    <span
      onClick={() => router.back()}
      className={cn(
        "flex items-center gap-x-2 hover:bg-neutral-800 w-fit p-2 rounded cursor-pointer",
        className
      )}
    >
      {children}
    </span>
  );
};

export default BackButton;
