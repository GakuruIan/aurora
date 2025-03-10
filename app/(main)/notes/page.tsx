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

const Page = () => {
  const { onOpen } = useModal();

  const notes = [
    {
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis voluptates illo laborum! Debitis, officiis placeat aliquam perferendis deleniti, nisi vel quo error delectus ad repudiandae incidunt cum, culpa sequi labore.",
      color: "custom-personal",
      date: "25/2/2025",
      pinned: true,
    },
    {
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis voluptates illo laborum! Debitis, officiis placeat aliquam perferendis deleniti, nisi vel quo error delectus ad repudiandae incidunt cum, culpa sequi labore.",
      color: "indigo-600",
      date: "25/2/2025",
      pinned: true,
    },
    {
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis voluptates illo laborum! Debitis, officiis placeat aliquam perferendis deleniti, nisi vel quo error delectus ad repudiandae incidunt cum, culpa sequi labore.",
      color: "rose-500",
      date: "25/2/2025",
      pinned: true,
    },
  ];
  return (
    <div>
      {/* notes topbar */}
      <div className="flex items-center justify-between">
        {/* notes category */}

        <ScrollArea className="">
          <div className="flex items-center gap-x-2">
            {/* note category */}
            <div className="flex items-center px-2 py-0.5 border rounded-full">
              <span className="bg-custom-personal size-2 rounded-full"></span>
              <span className="text-sm ml-2 text-custom-personal">
                Personal
              </span>
            </div>
            {/* note category */}
            {/* note category */}
            <div className="flex items-center px-2 py-0.5 border rounded-full">
              <span className="bg-custom-work size-2 rounded-full"></span>
              <span className="text-sm ml-2 text-custom-work">Work</span>
            </div>
            {/* note category */}
            {/* note category */}
            <div className="flex items-center px-2 py-0.5 border rounded-full">
              <span className="bg-rose-500 size-2 rounded-full"></span>
              <span className="text-sm ml-2 text-rose-500">Meeting</span>
            </div>
            {/* note category */}

            <Actiontooltip align="center" label="Add category" side="bottom">
              <button
                onClick={() => onOpen("CreateNoteCategory")}
                className="flex items-center border rounded-full p-1 hover:bg-gray-200 dark:hover:bg-dark-50 transition-colors duration-75"
              >
                <Plus size={16} />
              </button>
            </Actiontooltip>
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
      </div>
      {/* notes topbar */}
      <Separator className="my-4" />
      {/* notes list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* note */}
        {notes.map((note, index) => {
          return (
            <NoteCard
              key={index}
              content={note.content}
              date={note.date}
              color={note.color}
              pinned={true}
            />
          );
        })}
        {/* note */}
      </div>
    </div>
  );
};

export default Page;
