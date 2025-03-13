"use client";

import { ColumnDef } from "@tanstack/react-table";

import { MoreHorizontal, Eye, Pencil, Trash, ArrowUpDown } from "lucide-react";

// components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

export interface Tasks {
  title: string;
  notes: string;
  status: string;
  importance: string;
  due: string;
  startDateTime: string;
}

export const columns: ColumnDef<Tasks>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <div className="pr-4">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => {
      const wordCount = 10;
      const notes = String(row.getValue("notes"));
      const words = notes.split(" ");

      const text =
        words.length > wordCount
          ? words.slice(0, 15).join(" ") + " ..."
          : notes;

      return <p className="text-sm">{text}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "importance",
    header: "Importance",
    cell: ({ row }) => {
      return (
        <span
          className={`px-3 rounded-md text-sm py-1 ${
            row.getValue("importance") === "Low"
              ? "bg-blue-600/20 dark:bg-blue-400/5 text-blue-500"
              : row.getValue("importance") === "Medium"
              ? "bg-yellow-600/20 dark:bg-yellow-400/5 text-yellow-500"
              : row.getValue("importance") === "High"
              ? "bg-rose-600/20 dark:bg-rose-300/5 text-rose-500"
              : ""
          }`}
        >
          {row.getValue("importance")}
        </span>
      );
    },
  },
  {
    accessorKey: "due",
    header: "Due Date",
  },
  {
    accessorKey: "startDateTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="dark:hover:bg-dark-10"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start date
          <ArrowUpDown size={18} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateValue = row.getValue("startDateTime");
      const date = dateValue ? new Date(String(dateValue)) : null;

      return (
        <p className="text-sm text-center">
          {date ? date.toLocaleDateString("en-GB") : "Invalid Date"}
        </p>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const taskId = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 dark:hover:bg-dark-10"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye size={18} />
              View task
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil size={18} />
              Edit task
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash size={18} />
              Delete task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
