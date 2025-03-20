"use client";

import React, { useState } from "react";

// clerk
import { useSignIn } from "@clerk/nextjs";

import { useAuth } from "@clerk/nextjs";

// zod
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// icons
import { Mail } from "lucide-react";

// toast
import { toast } from "sonner";

// components
import Button from "@/components/Button/Button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// routing
import Link from "next/link";
import PasswordOTPverification from "@/components/OTPVerification/PasswordOTPverification";
import { useRouter } from "next/navigation";

// form schema
const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email, Please enter a valid Email"),
});

const Page = () => {
  const [showPasswordOTP, setShowPasswordOTP] = useState(false);
  const { isLoaded, signIn } = useSignIn();

  const { userId } = useAuth();

  const router = useRouter();

  if (userId) {
    router.replace("/dashboard");
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email } = values;

    if (!isLoaded) return;

    await signIn
      .create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then(() => {
        toast.success("Password reset code sent to your email");
        setShowPasswordOTP(true);
      })
      .catch((error) => {
        if (error?.errors[0]?.code === "verification_expired") {
          return toast("Vefication code Expired", {
            description: error?.errors[0]?.longMessage,
          });
        }

        toast("An error occurred", {
          description: JSON.stringify(error?.errors[0]?.longMessage, null, 2),
        });

        console.error("Error:", JSON.stringify(error, null, 2));
      });
  };

  // form submitting status
  const isLoading = form.formState.isSubmitting;

  if (showPasswordOTP) {
    return <PasswordOTPverification />;
  }

  return (
    <div className="">
      <div className="flex flex-col gap-y-4 w-full md:w-96">
        {/* header */}
        <div className="flex flex-col items-center">
          <div className="">
            <h2 className="text-xl md:text-2xl  font-medium font-poppins mb-1">
              Forgot Your Password?
            </h2>
            <p className="text-sm font-barlow dark:text-gray-400 text-gray-500">
              No worries! Enter your email to reset your password and regain
              access
            </p>
          </div>
        </div>
        {/* header */}

        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-4">
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base  font-normal dark:text-white">
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                            <Mail size={20} />
                          </div>
                          <Input
                            type="text"
                            placeholder="John@gmail.com"
                            disabled={isLoading}
                            className="w-full outline-0 ps-10  bg-light-200 dark:bg-dark-50 dark:text-white  placeholder:text-sm dark:border-0 rounded-sm placeholder:dark:text-gray-400"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                label="Request reset code"
                isLoading={isLoading}
                loadingText="Sending code..."
                style="dark:bg-white bg-dark-200 text-white dark:text-black font-semibold font-barlow mb-4 hover:bg-primary-100"
              />
            </form>
          </Form>
          <p className="text-sm text-center dark:text-gray-400 text-gray-500 hover:text-gray-300 transition duration-75">
            Remember Password ? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
