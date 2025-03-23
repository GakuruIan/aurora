"use client";
import React, { useEffect } from "react";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// modal hook
import { useModal } from "@/hooks/use-modal-store";

//interface
import { CategoryResponse } from "@/interfaces";

// components
import { Input } from "../ui/input";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { toast } from "sonner";

import Button from "../Button/Button";

// react query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// axios
import axios from "axios";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Note title is required",
  }),
  content: z.string().min(5, {
    message: "Note must be at least 5 characters.",
  }),
  categoryId: z.string().min(5, {
    message: "Select a category for your note",
  }),
});

//types
type FormValues = z.infer<typeof formSchema>;

const EditNote = () => {
  const { isOpen, type, onClose, data } = useModal();

  const queryClient = useQueryClient();

  const isModalOpen = isOpen && type === "EditNote";

  const { note } = data;

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      axios
        .get<CategoryResponse[]>("/api/noteCategory")
        .then((res) => res.data),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      title: "",
      categoryId: "",
    },
  });

  useEffect(() => {
    if (note && isModalOpen) {
      form.setValue("title", note?.title);
      form.setValue("content", note?.content);
      form.setValue("categoryId", note?.categoryId);
    }
  }, [note, form, isModalOpen]);

  const isLoading = form.formState.isSubmitting;

  const handleOnClose = () => {
    form.reset();
    onClose();
  };

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      try {
        const response = await axios.patch(`/api/notes/${note?.id}`, values);
        return response.data;
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "Failed to update note";
        throw new Error(errorMessage);
      }
    },
    onError: (error) => {
      toast.error("Error", { description: `${error.message}` });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Notes"] });
      handleOnClose();

      toast.success("Note updated successfully");
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOnClose}>
      <DialogContent className="dark:bg-dark-300 border-0 dark:text-white text-black bg-white overflow-hidden">
        <DialogHeader className="py-4 px-6">
          <DialogTitle className="text-center font-poppins tracking-wide mb-1">
            Edit note
          </DialogTitle>
          <DialogDescription className="text-center font-saira text-base dark:text-gray-400 text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum,
            aliquid?
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
                    <FormLabel htmlFor="note">Note title</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="note title"
                        disabled={isLoading}
                        className="w-full outline-0 bg-light-200 dark:bg-dark-50 dark:text-white  placeholder:text-sm dark:border-0 rounded-sm placeholder:dark:text-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <div className="">
              <FormField
                control={form.control}
                name="content"
                render={({ field, fieldState }) => (
                  <FormItem className="w-full mb-4">
                    <FormLabel htmlFor="note">Your Note</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={8}
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

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field, fieldState }) => (
                  <FormItem className="w-full mb-4">
                    <FormLabel htmlFor="note">Note Category</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex  space-x-1"
                      >
                        {categories?.map((category) => (
                          <FormItem
                            key={category.id}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={category.id} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {category.name}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                loadingText="Updating note..."
                isLoading={isLoading}
                type="submit"
                label="Update note"
                style="bg-indigo-600 hover:bg-indigo-500 text-white"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditNote;
