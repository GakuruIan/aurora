"use client";
import React from "react";

// modal hook
import { useModal } from "@/hooks/use-modal-store";

// components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

// axios
import axios from "axios";

const DeleteNoteCategory = () => {
  const { isOpen, type, onClose, data } = useModal();

  const isModalOpen = isOpen && type === "DeleteCategory";

  const { category } = data;

  const handleOnClose = () => {
    onClose();
  };

  const queryClient = useQueryClient();

  const mututation = useMutation({
    mutationFn: async () => {
      try {
        const response = await axios.delete(
          `/api/noteCategory/${category?.id}`
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

      toast.success("Note Category deleted successfully");
    },
  });

  const onSubmit = async () => {
    toast.promise(mututation.mutateAsync(), {
      loading: "Deleting note category...",
      success: "Note category deleted successfully",
      error: (error) => `${error}`,
    });
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={handleOnClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            {category?.name} Category and remove it&apos;s data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteNoteCategory;
