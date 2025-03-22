import React from "react";

interface NoteCardProps {
  title: string;
  content: string;
  //   category: string;
  color?: string;
  date: string;
  pinned?: boolean;
}
// icons
import { Pin, PinOff, Trash, Pencil } from "lucide-react";

// components
import Actiontooltip from "@/components/Actiontooltip/Actiontooltip";

const NoteCard: React.FC<NoteCardProps> = ({
  title,
  content,
  color,
  date,
  pinned,
}) => {
  return (
    <div
      className={`relative rounded-md px-2 py-2 md:max-w-80`}
      style={{ background: color }}
    >
      <div className="mb-2 flex items-center justify-end">
        <div className="">
          {pinned ? (
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
      <h1 className="text-xl font-poppins mb-2">{title}</h1>
      <p className="text-sm text-gray-200 mb-4">{content}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-200">{date}</span>
        <div className="flex items-center gap-x-2">
          <Actiontooltip align="center" label="Edit note" side="bottom">
            <button className="p-1 transition-colors duration-75">
              <Pencil size={18} className="text-gray-200" />
            </button>
          </Actiontooltip>
          <Actiontooltip align="center" label="Delete note" side="bottom">
            <button className="p-1  transition-colors duration-75">
              <Trash size={18} className="text-gray-200" />
            </button>
          </Actiontooltip>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
