import React from "react";

// components
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import Appsiderbar from "@/components/Appsidebar/App-sidebar";
import Topbar from "@/components/Topbar/Topbar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <Appsiderbar />

      <SidebarInset>
        <Topbar />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
