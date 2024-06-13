import Navigation from "@/components/navigation";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export const fetchCache = "force-no-store";

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Navigation />
      <div className="w-full min-h-screen flex flex-row relative">
        {children}
      </div>
    </>
  );
};

export default MainLayout;
