"use client";
import React, { useEffect, useState } from "react";

//icons
import {
  MoreHorizontal,
  MonitorSmartphone,
  TabletSmartphone,
} from "lucide-react";

//type
import { SessionWithActivitiesResource } from "@/interfaces";

interface props {
  getSessions(): Promise<SessionWithActivitiesResource[]>;
}

// components
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

const Sessions: React.FC<props> = ({ getSessions }) => {
  const [sessions, setSession] = useState<SessionWithActivitiesResource[]>([]);

  useEffect(() => {
    getSessions().then((res) => {
      setSession(res);
    });
  }, []);

  return (
    <div className="mt-8">
      <h1 className="text-base font-poppins mb-2">Devices</h1>

      <div className="mt-4 px-2 border dark:border-dark-10 border-gray-500 rounded-md py-4">
        <Table>
          <TableCaption>A list of logged in devices</TableCaption>
          <TableBody className="overflow-x-auto">
            {sessions.map((session) => (
              <TableRow
                key={session.id}
                className="flex items-center justify-between "
              >
                <TableCell className="flex items-center gap-x-2">
                  {session.latestActivity.isMobile ? (
                    <TabletSmartphone size={18} />
                  ) : (
                    <MonitorSmartphone size={18} />
                  )}
                  {session.latestActivity.deviceType}
                </TableCell>
                <TableCell className="md:block hidden dark:text-gray-400 text-gray-500">
                  {session.latestActivity.browserName}
                </TableCell>
                <TableCell className="md:block hidden dark:text-gray-400 text-gray-500">
                  {session.latestActivity.city} ,{" "}
                  {session.latestActivity.country}
                </TableCell>

                <TableCell className="dark:text-gray-400 text-gray-500">
                  IP {session.latestActivity.ipAddress}
                </TableCell>
                <TableCell className="dark:text-gray-400 text-gray-500">
                  {session.lastActiveAt.toDateString()}
                </TableCell>
                <TableCell>
                  {" "}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="">
                        Revoke device
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Sessions;
