"use client";
import React, { useState } from "react";

// icons
import { Pencil, Trash, CloudAlert } from "lucide-react";

// components
import Actiontooltip from "@/components/Actiontooltip/Actiontooltip";
import EditTaskform from "@/components/TaskList/Task/EditTaskform";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// axios
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// utils
import { convertTimestamp } from "@/lib/utils/utils";
import { Separator } from "@/components/ui/separator";

// framer animation
import { AnimatePresence, motion } from "motion/react";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);

  const queryClient = useQueryClient();

  const [edittingId, setedittingId] = useState<string | null>(null);

  const {
    data: task,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["task", id],
    queryFn: async () =>
      axios.get(`/api/google/tasks/${id}`).then((res) => res.data),
    enabled: !!id,
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
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
  });

  const handDelete = (tasklistid: string, taskid: string) => {
    toast.promise(deletemutation.mutateAsync({ id: tasklistid, taskid }), {
      loading: "Deleting task...",
      success: "Task deleted successfully!",
      error: (error) => `Error: ${error.message}`,
    });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse  w-full md:max-w-3xl mx-auto">
        <div className="flex items-start justify-between">
          <div className="">
            <h3 className="text-2xl mb-1 font-poppins dark:bg-dark-50 bg-zinc-200 h-4 w-48 rounded-md"></h3>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-gray-500 dark:text-gray-400 text-sm dark:bg-dark-50 bg-zinc-200 h-4 w-16 rounded-md"></p>
              <p className="text-gray-500 dark:text-gray-400 text-sm dark:bg-dark-50 bg-zinc-200 h-4 w-16 rounded-md"></p>
            </div>
          </div>
          {/* actions */}

          <div className="flex items-center gap-x-2 ">
            <div className="dark:bg-dark-50 bg-zinc-200 h-6 w-6 rounded-md"></div>
            <div className="dark:bg-dark-50 bg-zinc-200 h-6 w-6 rounded-md"></div>
          </div>
        </div>

        <div className="dark:bg-dark-50 bg-zinc-200 h-24 w-full rounded-md mt-4"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <div className="flex items-center justify-center flex-col gap-y-2">
          <CloudAlert size={40} className="text-rose-500" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-2 md:px-0 w-full md:max-w-3xl">
      <div className="flex items-start justify-between mb-2">
        <div className="">
          <h3 className="text-xl md:text-2xl mb-1 font-poppins">
            {task?.title}
          </h3>
          <div className="flex items-center gap-x-4 flex-wrap">
            <div className="flex items-center w-full gap-2 flex-wrap">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Status: {task?.status}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Task list: {task?.listTitle}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {task?.completed
                  ? `Completed: ${task?.completed}`
                  : `Due: ${task?.due}`}
              </span>
              <p className="text-gray-500 dark:text-gray-400 text-sm ">
                Created: {convertTimestamp(task?.createdAt)}
              </p>
            </div>
          </div>
        </div>
        {/* actions */}

        <div className="flex items-center gap-x-2">
          <Actiontooltip align="center" label="Edit note" side="bottom">
            <button
              onClick={() => setedittingId(task?.id)}
              className="p-1 transition-colors duration-75 group"
            >
              <Pencil
                size={16}
                className="text-gray-200 group-hover:text-indigo-500 transition-colors duration-75"
              />
            </button>
          </Actiontooltip>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Trash
                size={16}
                className="text-gray-200 group-hover:text-rose-500 transition-colors duration-75 cursor-pointer"
              />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this task and remove its data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => () => handDelete(task?.listId, task?.id)}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <Separator className="mb-2" />
      <div className="">
        <AnimatePresence mode="wait">
          {edittingId ? (
            <motion.div
              key={`edit-${task.id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <EditTaskform
                setEdittingId={setedittingId}
                tasklistid={task?.listId}
                task={{ id: task?.id, title: task?.title, notes: task?.notes }}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`view-${task.id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <p className="text-sm ">{task?.notes}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Page;
