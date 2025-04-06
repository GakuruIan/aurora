"use client";
import React from "react";

// icons
import { Pencil, Trash, CloudAlert } from "lucide-react";

// components
import Actiontooltip from "@/components/Actiontooltip/Actiontooltip";

// modal
import { useModal } from "@/hooks/use-modal-store";

// axios
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// utils
import { convertTimestamp } from "@/lib/utils/utils";
import { Separator } from "@/components/ui/separator";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { onOpen } = useModal();

  const { id } = React.use(params);

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: async () => axios.get(`/api/notes/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  console.log(note);

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
          <h3 className="text-2xl mb-1 font-poppins">{note?.title}</h3>
          <div className="flex items-center gap-x-4 flex-wrap">
            <div className="flex items-center ">
              <span
                className="size-2 rounded-full"
                style={{ background: note?.category?.colorCode }}
              ></span>
              <span
                className="text-sm ml-2"
                style={{ color: note?.category?.colorCode }}
              >
                {note?.category?.name}
              </span>
            </div>

            <p className="text-gray-500 dark:text-gray-400 text-sm ml-2">
              Created at: {convertTimestamp(note?.createdAt)}
            </p>
          </div>
        </div>
        {/* actions */}

        <div className="flex items-center gap-x-2">
          <Actiontooltip align="center" label="Edit note" side="bottom">
            <button
              onClick={() => onOpen("EditNote", { note })}
              className="p-1 transition-colors duration-75 group"
            >
              <Pencil
                size={16}
                className="text-gray-200 group-hover:text-indigo-500 transition-colors duration-75"
              />
            </button>
          </Actiontooltip>
          <Actiontooltip align="center" label="Delete note" side="bottom">
            <button
              onClick={() => onOpen("DeleteNote", { note })}
              className="p-1  transition-colors duration-75 group"
            >
              <Trash
                size={16}
                className="text-gray-200 group-hover:text-rose-500 transition-colors duration-75"
              />
            </button>
          </Actiontooltip>
        </div>
      </div>
      <Separator className="mb-2" />
      <div className="">
        <p className="text-sm mb-2">{note.content}</p>
      </div>
    </div>
  );
};

export default Page;
