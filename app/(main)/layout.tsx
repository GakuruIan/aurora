import React from "react";

// components
import Sidebar from "@/components/Sidebar/Sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <div className="hidden md:flex w-[60px] fixed z-30 flex-col bg-light-100 dark:bg-dark-300 h-full">
        <Sidebar />
      </div>
      <main className="md:pl-[60px] flex-1 w-full h-full">{children}</main>
    </div>
  );
};

export default layout;
