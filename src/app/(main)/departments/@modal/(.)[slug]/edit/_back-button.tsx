"use client";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const BackButton = () => {
  const router = useRouter();
  return (
    <Button variant="ghost" onClick={() => router.back()}>
      <XIcon className="size-4" />
      <span className="sr-only">Close</span>
    </Button>
  );
};

export default BackButton;
