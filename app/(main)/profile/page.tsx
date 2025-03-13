import React from "react";

// icons
import { MoreHorizontal, Mail, MonitorSmartphone } from "lucide-react";

// components
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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

// image
import Image from "next/image";

// image dummy
import pic from "@/public/astronaut.jpg";
import { Plus } from "lucide-react";

const Page = () => {
  return (
    <div>
      <form action="">
        <div className="">
          <h1 className="text-base font-poppins mb-2">Personal Information</h1>
          <Separator />
          <div className="mt-4 px-2 border dark:border-dark-10 border-gray-500 rounded-md py-4">
            <h6 className="text-base mb-3">Profile Image</h6>
            <div className="mb-4 flex items-center gap-x-4">
              <div className="size-16 rounded-full overflow-hidden">
                <Image
                  src={pic}
                  alt="profile image"
                  className="h-full w-full"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <button className="px-3 py-2 text-sm text-center font-medium border dark:border-dark-10 border-gray-500 rounded-md">
                  Add Avatar
                </button>
                <span className="text-gray-400 text-sm">
                  Recommend size 1:1, up to 2mb
                </span>
              </div>
            </div>

            {/* username  */}
            <div className="mb-4">
              <Label className="mb-2">Username</Label>

              <Input className="mt-2" />
            </div>
          </div>
        </div>

        {/* email addresses */}
        <div className="mt-8">
          <h1 className="text-base font-poppins mb-2">Email Addresses</h1>

          <div className="mt-4 px-2 border dark:border-dark-10 border-gray-500 rounded-md py-4">
            <Table>
              <TableCaption>A list of your connected emails</TableCaption>
              <TableBody>
                <TableRow className="flex items-center justify-between ">
                  <TableCell className="flex items-center gap-x-2">
                    <Mail size={16} />
                    email@gmail.com
                  </TableCell>
                  <TableCell className="dark:text-gray-400 text-gray-500">
                    Added on 12/4/2025
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Make primary email</DropdownMenuItem>
                        <DropdownMenuItem>Remove email</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="">
              <Label className="mb-2">Email address</Label>

              <Input className="mt-2" />

              <div className="mt-4">
                <Separator />
                <button className="text-sm flex items-center gap-x-2 mt-2">
                  <Plus size={16} />
                  Add Email
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* email addresses */}

        {/* Devices*/}
        <div className="mt-8">
          <h1 className="text-base font-poppins mb-2">Devices</h1>

          <div className="mt-4 px-2 border dark:border-dark-10 border-gray-500 rounded-md py-4">
            <Table>
              <TableCaption>A list of logged in devices</TableCaption>
              <TableBody>
                <TableRow className="flex items-center justify-between ">
                  <TableCell className="flex items-center gap-x-2">
                    <MonitorSmartphone size={18} />
                    computer 2
                  </TableCell>
                  <TableCell className="dark:text-gray-400 text-gray-500">
                    IP 192.106.59
                  </TableCell>
                  <TableCell className="dark:text-gray-400 text-gray-500">
                    5 days ago
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
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Devices*/}

        {/* Devices*/}
        <div className="mt-8">
          <h1 className="text-base font-poppins mb-2">Danger Zone</h1>

          <div className="mt-4 px-2 border dark:border-rose-500 border-gray-500  rounded-md py-4">
            <div className="flex items-center justify-between py-4">
              <div className="flex flex-col">
                <h6 className="text-sm text-medium">Logout </h6>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Logout of your account
                </span>
              </div>

              <Button
                variant="destructive"
                className="bg-rose-600 hover:bg-rose-500"
              >
                Logout{" "}
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between py-4">
              <div className="flex flex-col">
                <h6 className="text-sm text-medium">Delete Account</h6>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Deleting your account is irreversible. All your data will be
                  permanently lost and cannot be recovered.
                </span>
              </div>

              <Button
                variant="destructive"
                className="bg-rose-600 hover:bg-rose-500"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>

        {/* Devices*/}
      </form>
    </div>
  );
};

export default Page;
