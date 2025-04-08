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
import TagInput from "../TagInput/Taginput";
import { Input } from "../ui/input";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type EmailEditorProps = {
  toValues: { label: string; value: string }[];
  ccValues: { label: string; value: string }[];

  subject: string;
  setSubject: (subject: string) => void;
  to: string[];
  handleSend: (value: string) => void;
  isSending: boolean;

  onToChange: (values: { label: string; value: string }[]) => void;
  onCcChange: (values: { label: string; value: string }[]) => void;

  defaultToolbarExpand?: boolean;
};

const EmailEditor = ({
  toValues,
  ccValues,
  subject,
  setSubject,
  to,
  handleSend,
  isSending,
  onToChange,
  onCcChange,
  defaultToolbarExpand,
}: EmailEditorProps) => {
  const [value, setValue] = useState("");

  const [expanded, setExpanded] = React.useState(defaultToolbarExpand ?? false);

  const { data: suggestions } = useQuery({
    queryKey: ["email-suggestions"],
    queryFn: async () => {
      const { data } = await axios.get("/api/google/emails/suggestions");
      return data;
    },
  });

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

      <div className="px-4 py-2">
        <div className="">
          {expanded && (
            <div>
              <TagInput
                label="To:"
                suggestions={suggestions}
                onChange={onToChange}
                value={toValues}
                placeholder="Add recipients"
              />
              <TagInput
                label="Cc:"
                suggestions={suggestions}
                onChange={onCcChange}
                value={ccValues}
                placeholder="Add recipients"
              />
              <Input
                placeholder="Subject"
                value={subject}
                className="py-2"
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div
            className="cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            <span className="text-green-600 font-medium">Draft: {""}</span>
            <span className="text-gray-500 dark:text-gray-400">
              To {to.join(", ")}
            </span>
          </div>
        </div>
      </div>

      <div className="prose w-full max-w-[22rem] md:max-w-[34rem] p-2 md:p-4 ">
        <EditorContent editor={editor} value={value} className="prose" />
      </div>

      <Separator />

      <div className="flex items-center justify-between py-3 px-4">
        <p className="text-sm dark:text-gray-400 text-gray-500">
          Tip press{" "}
          <kbd className="text-xs mx-1 px-2 py-1 rounded-sm dark:bg-dark-10 bg-zinc-200">
            ctrl + j
          </kbd>{" "}
          to autocomplete
        </p>
        <Button
          onClick={async () => {
            editor?.commands.clearContent();
            await handleSend(value);
          }}
          disabled={isSending}
        >
          Send <Send size={16} />{" "}
        </Button>
      </div>
    </>
  );
};

export default EmailEditor;
