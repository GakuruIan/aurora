"use client";

import React, { useState } from "react";

// editor components
import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import { Text } from "@tiptap/extension-text";

// utils
import { cn } from "@/lib/utils";

import EmailMenuBar from "./EmailMenuBar";

// ui components
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Send } from "lucide-react";

const EmailEditor = () => {
  const [value, setValue] = useState("");

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Meta-j": () => {
          console.log("meta-j");
          return true;
        },
      };
    },
  });
  const editor = useEditor({
    autofocus: false,
    extensions: [StarterKit, customText],
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn("prose max-w-none [&_ol]:list-decimal [&_ul]:list-disc"),
      },
    },
  });

  if (!editor) return null;

  return (
    <>
      <div className="p-4 py-2 ">
        <EmailMenuBar editor={editor} />
        <Separator className="mt-2" />
      </div>
      <div className="prose w-full max-w-[22rem] md:max-w-[34rem] p-2 md:p-4 ">
        <EditorContent editor={editor} value={value} className="prose" />
      </div>

      <Separator />

      <div className="flex items-center justify-between py-3 px-4">
        <p className="text-sm dark:text-gray-400 text-gray-500">
          Tip press{" "}
          <kbd className="text-xs mx-1 px-2 py-1 rounded-sm dark:bg-dark-10 bg-gray-500">
            ctrl + j
          </kbd>{" "}
          to autocomplete
        </p>
        <Button>
          Send <Send size={16} />{" "}
        </Button>
      </div>
    </>
  );
};

export default EmailEditor;
