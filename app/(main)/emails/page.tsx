import React from "react";

// icons
import { Archive, Forward, Trash2, EllipsisVertical } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
} from "@/components/ui/sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// dummy data
import { mails } from "@/constants/mails";
import MailDisplay from "@/components/MailDisplay/MailDisplay";
import Actiontooltip from "@/components/Actiontooltip/Actiontooltip";

const Page = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <div className="">
      <div className="flex-1 flex gap-x-2">
        <Sidebar
          collapsible="none"
          className="hidden  md:flex w-full md:w-80"
          {...props}
        >
          <SidebarHeader className="gap-3.5 border-b p-4">
            <div className="flex w-full items-center justify-between">
              <div className="text-base font-medium text-foreground">
                Emails
              </div>
              <Label className="flex items-center gap-2 text-sm">
                <span>Unreads</span>
                <Switch className="shadow-none" />
              </Label>
            </div>
            <SidebarInput placeholder="Type to search..." />
          </SidebarHeader>
          <ScrollArea className="h-[calc(100vh-12.8rem)]">
            <SidebarContent>
              <SidebarGroup className="px-0">
                <SidebarGroupContent>
                  {mails.map((mail) => (
                    <a
                      href="#"
                      key={mail.email}
                      className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 dark:hover:bg-dark-50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <div className="flex w-full items-center gap-2">
                        <span>{mail.name}</span>{" "}
                        <span className="ml-auto text-xs">{mail.date}</span>
                      </div>
                      <span className="font-medium">{mail.subject}</span>
                      <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
                        {mail.teaser}
                      </span>
                    </a>
                  ))}
                </SidebarGroupContent>
              </SidebarGroup>
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
