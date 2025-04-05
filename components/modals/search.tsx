import React from "react";

// import { debounce } from "lodash";

// icons
import { Search as SearchIcon } from "lucide-react";

import { useMutation } from "@tanstack/react-query";

// form
import { useForm } from "react-hook-form";

import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { useModal } from "@/hooks/use-modal-store";
import { Separator } from "../ui/separator";
import { toast } from "sonner";

// axios
import axios from "axios";
import { TruncateText } from "@/lib/utils/utils";

const Search = () => {
  const { isOpen, type, onClose } = useModal();

  const isModalOpen = isOpen && type === "Search";

  const form = useForm({
    defaultValues: {
      term: "",
    },
  });

  const handleOnClose = () => {
    form.reset();
    onClose();
    mutation.reset();
  };

  const mutation = useMutation({
    mutationFn: async (value: { term: string }) => {
      try {
        const response = await axios.get(`/api/search/`, {
          params: { term: value?.term },
        });
        return response.data;
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "Failed to search the database";
        throw new Error(errorMessage);
      }
    },
    onError: (error) => {
      toast.error("Error", { description: `${error.message}` });
    },
    onSuccess: () => {},
  });

  const onSubmit = async (value: { term: string }) => {
    mutation.mutate(value);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOnClose}>
      <DialogContent className="dark:bg-dark-300 border-0 dark:text-white text-black bg-white">
        <DialogTitle></DialogTitle>
        <Form {...form}>
          <form className="" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="">
              <FormField
                control={form.control}
                name="term"
                render={({ field }) => (
                  <FormItem className="w-full mb-2">
                    <FormLabel htmlFor="term">
                      what are you looking for?
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none"></div>
                        <Input
                          type="text"
                          placeholder="Search for Emails,Notes and task"
                          className="w-full outline-0 bg-light-200 dark:bg-dark-50 dark:text-white  placeholder:text-sm dark:border-0 rounded-sm placeholder:dark:text-gray-400"
                          {...field}
                        />
                        <div className="absolute inset-y-0 end-3 flex items-center ps-3.5 pointer-cursor">
                          <button type="submit">
                            <SearchIcon size={16} />
                          </button>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <div className="">
          <p className="text-sm font-medium mb-1">Search results:</p>
          <Separator />
        </div>

        <div className="">
          <div className="overflow-y-scroll pb-2 no-scrollbar h-auto max-h-72">
            {mutation.isPending ? (
              <div className="flex items-center justify-center min-h-44">
                <p className="text-sm dark:text-gray-400 text-gray-500">
                  Fetching...
                </p>
              </div>
            ) : mutation.data?.length === 0 ? (
              <div className="flex items-center justify-center min-h-44">
                <p className="text-sm dark:text-gray-400 text-gray-500">
                  No search results...
                </p>
              </div>
            ) : (
              mutation.data?.map((item) => (
                <div
                  key={item?.id}
                  className="py-2 hover:cursor-pointer hover:dark:bg-dark-50 hover:bg-gray-200 px-2 mb-1 rounded-sm max-w-[30rem]"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <h1 className="font-medium text-sm">
                      {item?.document.title}
                    </h1>
                    <p className="flex items-center justify-center text-xs px-2 py-0.5 rounded-lg dark:bg-dark-10 bg-gray-200">
                      {item?.document.type}
                    </p>
                  </div>
                  <p className="text-sm font-normal line-clamp-1">
                    {TruncateText(item?.document.content, 10)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Search;
