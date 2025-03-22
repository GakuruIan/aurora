"use client";
import React from "react";

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

import { toast } from "sonner";

import { Input } from "@/components/ui/input";

import Button from "../Button/Button";

//color picker
import { CirclePicker } from "react-color";

// axios
import axios from "axios";

const formSchema = z.object({
  name: z.string().min(5, {
    message: "Username must be at least 5 characters.",
  }),
  colorCode: z.string().min(1, {
    message: "You need to select a category type.",
  }),
});

const CreateNoteCategory = () => {
  const { isOpen, type, onClose } = useModal();

  const isModalOpen = isOpen && type === "CreateNoteCategory";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      colorCode: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await axios
      .post("/api/noteCategory", values)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Note Category created successfully");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error", {
          description: "An error has occurred. Please try again later",
        });
      })
      .finally(() => {
        form.reset();
        onClose();
      });
  };

  const handleOnClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOnClose}>
      <DialogContent className="dark:bg-dark-300 border-0 dark:text-white text-black bg-white overflow-hidden">
        <DialogHeader className="py-4 px-6">
          <DialogTitle className="text-center font-poppins font-medium tracking-wide mb-1 dark:text-white text-gray-600">
            Create note category
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
                    <FormLabel htmlFor="note">Category</FormLabel>
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
                label="Create note"
                style="bg-indigo-600 hover:bg-indigo-500 text-white"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteCategory;
