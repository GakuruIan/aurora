import React from "react";

// components
import { ScrollArea } from "../ui/scroll-area";
import Replybox from "../ReplyBox/Replybox";
import { Avatar, AvatarFallback } from "../ui/avatar";

const MailDisplay = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] px-1 md:px-2 py-4 w-full">
      <header className="flex items-center justify-between w-full">
        <div className="flex items-center gap-x-2 mb-4 ">
          <Avatar>
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="">
            <h2 className="text-sm tracking-wide font-poppins">Username</h2>
            <p className="text-sm hover:dark:text-gray-300 hover:cursor-pointer transition-colors duration-75 dark:text-gray-400 text-gray-500">
              reply to ryan@gmail.com
            </p>
          </div>
        </div>
        {/* timestamp */}
        <p className="text-sm dark:text-gray-500 text-gray-400">15 sep 2024</p>
        {/* timestamp */}
      </header>
      <ScrollArea className=" flex-1 overflow-y-auto">
        <p className="text-sm ">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos
          impedit vitae est voluptas laboriosam fuga porro, odit sed commodi
          illo suscipit molestiae voluptatibus quod dolorem debitis eligendi.
          Debitis, distinctio soluta! Perspiciatis odio, nobis quo debitis
          consequuntur aliquid sunt distinctio omnis.
        </p>
      </ScrollArea>

      <div className="mt-auto">
        <Replybox />
      </div>
    </div>
  );
};

export default MailDisplay;
