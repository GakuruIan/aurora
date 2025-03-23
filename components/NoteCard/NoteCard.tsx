"use client";

import React from "react";

import { NotesWithCategory } from "@/types";

interface NoteProps {
  note: NotesWithCategory;
}
// icons
import { Pin, PinOff, Trash, Pencil, Eye } from "lucide-react";

// components
import Actiontooltip from "@/components/Actiontooltip/Actiontooltip";
import { ScrollArea } from "../ui/scroll-area";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// utils functions
import { convertTimestamp, TruncateText } from "@/lib/utils/utils";

// modal
import { useModal } from "@/hooks/use-modal-store";

const NoteCard: React.FC<NoteProps> = ({ note }) => {
  const { onOpen } = useModal();

  return (
    <div
      className={`relative rounded-md px-2 py-2 md:w-full md:max-w-96`}
      style={{ background: note.category.colorCode }}
    >
      <div className="mb-2 flex items-center justify-end">
        <div className="">
          {/* TODO:  added pinned function to note */}
          {false ? (
            <Actiontooltip align="center" label="Pin note" side="bottom">
              <button className="p-1  transition-colors duration-75">
                <Pin size={18} className="text-gray-200" />
              </button>
            </Actiontooltip>
          ) : (
            <Actiontooltip align="center" label="Pin note" side="bottom">
              <button className="p-1  transition-colors duration-75">
                <PinOff size={18} className="text-gray-200" />
              </button>
            </Actiontooltip>
          )}
        </div>
      </div>
      <h1 className="text-xl font-poppins mb-2">{note.title}</h1>
      <p className="text-sm text-gray-200 mb-4">{TruncateText(note.content)}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-200">
          {convertTimestamp(note.createdAt)}
        </span>
        <div className="flex items-center gap-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-1 transition-colors duration-75">
                <Eye size={16} className="text-gray-200" />
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{note.title}</SheetTitle>
                <SheetDescription className="flex items-center justify-between">
                  <p className="text-sm">
                    Created at {convertTimestamp(note.createdAt)}
                  </p>
                  <div
                    key={note.category.id}
                    className="flex items-center px-2 py-0.5 border rounded-full"
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ background: note.category.colorCode }}
                    ></span>
                    <span
                      className="text-sm ml-2"
                      style={{ color: note.category.colorCode }}
                    >
                      {note.category.name}
                    </span>
                  </div>
                </SheetDescription>
              </SheetHeader>

              <ScrollArea>
                <div className="my-4">
                  <p className="text-gray-500 dark:text-gray-400">
                    {note.content}
                  </p>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <Actiontooltip align="center" label="Edit note" side="bottom">
            <button
              onClick={() => onOpen("EditNote", { note })}
              className="p-1 transition-colors duration-75"
            >
              <Pencil size={16} className="text-gray-200" />
            </button>
          </Actiontooltip>
          <Actiontooltip align="center" label="Delete note" side="bottom">
            <button
              onClick={() => onOpen("DeleteNote", { note })}
              className="p-1  transition-colors duration-75"
            >
              <Trash size={16} className="text-gray-200" />
            </button>
          </Actiontooltip>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
