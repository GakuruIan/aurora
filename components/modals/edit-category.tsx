"use client";
import React, { useEffect } from "react";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// modal hook
import { useModal } from "@/hooks/use-modal-store";

// components
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

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { Input } from "@/components/ui/input";

import Button from "../Button/Button";

//color picker
import { CirclePicker } from "react-color";

// axios
import axios from "axios";

const formSchema = z.object({
  name: z.string().min(5, {
    message: "Category name must be at least 5 characters.",
  }),
  colorCode: z.string().min(1, {
    message: "You need to select a category type.",
  }),
});

const EditNoteCategory = () => {
  const { isOpen, type, onClose, data } = useModal();

  const isModalOpen = isOpen && type === "EditCategory";

  const { category } = data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      colorCode: "",
    },
  });

  useEffect(() => {
    if (category && isModalOpen) {
      form.setValue("name", category?.name);
      form.setValue("colorCode", category?.colorCode);
    }
  }, [category, form, isModalOpen]);

  const handleOnClose = () => {
    form.reset();
    onClose();
  };

  const queryClient = useQueryClient();

  const mututation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      try {
        const response = await axios.patch(
          `/api/noteCategory/${category?.id}`,
          values
        );
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
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      handleOnClose();

      toast.success("Note Category created successfully");
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.promise(mututation.mutateAsync(values), {
      loading: "Updating note category...",
      success: "Note category updated successfully",
      error: (error) => `${error}`,
    });
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOnClose}>
      <DialogContent className="dark:bg-dark-300 border-0 dark:text-white text-black bg-white overflow-hidden">
        <DialogHeader className="py-4 px-6">
          <DialogTitle className="text-center font-poppins font-medium tracking-wide mb-1 dark:text-white text-gray-600">
            Edit note category
          </DialogTitle>
          <DialogDescription className="text-center font-barlow text-sm dark:text-gray-400 text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum,
            aliquid?
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem className="w-full mb-4">
                    <FormLabel htmlFor="note">Category name</FormLabel>
                    <FormControl>
                      <Input
                        className="resize-none placeholder:text-sm placeholder:dark:text-gray-400 placeholder:text-gray-400 bg-light-200 tracking-wider font-saira dark:bg-dark-50 dark:text-white  border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        id="note"
                        {...field}
                        placeholder="Enter category name"
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colorCode"
                render={({ field, fieldState }) => (
                  <FormItem className="w-full mb-6">
                    <FormLabel htmlFor="note">
                      Select a theme for your category
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-col space-y-2">
                        <CirclePicker
                          circleSize={18}
                          circleSpacing={10}
                          color={field.value}
                          onChangeComplete={(color) =>
                            field.onChange(color.hex)
                          }
                        />

                        <Input
                          className="resize-none placeholder:text-sm placeholder:dark:text-gray-400 placeholder:text-gray-400 bg-light-200 tracking-wider font-saira dark:bg-dark-50 dark:text-white  border-0 focus-visible:ring-0 focus-visible:ring-offset-0 mt-2 font-barlow"
                          id="note"
                          {...field}
                          value={field.value}
                          readOnly
                          placeholder="Selected color code appears here"
                        />
                      </div>
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                isLoading={isLoading}
                loadingText="Submitting..."
                type="submit"
                label="Update note category"
                style="bg-indigo-600 hover:bg-indigo-500 text-white"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditNoteCategory;
