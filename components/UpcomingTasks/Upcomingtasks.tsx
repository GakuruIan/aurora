import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// dummy data
import { tasks } from "@/data/data";

const Upcomingtasks = () => {
  const dueTasks = tasks.slice(0, 5);

  return (
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
        {dueTasks.map((task, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{task.title}</TableCell>
            <TableCell>{task.status}</TableCell>
            <TableCell>{task.importance}</TableCell>
            <TableCell className="text-right">{task.due}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Upcomingtasks;
