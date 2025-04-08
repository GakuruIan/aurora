"use client";

import React from "react";

import Image from "next/image";

interface Account {
  id: string;
  googleEmail: string;
  googleId: string;
}

// icons
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import logo from "@/public/colorful-logo.png";

const Accountswitcher = () => {
  const { isMobile } = useSidebar();

  const {
    data: accounts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () =>
      await axios.get<Account[]>("/api/accounts").then((res) => res.data),
  });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <div className="flex items-center ">
                <Image src={logo} alt="logo" className="size-8 mr-2" />
                <p className="">Aurora</p>
              </div>
              <ChevronsUpDown size={14} className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg dark:bg-dark-100 bg-white border-0"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Accounts
            </DropdownMenuLabel>
            {accounts?.map((account) => (
              <DropdownMenuItem key={account.id} className="gap-2 p-2">
                {/* <div className="flex size-6 items-center justify-center rounded-sm border">
                <team.logo className="size-4 shrink-0" />
              </div> */}
                <span className="truncate font-semibold">
                  {" "}
                  {account.googleEmail}
                </span>

                {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator className="dark:bg-dark-10" />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add Account
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default Accountswitcher;
