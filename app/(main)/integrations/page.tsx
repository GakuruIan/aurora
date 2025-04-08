"use client";
import React from "react";

// components
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import Image from "next/image";

// brand images
import google from "@/public/google.png";

const Page = () => {
  return (
    <div>
      <header className="flex items-center justify-between mb-2">
        <div className="">
          <h2 className="text-base font-poppins">Integrations</h2>
          <p className="text-sm dark:text-gray-400 text-gray-500">
            Reconfigure your workflow and handle repetitive tasks with
            integrations
          </p>
        </div>
      </header>
      <Separator />

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
        <Card>
          <CardHeader>
            <CardTitle>Google</CardTitle>
            <CardDescription>
              Enhance productivity with Google integration.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-2">
              <Image src={google} alt="brand logo" className="size-10" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Set up your Google integration today! Effortlessly link your
              account to keep all your files, tasks, and schedules synced across
              platforms
            </p>
          </CardContent>

          <CardFooter>
            <Button variant="link">
              <a href="/api/auth">Link account</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Page;
