import React from "react";

interface Task {
  id: string;
  title: string;
  notes: string;
}

interface prop {
  tasklistid: string;
  task: Task;
  setEdittingId: React.Dispatch<React.SetStateAction<string | null>>;
}

// mutations
import { useUpdateTask } from "@/hooks/mutations/tasks";

// icons
import { CalendarIcon } from "lucide-react";

// zod
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
// components
import { Calendar } from "@/components/ui/calendar";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

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

const EditTaskform: React.FC<prop> = ({ tasklistid, task, setEdittingId }) => {
  const updateTask = useUpdateTask();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task.title,
      notes: task.notes,
      due: null,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast.promise(
      updateTask.mutateAsync({ tasklistid, taskid: task.id, values }),
      {
        loading: "Updating task..",
        success: "Task updated successfully",
        error: "Task updating failed",
      }
    );
    setEdittingId(null);
  };

  return (
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
          <Button
            onClick={() => setEdittingId(null)}
            variant="destructive"
            type="button"
            className="mr-2"
          >
            Cancel
          </Button>
          <Button type="submit" className="">
            Update task
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditTaskform;
