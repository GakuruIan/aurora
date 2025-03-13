import React from "react";

// components
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";

//
import { columns } from "./columns";

// dummy data
import { tasks } from "@/data/data";

const page = () => {
  return (
    <div>
      <h6 className="text-base font-poppins mb-2">Tasks</h6>
      <Separator />
      <div className="mt-4">
        <DataTable columns={columns} data={tasks} />
      </div>
    </div>
  );
};

export default page;
