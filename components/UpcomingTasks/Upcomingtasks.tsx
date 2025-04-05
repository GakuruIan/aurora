import React from "react";

import { Task } from "@/types";

interface props {
  tasks: Task[];
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Upcomingtasks: React.FC<props> = ({ tasks }) => {
  return (
    <>
      {tasks?.length === 0 ? (
        <div className="flex items-center justify-center min-h-44">
          <p className="text-base text-gray-500 dark:text-gray-400">
            No tasks scheduled for today
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Importance</TableHead>
              <TableHead className="text-right">Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks?.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell className="text-right">{task.due}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default Upcomingtasks;
