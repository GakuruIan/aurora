import React from "react";

import type { Editor } from "@tiptap/react";

type props = {
  editor: Editor;
};

// icons
import {
  Bold,
  Code,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Redo,
  Undo,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EmailMenuBar: React.FC<props> = ({ editor }) => {
  return (
    <div className="flex items-center flex-wrap gap-2">
      <button
        className={cn(
          "p-1 rounded-sm",
          editor.isActive("bold") && "bg-indigo-600 text-white"
        )}
        disabled={!editor.can().chain().focus().run()}
        onClick={() => {
          editor.chain().focus().toggleBold().run();
        }}
      >
        <Bold size={18} />
      </button>

      {/* code */}
      <button
        className={cn(
          "p-1 rounded-sm",
          editor.isActive("code") && "bg-indigo-600 text-white"
        )}
        disabled={!editor.can().chain().focus().run()}
        onClick={() => {
          editor.chain().focus().toggleCode().run();
        }}
      >
        <Code size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn(
          "p-1 rounded-sm",
          editor.isActive("italic") && "bg-indigo-600 text-white"
        )}
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => {
          editor.chain().focus().toggleStrike().run();
        }}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={cn(
          "p-1 rounded-sm",
          editor.isActive("strike") && "bg-indigo-600 text-white"
        )}
      >
        <Strikethrough size={18} />
      </button>

      <button
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
        className={cn(
          "p-1 rounded-sm",
          editor.isActive("heading", { level: 1 }) && "bg-indigo-600 text-white"
        )}
      >
        <Heading1 size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(
          "p-1 rounded-sm",
          editor.isActive("heading", { level: 2 }) && "bg-indigo-600 text-white"
        )}
      >
        <Heading2 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn(
          "p-1 rounded-sm",
          editor.isActive("heading", { level: 3 }) && "bg-indigo-600 text-white"
        )}
      >
        <Heading3 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={cn(
          "p-1 rounded-sm",
          editor.isActive("heading", { level: 4 }) && "bg-indigo-600 text-white"
        )}
      >
        <Heading4 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={cn(
          "p-1 rounded-sm",
          editor.isActive("heading", { level: 5 }) && "bg-indigo-600 text-white"
        )}
      >
        <Heading5 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={cn(
          "p-1 rounded-sm",
          editor.isActive("heading", { level: 6 }) && "bg-indigo-600 text-white"
        )}
      >
        <Heading6 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "p-1 rounded-sm",
          editor.isActive("bulletList") && "bg-indigo-600 text-white"
        )}
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          "p-1 rounded-sm",
          editor.isActive("orderedList") && "bg-indigo-600 text-white"
        )}
      >
        <ListOrdered size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cn(
          "p-1 rounded-sm",
          editor.isActive("blockquote") && "bg-indigo-600 text-white"
        )}
      >
        <Quote size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo size={18} />
      </button>
    </div>
  );
};

export default EmailMenuBar;
