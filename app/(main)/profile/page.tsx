"use client";

import React from "react";

// icons
import { MoreHorizontal, Mail } from "lucide-react";

// components
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ProfileSection from "@/components/AccountSection/ProfileSection";

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
import Sessions from "@/components/AccountSection/Sessions";

// icons
import { Plus } from "lucide-react";

// clerk
import { useUser } from "@clerk/nextjs";
import AddEmail from "@/components/AccountSection/AddEmail";

const Page = () => {
  const { user, isLoaded } = useUser();

  // show loading ui
  if (!isLoaded) {
    return (
      <div className="">
        <div className="mt-4 px-2 border animate-pulse dark:border-dark-10 border-gray-500 rounded-md py-4">
          <div className="text-base mb-3 dark:bg-dark-50 rounded-md bg-gray-400 h-2 w-44"></div>
          <div className="mb-4 flex items-center gap-x-4">
            <div className="size-10 dark:bg-dark-50 bg-gray-400 rounded-full"></div>
            <div className="text-base mb-3 dark:bg-dark-50 bg-gray-400 h-2 rounded-md w-16"></div>
          </div>

          {/* username  */}
          <div className="text-base mb-3 dark:bg-dark-50 bg-gray-400 h-4 rounded-md w-44 md:w-64"></div>
        </div>

        <div className="mt-4 px-2 border animate-pulse dark:border-dark-10 border-gray-500 rounded-md py-4">
          <div className="text-base mb-3 dark:bg-dark-50 rounded-md bg-gray-400 h-2 w-44"></div>
          <div className="mb-4 flex items-center gap-x-4">
            <div className="size-10 dark:bg-dark-50 bg-gray-400 rounded-full"></div>
          </div>

          {/* username  */}
          <div className="text-base mb-3 dark:bg-dark-50 bg-gray-400 h-4 rounded-md w-44 md:w-64"></div>

          {/* check if field is touched */}
        </div>

        <div className="mt-4 px-2 border animate-pulse dark:border-dark-10 border-gray-500 rounded-md py-4">
          <div className="text-base mb-3 dark:bg-dark-50 rounded-md bg-gray-400 h-2 w-44"></div>
          <div className="mb-4 flex items-center gap-x-4">
            <div className="size-10 dark:bg-dark-50 bg-gray-400 rounded-full"></div>
          </div>

          {/* username  */}
          <div className="text-base mb-3 dark:bg-dark-50 bg-gray-400 h-4 rounded-md w-44 md:w-64"></div>

          {/* check if field is touched */}
        </div>

        <div className="mt-4 px-2 border animate-pulse dark:border-dark-10 border-gray-500 rounded-md py-4">
          <div className="text-base mb-3 dark:bg-dark-50 rounded-md bg-gray-400 h-2 w-44"></div>
          <div className="mb-4 flex items-center gap-x-4">
            <div className="size-10 dark:bg-dark-50 bg-gray-400 rounded-full"></div>
          </div>

          {/* username  */}
          <div className="text-base mb-3 dark:bg-dark-50 bg-gray-400 h-4 rounded-md w-44 md:w-64"></div>

          {/* check if field is touched */}
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProfileSection user={user} />

      {/* email addresses */}
      <div className="mt-8">
        <h1 className="text-base font-poppins mb-2">Email Addresses</h1>

        <div className="mt-4 px-2 border dark:border-dark-10 border-gray-500 rounded-md py-4">
          <Table>
            <TableCaption>A list of your connected emails</TableCaption>
            <TableBody>
              {user?.emailAddresses.map((email) => (
                <TableRow
                  key={email.id}
                  className="flex items-center justify-between "
                >
                  <TableCell className="flex items-center gap-x-2">
                    <Mail size={16} />
                    {email.emailAddress}
                  </TableCell>
                  <TableCell className="dark:text-gray-400 text-gray-500">
                    {email.id === user.primaryEmailAddressId && (
                      <span className=" px-4 rounded-full text-center py-1.5 bg-green-600/10 text-green-700">
                        primary
                      </span>
                    )}
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
              ))}
            </TableBody>
          </Table>
          <div className="">
            <AddEmail user={user} />

            <div className="mt-4">
              <Separator />
              <button
                type="button"
                className="text-sm flex items-center gap-x-2 mt-2"
              >
                <Plus size={16} />
                Add Email
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* email addresses */}

      {/* Sessions*/}
      <Sessions
        getSessions={user?.getSessions ?? (async () => Promise.resolve([]))}
      />
      {/* Sessions*/}

      {/* Danger zone*/}
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

      {/* Danger zone*/}
    </div>
  );
};

export default Page;
