import React from "react";
import Image from "next/image";

// background image
import logo from "@/public/colorful-logo.png";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full flex items-center  justify-center ">
      <div className="flex px-4 md:px-0  flex-col gap-y-4 w-full md:w-96 ">
        <div className=" mb-2 flex items-center justify-center  w-full">
          <div className="size-16">
            <Image
              src={logo}
              alt="logo"
              className="h-full w-full"
              objectFit="fit"
            />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default layout;
