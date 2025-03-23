import React from "react";

// icons
import { CircleAlert } from "lucide-react";

// modal hook
import { useModal } from "@/hooks/use-modal-store";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import { toast } from "sonner";

import { Button } from "../ui/button";

// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// axios
import axios from "axios";

const DeleteNote = () => {
  const { isOpen, type, onClose, data } = useModal();

  const queryClient = useQueryClient();

  const isModalOpen = isOpen && type === "DeleteNote";

  const { note } = data;

  const handleOnClose = () => {
    onClose();
  };

  const mutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await axios.delete(`/api/notes/${note?.id}`);
        return response.data;
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "Failed to delete note";
        throw new Error(errorMessage);
      }
    },
    onError: (error) => {
      toast.error("Error", { description: `${error.message}` });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Notes"] });
      handleOnClose();

      toast.success("Note delete successfully");
    },
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent className="dark:bg-dark-300 border-0 dark:text-white text-black bg-white overflow-hidden">
        <DialogHeader className="py-4 px-6">
          <DialogTitle className="text-center font-poppins tracking-wide mb-1">
            Delete Note
          </DialogTitle>
          <DialogDescription className="text-center font-saira text-base dark:text-gray-400 text-gray-500">
            Are You Sure You Want to Delete {note?.title}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center flex-col space-y-4">
          <CircleAlert size={30} className="text-rose-500" />
          <p className="text-sm text-center dark:text-gray-400 text-gray-500">
            This note will be permanently removed and cannot be restored. If
            you’re sure you no longer need it, confirm your action below.
          </p>
        </div>
        <DialogFooter>
          <Button
            onClick={() => onClose()}
            variant="outline"
            className="hover:dark:bg-white hover:dark:text-gray-700"
          >
            Keep Note
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            variant="destructive"
            className="bg-rose-600 hover:bg-rose-500"
          >
            Delete Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNote;
