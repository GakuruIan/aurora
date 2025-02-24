"use client";

import React from "react";

// icons
import {
  MessageSquareDiff,
  PanelLeftOpen,
  Bot,
  Cable,
  Search,
} from "lucide-react";

import Image from "next/image";

// logo
import logo from "@/public/colorful-logo.png";

// components
import { Separator } from "../ui/separator";
import Actiontooltip from "../Actiontooltip/Actiontooltip";
import { ModeToggle } from "../mode-toggle";
// routing
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="flex flex-col h-full items-center pb-4">
      <div className="flex flex-col flex-1 gap-y-6 items-center">
        <div className="size-10 mt-2">
          <Image src={logo} alt="logo" />
          <Separator />
        </div>

        <div className="mb-2">
          <Actiontooltip label="Open sidebar" align="center" side="right">
            <Link href="/">
              <PanelLeftOpen
                size={20}
                className="text-gray-600 dark:text-gray-200  dark:hover:text-gray-400 hover:text-gray-500 transition duration-75"
              />
            </Link>
          </Actiontooltip>
        </div>

        <div className="mb-2">
          <Actiontooltip label="New chat" align="center" side="right">
            <Link href="/">
              <MessageSquareDiff
                size={20}
                className="text-gray-600 dark:text-gray-200  dark:hover:text-gray-400 hover:text-gray-500 transition duration-75"
              />
            </Link>
          </Actiontooltip>
        </div>

        <div className="mb-2">
          <Actiontooltip label="Create Agent" align="center" side="right">
            <Link href="/">
              <Bot
                size={20}
                className="text-gray-600 dark:text-gray-200  dark:hover:text-gray-400 hover:text-gray-500 transition duration-75"
              />
            </Link>
          </Actiontooltip>
        </div>

        <div className="mb-2">
          <Actiontooltip label="Integrations" align="center" side="right">
            <Link href="/">
              <Cable
                size={20}
                className="text-gray-600 dark:text-gray-200  dark:hover:text-gray-400 hover:text-gray-500 transition duration-75"
              />
            </Link>
          </Actiontooltip>
        </div>

        <div className="mb-2">
          <Actiontooltip label="Search" align="center" side="right">
            <Link href="/">
              <Search
                size={20}
                className="text-gray-600 dark:text-gray-200  dark:hover:text-gray-400 hover:text-gray-500 transition duration-75"
              />
            </Link>
          </Actiontooltip>
        </div>
      </div>

      {/* user */}
      <div className="flex flex-col gap-y-5">
        <div className="flex items-center my-4 justify-center dark:text-white">
          <ModeToggle />
        </div>

        <div className="">
          <div className="bg-gray-500 p-3.5 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
