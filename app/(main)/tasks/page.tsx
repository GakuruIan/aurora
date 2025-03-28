"use client";
import React from "react";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// components
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// toast
import { toast } from "sonner";

// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// axios
import axios from "axios";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Note title is required",
  }),
});

//form types
type FormValues = z.infer<typeof formSchema>;

// import { DataTable } from "./data-table";

// //
// import { columns } from "./columns";

// // dummy data
// import { tasks } from "@/data/data";

import KanbanBoard from "@/components/Kanban/Board";

const Page = () => {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      try {
        const response = await axios.post("/api/google/tasks/tasklist", values);
        form.reset();
        return response.data;
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "Failed to create tasklist";
        throw new Error(errorMessage);
      }
    },
    onError: (error) => {
      toast.error("Error", { description: `${error.message}` });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasklist"] });

      toast.success("TaskList added successfully");
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <div>
      <div className="flex items-center justify-between w-full mb-2">
        <h6 className="text-base font-poppins mb-2">Tasks</h6>

        {/* modal to create task list */}

        <Dialog>
          <DialogTrigger asChild>
            <Button>Create new list</Button>
          </DialogTrigger>
          <DialogContent className="dark:bg-dark-300 border-0 dark:text-white text-black bg-white overflow-hidden">
            <DialogHeader className="py-4 px-6">
              <DialogTitle className="text-center font-poppins tracking-wide mb-1">
                Create new list
              </DialogTitle>
              <DialogDescription className="text-center font-saira text-base dark:text-gray-400 text-gray-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Laborum, aliquid?
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form className="" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mb-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field, fieldState }) => (
                      <FormItem className="w-full mb-4">
                        <FormLabel htmlFor="note">Tasklist title</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="note title"
                            disabled={isSubmitting}
                            className="w-full outline-0 bg-light-200 dark:bg-dark-50 dark:text-white  placeholder:text-sm dark:border-0 rounded-sm placeholder:dark:text-gray-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center gap-x-4 justify-end">
                  <DialogClose asChild>
                    <Button type="button" variant="destructive">
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button>Create</Button>
                </div>

                <DialogFooter></DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        {/* modal to create task list */}
      </div>
      <Separator />
      <div className="mt-4">
        {/* <DataTable columns={columns} data={tasks} /> */}

        <KanbanBoard />
      </div>
    </div>
  );
};

export default Page;
