"use client";
import { useState } from "react";

import { AnimatePresence, motion } from "motion/react";

// form
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// tanstack
import { useMutation } from "@tanstack/react-query";

// axios
import axios from "axios";

// icons
import { Send } from "lucide-react";

// components
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "../ui/sheet";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

// chat hooks
import { useChatStore } from "@/hooks/use-chat-store";
import { ScrollArea } from "../ui/scroll-area";

// util
import { cn } from "@/lib/utils";

const formSchema = z.object({
  prompt: z
    .string()
    .min(1, "prompt is required")
    .max(1000, "Prompt cannot exceed 1000 characters"),
});

type FormSchema = z.infer<typeof formSchema>;

const ChatSheet = () => {
  const { isOpen, closeChat } = useChatStore();
  const [history, setHistory] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    { role: "assistant", content: "Hello! How can I assist you today?" }, // Default assistant message
  ]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const mutation = useMutation({
    mutationFn: async (value: {
      prompt: string;
      history: { role: string; content: string }[];
    }) => {
      try {
        // Add a temporary placeholder for the assistant's response
        setHistory((prev) => [...prev, { role: "assistant", content: "" }]);

        const response = await fetch("/api/chat/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: value.prompt,
            messages: value.history,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Error ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("Failed to get response reader");

        const decoder = new TextDecoder();
        let fullText = "";

        // Process the stream
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          // Decode the chunk
          const chunk = decoder.decode(value, { stream: true });

          // Parse SSE format
          const lines = chunk.split("\n\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const content = line.substring(6);
              fullText += content;

              setHistory((prev) => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = {
                  role: "assistant",
                  content: fullText,
                };
                return newHistory;
              });
            }
          }
        }

        return { reply: fullText };
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : error instanceof Error
            ? error.message
            : "An error occurred";
        throw new Error(errorMessage);
      }
    },
    onError: (error) => {
      // Remove the assistant's message if there was an error
      setHistory((prev) => prev.slice(0, -1));
      toast.error("Error", { description: `${error.message}` });
    },
    onSuccess: () => {
      form.resetField("prompt");
    },
  });

  // Form submission
  const onSubmit = async (value: FormSchema) => {
    const newHistory = [...history, { role: "user", content: value.prompt }];

    // Update local state first
    setHistory(newHistory);

    mutation.mutate({ prompt: value.prompt, history: newHistory });

    form.reset();
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeChat}>
      <SheetContent side="right">
        <SheetTitle className="text-center my-2">Aurora Quick chat</SheetTitle>
        <SheetDescription className="dark:text-gray-400 text-gray-500 text-sm">
          Quick chats, smart replies—always here when you need me. Just ask!
        </SheetDescription>

        <div className="py-4 overflow-y-scroll h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)] no-scrollbar">
          <AnimatePresence mode="wait">
            {history.map((message, index) => (
              <motion.div
                key={index}
                layout="position"
                layoutId={`container-[${history.length - 1}]`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  ease: "easeInOut",
                  duration: 0.3,
                }}
                className="flex items-start gap-2 mb-2"
              >
                <div
                  className={cn(
                    "flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 ",
                    message.role === "user"
                      ? "rounded-s-xl rounded-se-xl bg-gray-100  dark:bg-dark-50"
                      : "rounded-e-xl rounded-es-xl bg-indigo-500 text-white"
                  )}
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse"></div>
                  <p className="text-sm max-w-[320px] font-normal py-2.5 text-gray-900 dark:text-white">
                    {message.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="prompt"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center w-full gap-x-1.5">
                      <Input
                        type="text"
                        className="flex-1 w-full"
                        placeholder="Ask anything about your emails, tasks and notes"
                        disabled={isLoading}
                        {...field}
                      />
                      <Button>
                        <Send size={18} />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default ChatSheet;
