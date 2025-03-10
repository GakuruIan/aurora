import React from "react";

// components
import { Separator } from "@/components/ui/separator";

// logo
import pic from "@/public/bird-logo.png";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";

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

      <div className="mt-2 grid grid-cols-2 md:grid-cols-3">
        <div className="border dark:border-dark-50 p-4 rounded-md">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-semibold">Integration One</h4>
            <div className="flex items-center px-2 py-0.5 border rounded-full">
              <span className="text-sm text-custom-personal">Connected</span>
            </div>
          </div>

          <div className="py-2 my-2">
            <Image src={pic} alt="brand logo" className="size-10" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. A
              voluptatem laborum omnis cupiditate quidem labore aut esse
              deserunt nulla facilis.
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-end mt-2 ">
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
