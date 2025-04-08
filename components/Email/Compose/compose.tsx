import React from "react";

import { SquarePen } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import EmailForm from "../EmailForm/EmailForm";

const compose = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="border-0 dark:hover:bg-dark-50">
          <SquarePen />
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Compose Email</DrawerTitle>
            <DrawerDescription>Write your email</DrawerDescription>
          </DrawerHeader>

          <div className="">
            <EmailForm />
          </div>

          <DrawerFooter></DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default compose;
