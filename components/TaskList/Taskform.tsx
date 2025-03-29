"use client";

import React from "react";

interface prop {
  id: string;
}

// icons
import { CalendarIcon, CirclePlus } from "lucide-react";

// zod
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// utils
import { cn } from "@/lib/utils";
import { format } from "date-fns";
// components
import { Calendar } from "../ui/calendar";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "../ui/button";

import { toast } from "sonner";

// axios
import axios from "axios";

const formSchema = z.object({
  due: z
    .date()
    .optional()
    .nullable()
    .refine((date) => !date || date >= new Date(), {
      message: "Due date cannot be in the past",
    }),
  title: z
    .string()
    .min(1, "title is required")
    .max(100, "Title must be under 100 characters")
    .trim(),
  notes: z
    .string()
    .max(500, "Notes must be under 500 characters")
    .trim()
    .optional(),
});

const Taskform: React.FC<prop> = ({ id }) => {
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      notes: "",
      due: null,
    },
  });

  const queryClient = useQueryClient();

  const isSubmitting = form.formState.isSubmitting;

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      try {
        const response = await axios.post(
          `/api/google/tasks/tasklist/${id}`,
          values
        );
        form.reset();
        return response.data;
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "Failed to create task";
        throw new Error(errorMessage);
      }
    },
    onError: (error) => {
      toast.error("Error", { description: `${error.message}` });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasklist"] });
      toast.success("Task added successfully");
      setOpen(false);
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="flex items-center gap-x-1 py-1 dark:text-white hover:dark:text-gray-300 hover:text-gray-50 text-gray-600">
          <CirclePlus size={16} className="mr-1" />
          <p>Add Task</p>
        </div>
      </DialogTrigger>
      <DialogContent className="dark:bg-dark-300 border-0 dark:text-white text-black bg-white overflow-hidden">
        <DialogHeader className="py-4 px-6">
          <DialogTitle className="text-center font-poppins tracking-wide mb-1">
            Create task
          </DialogTitle>
          <DialogDescription className="text-center font-saira text-base dark:text-gray-400 text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum,
            aliquid?
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <FormItem className="w-full mb-4">
                    <FormLabel htmlFor="note">Task title</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="task title"
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

            <div className="mb-2">
              <FormField
                control={form.control}
                name="notes"
                render={({ field, fieldState }) => (
                  <FormItem className="w-full mb-4">
                    <FormLabel htmlFor="note">Task note</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        className="resize-none placeholder:text-sm placeholder:dark:text-gray-400 placeholder:text-gray-400 bg-light-200 tracking-wider font-saira dark:bg-dark-50 dark:text-white  border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        id="note"
                        {...field}
                        placeholder="Enter your note here..."
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-3">
              <FormField
                control={form.control}
                name="due"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[300px] border border-gray-500 dark:border-dark-20 hover:bg-gray-200 hover:dark:bg-dark-20 pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center justify-end mt-2">
              <Button disabled={isSubmitting}>Create task</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default Taskform;
