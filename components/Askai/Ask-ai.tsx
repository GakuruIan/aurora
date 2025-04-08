"use client";
import React, { useState } from "react";

// form
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// icons
import { Sparkles, Copy, Check } from "lucide-react";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";

// components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { AnimatePresence } from "motion/react";

const formSchema = z.object({
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .max(500, "Prompt must be less than 500 characters"),
});

type FormSchema = z.infer<typeof formSchema>;

const Compose = () => {
  const [composed, setComposed] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (value: { prompt: string }) => {
      try {
        const response = await fetch("/api/chat/compose", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: value.prompt,
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

              setComposed(fullText);
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
      setComposed("");
      toast.error("Error", { description: `${error.message}` });
    },
    onSuccess: () => {
      form.resetField("prompt");
    },
  });

  const isLoading = form.formState.isSubmitting;

  // Form submission
  const onSubmit = async (value: FormSchema) => {
    toast.promise(mutation.mutateAsync({ prompt: value.prompt }), {
      loading: "Waiting for response...",
      error: (error) => {
        return error.message;
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-x-0.5 hover:dark:bg-dark-50 hover:bg-gray-300"
          variant="ghost"
        >
          <Sparkles size={16} /> Ask Ai
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Compose Feature</DialogTitle>
          <DialogDescription>
            Ask Ai to compose a message for you.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence>
          {!mutation.data?.reply ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  name="prompt"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-base  font-normal dark:text-white">
                        Prompt
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={isLoading}
                          placeholder="Write a prompt"
                          className="w-full bg-light-200 dark:bg-dark-50 dark:text-white  placeholder:text-sm dark:border-0 rounded-sm placeholder:dark:text-gray-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  Ask AI
                </Button>
              </form>
            </Form>
          ) : (
            <div>
              <Textarea
                rows={8}
                placeholder="response appears here"
                className="w-full no-scrollbar bg-light-200 dark:bg-dark-50 dark:text-white  placeholder:text-sm dark:border-0 rounded-sm placeholder:dark:text-gray-400"
                value={composed}
              />
              <Button
                type="button"
                className="mt-2"
                onClick={() => {
                  navigator.clipboard.writeText(composed);
                  setCopied(true);
                  toast.success("Copied to clipboard");
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default Compose;
