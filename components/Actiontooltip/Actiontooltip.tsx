import React from "react";

interface tooltipProps {
  label: string;
  side?: "left" | "right" | "top" | "bottom";
  children: React.ReactNode;
  align: "center" | "start" | "end";
}

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

const Actiontooltip: React.FC<tooltipProps> = ({
  label,
  side,
  children,
  align,
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          align={align}
          side={side}
          className="bg-gray-200 rounded-md dark:bg-dark-50"
        >
          <p className="text-sm dark:text-white font-barlow">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Actiontooltip;
