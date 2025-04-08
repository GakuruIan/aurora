"use client";

import React from "react";

import { Pencil, Plus, Trash } from "lucide-react";

// components
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Actiontooltip from "@/components/Actiontooltip/Actiontooltip";

import NoteCard from "@/components/NoteCard/NoteCard";
import Error from "@/components/Error/Error";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

// modal hook
import { useModal } from "@/hooks/use-modal-store";

// axios
import axios from "axios";

// react query
import { useQuery } from "@tanstack/react-query";

// interface
import { CategoryResponse, Note } from "@/interfaces";

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

  if (NoteError) {
    return <Error error={NoteError.message} />;
  }

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
                <Menubar className="border-0">
                  {categories?.map((category) => (
                    <MenubarMenu key={category.id}>
                      <MenubarTrigger>
                        <div className="flex items-center px-2 py-0.5 border rounded-full">
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
                      </MenubarTrigger>
                      <MenubarContent className="dark:bg-dark-50 ">
                        <MenubarItem
                          onSelect={() => onOpen("EditCategory", { category })}
                          className="hover:bg-gray-200 dark:hover:bg-dark-20"
                        >
                          <div className="flex items-center ">
                            <Pencil size={16} className="mr-2" /> Edit category
                          </div>
                        </MenubarItem>
                        <MenubarSeparator className="bg-zinc-400 dark:bg-dark-20" />
                        <MenubarItem
                          onSelect={() =>
                            onOpen("DeleteCategory", { category })
                          }
                          className="hover:bg-gray-200 dark:hover:bg-dark-20"
                        >
                          <div className="flex items-center ">
                            <Trash size={16} className="mr-2" /> Delete category
                          </div>
                        </MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                  ))}
                </Menubar>

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {Notes?.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
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
