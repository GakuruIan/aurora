"use client";
import React, { useEffect } from "react";

// components
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import Appsiderbar from "@/components/Appsidebar/App-sidebar";
import Topbar from "@/components/Topbar/Topbar";
import AiButton from "@/components/FabButton/AiButton";

// clerk auth
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    if (!userId && isLoaded) {
      redirect("/login");
    }
  }, [userId, isLoaded]);

  return (
    <SidebarProvider>
      <Appsiderbar />

      <SidebarInset>
        <Topbar />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-4">{children}</main>

        <AiButton />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
