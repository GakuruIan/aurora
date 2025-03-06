"use client";
import React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";

import Accountswitcher from "../Accountswitcher/Accountswitcher";

// navigation Links
import { Navlinks } from "@/constants/navlinks";

import Link from "next/link";
import UserAccount from "../UserAccount/UserAccount";

const Appsiderbar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Accountswitcher />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Navlinks?.main.map((link) => (
                <SidebarMenuItem key={link.title}>
                  <SidebarMenuButton tooltip={link.title}>
                    <Link href={link.url} className="flex items-center">
                      <link.icon size={18} />
                      <span className="text-gray-700 ml-2 dark:text-gray-300">
                        {link.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Navlinks?.settings.map((link) => (
                <SidebarMenuItem key={link.title}>
                  <SidebarMenuButton tooltip={link.title}>
                    <Link href={link.url} className="flex items-center">
                      <link.icon size={18} />
                      <span className="text-gray-700 ml-2 dark:text-gray-300">
                        {link.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Help and Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Navlinks?.extras.map((link) => (
                <SidebarMenuItem key={link.title}>
                  <SidebarMenuButton tooltip={link.title} className="">
                    <Link href={link.url} className="flex items-center">
                      <link.icon size={18} />
                      <span className="text-gray-700 ml-2 dark:text-gray-300">
                        {link.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserAccount />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default Appsiderbar;
