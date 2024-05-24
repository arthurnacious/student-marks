import Navigation from "@/components/navigation";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Navigation />
      <main className="w-full h-screen flex flex-row relative">{children}</main>
    </>
  );
};

export default MainLayout;
