"use client";
import React from "react";

// image
import Image from "next/image";

// icons
import { Grip, Trash2, Pencil, EllipsisVertical } from "lucide-react";

// components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "../ui/separator";
import Taskform from "../TaskList/Taskform";

// toast
import { toast } from "sonner";

// tanstack
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// axios
import axios from "axios";

// types
import { TasksList } from "@/types";
import { getFullDateFromTimestamp } from "@/lib/utils/utils";

// empty image
import empty from "@/public/empty.png";

const Board = () => {
  const { data: tasklist, isLoading } = useQuery({
    queryKey: ["tasklist"],
    queryFn: () =>
      axios
        .get<TasksList[]>("/api/google/tasks/tasklist")
        .then((res) => res.data),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await axios.delete(`/api/google/tasks/tasklist/${id}`);
        return response.data;
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "Failed to delete tasklist";
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasklist"] });
    },
  });

  // delete mutation
  const deletemutation = useMutation({
    mutationFn: async ({ id, taskid }: { id: string; taskid: string }) => {
      try {
        const response = await axios.delete(
          `/api/google/tasks/tasklist/${id}/task/${taskid}`
        );
        return response.data;
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "Failed to delete tasklist";
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasklist"] });
    },
  });

  const handleClick = (id: string) => {
    toast.promise(mutation.mutateAsync(id), {
      loading: "Deleting tasklist...",
      success: "TaskList deleted successfully!",
      error: (error) => `Error: ${error.message}`,
    });
  };

  const handDelete = (tasklistid: string, taskid: string) => {
    toast.promise(deletemutation.mutateAsync({ id: tasklistid, taskid }), {
      loading: "Deleting task...",
      success: "Task deleted successfully!",
      error: (error) => `Error: ${error.message}`,
    });
  };

  const CARDS = [1, 2, 3];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {CARDS.map((card) => (
          <Card key={card} className="animate-pulse">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <h5 className="h-4 w-24 rounded-md mb-2 dark:bg-dark-20 bg-gray-400"></h5>
              </CardTitle>
              <CardDescription>
                <div className="h-4 w-36 rounded-md dark:bg-dark-20 bg-gray-400"></div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md h-4 w-72 dark:bg-dark-20 bg-gray-400 mb-4"></div>
              <div className="rounded-md h-4 w-56 dark:bg-dark-20 bg-gray-400 mb-2"></div>

              <div className="flex items-center gap-x-6 mt-2">
                <div className="rounded-md h-4 w-28 dark:bg-dark-20 bg-gray-400"></div>
                <div className="rounded-md h-4 w-28 dark:bg-dark-20 bg-gray-400"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {tasklist?.map((list) => (
        <Card key={list.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <h5 className="font-medium">{list.title}</h5>

              {/* more action */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-full transition-colors duration-75 cursor-pointer hover:dark:bg-dark-50 hover:bg-gray-200">
                    <EllipsisVertical size={18} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>List Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Pencil size={16} />
                    <p className="text-sm">Rename List</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleClick(list.id)}>
                    <Trash2 size={16} />
                    <p className="text-sm mr-1">Delete Task</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* more action */}
            </CardTitle>
            <CardDescription>
              <Taskform id={list.id} />
            </CardDescription>
          </CardHeader>

          <CardContent>
            {list.tasks.length === 0 ? (
              <div className="flex items-center flex-col space-y-2 justify-center">
                <Image src={empty} alt="empty state" className="size-40" />
                <p className="text-sm dark:text-gray-400 text-gray-500">
                  No tasks in this list
                </p>
              </div>
            ) : (
              list?.tasks?.map((task) => (
                <div className="mb-2" key={task.id}>
                  <div className="flex items-top mb-1 group hover:cursor-pointer hover:dark:bg-dark-50 px-2 py-3  rounded-sm transition-all duration-75 ">
                    <Checkbox />
                    <div className="flex flex-1 ml-2 leading-none">
                      <div className="w-full">
                        <p className="mb-0.5 text-base leading-none">
                          {task.title}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {task.notes}
                        </p>
                        <div className="mt-1 flex items-center gap-x-6 w-full">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Status {task.status}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Due date {getFullDateFromTimestamp(task.due)}
                          </p>
                        </div>
                      </div>

                      <div className="flex  gap-x-1 ml-auto">
                        <Trash2
                          onClick={() => handDelete(list.id, task.id)}
                          size={16}
                          className="hidden group-hover:block hover:text-rose-500"
                        />
                        <Grip size={16} className="hidden group-hover:block" />
                      </div>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Board;
