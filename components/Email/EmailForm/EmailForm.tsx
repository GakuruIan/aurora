"use client";

import React, { useState } from "react";

interface props {
  to?: string;
}

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { toast } from "sonner";

// motion
import { AnimatePresence, motion } from "motion/react";

// form
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// icons
import { Plus, X } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const optionalEmail = z
  .string()
  .trim()
  .optional()
  .refine((val) => !val || z.string().email().safeParse(val).success, {
    message: "Invalid email, Please enter a valid Email",
  });

const formSchema = z.object({
  content: z.string().min(1, {
    message: "Email content is required",
  }),
  to: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email, Please enter a valid Email"),
  subject: z.string().min(1, {
    message: "Subject is required",
  }),
  cc: optionalEmail,
  bcc: optionalEmail,
  attachment: z
    .any()
    .refine((file) => !file || file instanceof File, {
      message: "Invalid file",
    })
    .refine(
      (file) =>
        !file ||
        [
          "application/pdf",
          "image/png",
          "image/jpeg",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type),
      { message: "Only PDF, PNG, or JPEG files are allowed" }
    )
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "File must be 5MB or smaller",
    }),
});

const ReplyForm: React.FC<props> = ({ to }) => {
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await axios.post("/api/google/emails/send", {
        ...values,
      });
      return response.data;
    },
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      cc: "",
      to: to || "",
      subject: "",
      bcc: "",
      attachment: null,
    },
  });

  const onsubmit = async (values: z.infer<typeof formSchema>) => {
    toast.promise(mutation.mutateAsync(values), {
      loading: "Sending email...",
      success: () => {
        form.reset();
        setShowCc(false);
        setShowBcc(false);
        return "Email sent successfully";
      },
      error: (err) => {
        console.log(err);
        return err.response?.data?.message || "Failed to send email";
      },
    });
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onsubmit)}>
        <div className="flex items-center justify-end gap-x-2">
          <Button
            variant={"outline"}
            className="hover:bg-zinc-200 dark:hover:bg-dark-50 border border-zinc-200 dark:border-dark-50"
            type="button"
            onClick={() => {
              setShowCc((prev) => !prev);
            }}
          >
            <Plus size={16} />
            CC
          </Button>
          <Button
            variant={"outline"}
            className="hover:bg-zinc-200 dark:hover:bg-dark-50 border border-zinc-200 dark:border-dark-50"
            type="button"
            onClick={() => {
              setShowBcc((prev) => !prev);
            }}
          >
            <Plus size={16} />
            BCC
          </Button>
        </div>
        <div className="mb-2">
          <FormField
            name="to"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    className="mt-2"
                    placeholder="To"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {showCc && (
          <AnimatePresence>
            <motion.div
              key="cc-input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="mb-2"
            >
              <FormField
                name="cc"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none"></div>
                        <Input
                          type="email"
                          placeholder="CC"
                          disabled={isLoading}
                          {...field}
                        />
                        <div className="absolute inset-y-0 end-3 flex items-center ps-3.5 pointer-cursor">
                          <button
                            type="button"
                            onClick={() => setShowCc(false)}
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </AnimatePresence>
        )}

        {showBcc && (
          <AnimatePresence>
            <motion.div
              key="cc-input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="mb-2"
            >
              <FormField
                name="bcc"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none"></div>
                        <Input
                          type="email"
                          placeholder="BCC"
                          disabled={isLoading}
                          {...field}
                        />
                        <div className="absolute inset-y-0 end-3 flex items-center ps-3.5 pointer-cursor">
                          <button
                            type="button"
                            onClick={() => setShowBcc(false)}
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </AnimatePresence>
        )}

        <div className="mb-2">
          <FormField
            name="subject"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    className="mt-2"
                    placeholder="Subject"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mb-2">
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    rows={6}
                    id="email"
                    {...field}
                    placeholder="Write your email here"
                    className="no-scrollbar"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mb-2">
          <FormField
            name="attachment"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="file"
                    className="mt-2"
                    placeholder="attachment"
                    accept="image/png, image/jpeg, application/pdf"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          disabled={isLoading}
          className="text-white bg-indigo-500 hover:bg-indigo-400 transition-colors duration-75"
          type="submit"
        >
          Send
        </Button>
      </form>
    </Form>
  );
};

export default ReplyForm;
