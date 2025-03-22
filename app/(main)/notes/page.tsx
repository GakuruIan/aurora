"use client";

import React from "react";

import { Plus } from "lucide-react";

// components
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Actiontooltip from "@/components/Actiontooltip/Actiontooltip";

import NoteCard from "@/components/NoteCard/NoteCard";

// modal hook
import { useModal } from "@/hooks/use-modal-store";

// axios
import axios from "axios";

// inteface
import { Note } from "@/interfaces";

// react query
import { useQuery } from "@tanstack/react-query";

// interface
import { CategoryResponse } from "@/interfaces";

const Page = () => {
  const { onOpen } = useModal();

  const CARDS = [1, 2, 3];

  const {
    data: categories,
    isLoading: loadingCategories,
    error: CategoryError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      axios
        .get<CategoryResponse[]>("/api/noteCategory")
        .then((res) => res.data),
  });

  const {
    data: Notes,
    isLoading: loadingNotes,
    error: NoteError,
  } = useQuery({
    queryKey: ["Notes"],
    queryFn: () => axios.get<Note[]>("/api/notes").then((res) => res.data),
  });

  console.log(Notes);

  return (
    <div>
      {/* notes topbar */}
      <div className="flex items-center justify-between">
        {/* notes category */}

        {loadingCategories ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {CARDS.map((card) => (
                <div key={card} className="animate-pulse">
                  <div className="flex items-center h-6 w-20 dark:bg-dark-50 bg-gray-400 rounded-full"></div>
                </div>
              ))}
            </div>

            {/* create note button */}
            <div className="animate-pulse">
              <div className="flex items-center h-6 w-20 dark:bg-dark-50 bg-gray-400 rounded-full"></div>
            </div>
            {/* create note button */}
          </div>
        ) : (
          <>
            <ScrollArea className="">
              <div className="flex items-center gap-x-2">
                {/* note category */}
                {categories?.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center px-2 py-0.5 border rounded-full"
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ background: category.colorCode }}
                    ></span>
                    <span
                      className="text-sm ml-2"
                      style={{ color: category.colorCode }}
                    >
                      {category.name}
                    </span>
                  </div>
                ))}

                <Actiontooltip
                  align="center"
                  label="Add category"
                  side="bottom"
                >
                  <button
                    onClick={() => onOpen("CreateNoteCategory")}
                    className="flex items-center border rounded-full p-1 hover:bg-gray-200 dark:hover:bg-dark-50 transition-colors duration-75"
                  >
                    <Plus size={16} />
                  </button>
                </Actiontooltip>

                {/* note category */}
              </div>
            </ScrollArea>
            {/* notes category */}

            {/* create note button */}
            <button
              onClick={() => onOpen("CreateNote")}
              className="px-4 py-1.5 flex items-center gap-x-2 bg-indigo-600 hover:bg-indigo-500 transition-colors duration-75 text-white rounded-md"
            >
              <Plus size={16} />
              Create note
            </button>
            {/* create note button */}
          </>
        )}
      </div>
      {/* notes topbar */}

      <Separator className="my-4" />

      {loadingNotes ? (
        <>
          {
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {CARDS.map((card) => (
                  <div
                    key={card}
                    className="h-44 dark:bg-dark-50 bg-gray-400 rounded-md"
                  ></div>
                ))}
              </div>
            </div>
          }
        </>
      ) : (
        <>
          {(Notes ?? []).length > 0 ? (
            <>
              {Notes?.map((note) => (
                <NoteCard
                  title={note.title}
                  key={note.id}
                  content={note.content}
                  date={note.createdAt}
                  color={note.category.colorCode}
                  pinned={true}
                />
              ))}
            </>
          ) : (
            // if no notes are found
            <div className="h-[calc(100vh-12rem)] w-full flex items-center justify-center">
              <div className="flex items-center">
                <p className="text-sm dark:text-gray-400 text-gray-500">
                  No notes found
                </p>
                <Separator orientation="vertical" className="mx-2 h-6" />
                <p className="text-sm dark:text-gray-400 text-gray-500">
                  Create new notes to get started
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Page;
