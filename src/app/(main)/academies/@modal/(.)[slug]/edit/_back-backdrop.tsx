"use client";
import { useRouter } from "next/navigation";
import React from "react";

const BackBackdrop = () => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.back()}
      className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
  );
};

export default BackBackdrop;
