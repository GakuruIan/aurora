import React from "react";

const loader = () => {
  return (
    <div className="animate-pulse">
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="py-4 mb-2" key={index}>
          <div className="flex mb-4 w-full items-center gap-2">
            <div className="h-2 w-32 dark:bg-dark-50 bg-gray-200 rounded-sm"></div>
            <div className="ml-auto h-2 w-12 dark:bg-dark-50 bg-gray-200 rounded-sm"></div>
          </div>
          <div className="my-2 h-2 w-24 dark:bg-dark-50 bg-gray-200 rounded-sm"></div>
          <div className="h-6 w-56 md:w-64 dark:bg-dark-50 bg-gray-200 rounded-md"></div>
        </div>
      ))}
    </div>
  );
};

export default loader;
