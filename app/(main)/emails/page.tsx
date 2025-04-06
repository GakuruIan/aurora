"use client";
import React from "react";

// icons
import {
  Archive,
  Forward,
  Trash2,
  EllipsisVertical,
  SquarePen,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Separator } from "@/components/ui/separator";

import { ScrollArea } from "@/components/ui/scroll-area";

import Actiontooltip from "@/components/Actiontooltip/Actiontooltip";

// mail display
import MailDisplay from "@/components/MailDisplay/MailDisplay";

import { Label } from "@/components/ui/label";
import Inbox from "@/components/Email/Inbox/inbox";
import Sent from "@/components/Email/Sent/sent";

const Page = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <div className="">
      <div className="flex-1 flex gap-x-2">
        <Sidebar
          collapsible="none"
          className="hidden  md:flex w-full md:w-80"
          {...props}
        >
          <SidebarHeader className=" gap-3.5 border-b p-4 mb-2">
            <div className="flex items-center justify-between">
              <Label>MailBox</Label>
              <SquarePen size={18} />
            </div>
          </SidebarHeader>
          <ScrollArea className="h-[calc(100vh-8.5rem)]">
            <SidebarContent className="relative">
              <Tabs defaultValue="inbox" className="max-w-80">
                <TabsList className="grid grid-cols-2 relative">
                  <TabsTrigger value="inbox">Inbox</TabsTrigger>
                  <TabsTrigger value="sent">Sent</TabsTrigger>
                </TabsList>

                <TabsContent value="inbox">
                  <SidebarGroup className="px-0">
                    <SidebarGroupContent>
                      <Inbox />
                    </SidebarGroupContent>
                  </SidebarGroup>
                </TabsContent>

                <TabsContent value="sent">
                  <SidebarGroup className="px-0">
                    <SidebarGroupContent>
                      <Sent />
                    </SidebarGroupContent>
                  </SidebarGroup>
                </TabsContent>
              </Tabs>
            </SidebarContent>
          </ScrollArea>
          {/* <SidebarRail /> */}
        </Sidebar>

        {/* email content */}
        <div className="flex-1  md:border-l border-border">
          {/* <Separator orientation="horizontal" className="mr-2 h-4" /> */}
          <header className="sticky top-10 z-10 dark:bg-dark-300 flex shrink-0 items-center justify-between gap-2 border-b bg-background p-4">
            {/* <SidebarTrigger className="-ml-1" /> */}
            <div className="flex items-center">
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Inbox</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center space-x-4">
              <Actiontooltip
                align="center"
                label="Move to archive"
                side="bottom"
              >
                <Archive size={16} />
              </Actiontooltip>
              <Actiontooltip align="center" label="Forward Mail" side="bottom">
                <Forward size={16} />
              </Actiontooltip>
              <Actiontooltip align="center" label="Delete Mail" side="bottom">
                <Trash2 size={16} />
              </Actiontooltip>
              <Actiontooltip align="center" label="More" side="bottom">
                <EllipsisVertical size={16} />
              </Actiontooltip>
            </div>
          </header>
          <MailDisplay />
        </div>
        {/* email content */}
      </div>
    </div>
  );
};

export default Page;
