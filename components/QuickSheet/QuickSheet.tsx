"use client";
import { useState } from "react";

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
        const response = await axios.post(`/api/chat/`, {
          prompt: value.prompt,
          messages: value.history,
        });
        return response.data;
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "An error occurred";
        throw new Error(errorMessage);
      }
    },
    onError: (error) => {
      toast.error("Error", { description: `${error.message}` });
    },
    onSuccess: (response, variables) => {
      setHistory([
        ...variables.history,
        { role: "assistant", content: response.reply },
      ]);
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

        <ScrollArea className="py-4 min-h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)]">
          <div className="flex items-start gap-2">
            <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-dark-50">
              <div className="flex items-center space-x-2 rtl:space-x-reverse"></div>
              <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                awesome. I think our users will really appreciate the
                improvements.
              </p>
            </div>
          </div>
        </ScrollArea>

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
