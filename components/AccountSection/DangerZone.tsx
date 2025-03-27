"use client";
import React from "react";

import { useClerk } from "@clerk/nextjs";

interface props {
  deleteAccount(): Promise<void>;
}

// router
import { redirect } from "next/navigation";

// components
import { Button } from "../ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Separator } from "../ui/separator";
import { toast } from "sonner";

const DangerZone: React.FC<props> = ({ deleteAccount }) => {
  const { signOut } = useClerk();

  const handleLogout = async () => {
    toast.promise(
      (async () => {
        await signOut();
      })(),
      {
        loading: "Logging out...",
        success: "Logged out successful!",
        error: "An error occurred while logging you out",
        position: "top-center",
      }
    );
  };

  const handleDeleteAccount = async () => {
    toast.promise(
      (async () => {
        await deleteAccount();
        redirect("/login");
      })(),
      {
        loading: "Deleting account...",
        success: "Account deleted successful!",
        error: "An error occurred while deleting your account",
        position: "top-center",
      }
    );
  };

  return (
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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="bg-rose-600 hover:bg-rose-500"
              >
                Logout{" "}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Log out confirmation</AlertDialogTitle>
                <AlertDialogDescription>
                  You can still login into you account anytime
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-rose-600 hover:bg-rose-500 text-white"
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="bg-rose-600 hover:bg-rose-500"
              >
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No,Keep account</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-rose-600 hover:bg-rose-500 text-white"
                >
                  Yes,Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default DangerZone;
