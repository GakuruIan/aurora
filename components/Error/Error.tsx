import React from "react";

import { CloudAlert } from "lucide-react";

const Error = ({ error }: { error: string }) => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-center flex-col gap-y-2">
        <CloudAlert size={40} className="text-rose-500" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{error}</p>
      </div>
    </div>
  );
};

export default Error;
