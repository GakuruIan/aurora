import React from "react";

import { ClerkUser } from "@/interfaces";

interface props {
  user: ClerkUser;
}
// form
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

//components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

// toast
import { toast } from "sonner";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email, Please enter a valid Email"),
});

const AddEmail: React.FC<props> = ({ user }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email } = values;

    return toast.promise(
      (async () => {
        try {
          if (email) {
            // Update email only if it has changed
            await user.createEmailAddress({ email });
          }
        } catch (error) {
          console.error("Upload error:", error);
          throw error; // Re-throw for toast error handling
        }
      })(),
      {
        loading: "Adding Email...",
        success: "Email Added successfully",
        error: "An error has occurred",
        position: "top-center",
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-1">
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="mt-2"
                    placeholder="john@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="mt-2">Submit</Button>
      </form>
    </Form>
  );
};

export default AddEmail;
