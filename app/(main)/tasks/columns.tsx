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

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface Tasks {
  title: string;
  notes: string;
  status: string;
  importance: string;
  due: string;
  startDateTime: string;
}

const getDueDateStatus = (dueDate: string) => {
  const currentDate = new Date();
  const due = new Date(dueDate);

  const diffInMs = due.getTime() - currentDate.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 0) {
    return `Overdue by ${Math.abs(diffInDays)} day(s)`;
  } else if (diffInDays === 0) {
    return "Due Today";
  } else {
    return `${diffInDays} day(s) left`;
  }
};

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
      const task = row.original;

      const dateValue = row.getValue("startDateTime");
      const date = dateValue ? new Date(String(dateValue)) : null;

      return (
        <>
          <Sheet>
            <DropdownMenu modal={false}>
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
                {/* <TaskView /> */}
                <DropdownMenuItem>
                  <SheetTrigger className="flex items-center gap-x-2">
                    <Eye size={18} />
                    View Task
                  </SheetTrigger>
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
            <SheetContent>
              <SheetHeader className="mb-2">
                <SheetTitle>{task.title}</SheetTitle>
                <SheetDescription>{task.notes}</SheetDescription>
              </SheetHeader>

              <div className="mt-2">
                {/* importance */}
                <div className="py-2">
                  <p className="text-sm mb-1">Importance</p>
                  <span
                    className={`px-4 rounded-sm text-sm py-0.5 w-16 ${
                      row.getValue("importance") === "Low"
                        ? "bg-blue-600/20 dark:bg-blue-400/5 text-blue-500"
                        : row.getValue("importance") === "Medium"
                        ? "bg-yellow-600/20 dark:bg-yellow-400/5 text-yellow-500"
                        : row.getValue("importance") === "High"
                        ? "bg-rose-600/20 dark:bg-rose-300/5 text-rose-500"
                        : ""
                    }`}
                  >
                    {task.importance}
                  </span>
                </div>
                {/* importance */}

                {/* status */}
                <div className="py-2">
                  <p className="text-sm mb-1">Status</p>
                  <span
                    className={`px-4 rounded-sm text-sm py-0.5 ${
                      row.getValue("importance") === "Low"
                        ? "bg-blue-600/20 dark:bg-blue-400/5 text-blue-500"
                        : row.getValue("importance") === "Medium"
                        ? "bg-yellow-600/20 dark:bg-yellow-400/5 text-yellow-500"
                        : row.getValue("importance") === "High"
                        ? "bg-rose-600/20 dark:bg-rose-300/5 text-rose-500"
                        : ""
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                {/* status */}

                {/* due Date */}
                <div className=" mt-2">
                  <p className="text-sm mb-2">Time period</p>

                  <div className="flex items-center gap-x-2">
                    <p className="text-sm dark:text-gray-400 text-gray-500">
                      {date ? date.toLocaleDateString("en-GB") : "Invalid Date"}
                    </p>
                    -
                    <p className="text-sm dark:text-gray-400 text-gray-500">
                      {task.due}
                    </p>
                  </div>
                </div>
                {/* due Date */}

                {/* due Date */}
                <div className=" mt-2">
                  <p className="text-sm mb-2">Time Remaining</p>

                  <div className="flex items-center gap-x-2">
                    <p className="text-sm dark:text-gray-400 text-gray-500">
                      {getDueDateStatus(task.due)}
                    </p>
                  </div>
                </div>
                {/* due Date */}
              </div>
            </SheetContent>
          </Sheet>
        </>
      );
    },
  },
];
