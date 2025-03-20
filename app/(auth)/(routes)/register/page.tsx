"use client";

import React, { useState } from "react";

// icons
import { Mail, Lock, Eye, EyeClosed, User } from "lucide-react";

// clerk
import { useSignUp, useAuth } from "@clerk/nextjs";

// form
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// router
import { useRouter } from "next/navigation";

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

import { toast } from "sonner";

// routing
import Link from "next/link";
import OTPverification from "@/components/OTPVerification/OTPverification";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long.")
    .max(20, "username cannot be more than 20 characters")
    .regex(
      /^[a-zA-Z][a-zA-Z0-9_]*$/,
      "Username must start with a letter and contain only letters, numbers, and underscores."
    ),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email, Please enter a valid Email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(50, "Password cannot exceed 50 characters.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/\d/, "Password must contain at least one number.")
    .regex(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@, $, !, %, *, ?, &)."
    ),
});

const Page = () => {
  // custom clerk auth

  const { isLoaded, signUp } = useSignUp();
  const [showPassword, setShowPassword] = useState(false);

  const [verifying, setVerifying] = useState(false);

  const router = useRouter();

  const { userId } = useAuth();

  if (userId) router.push("/");

  //form submission

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { username, email, password } = values;
    if (!isLoaded) return;

    return toast.promise(
      (async () => {
        await signUp.create({
          username,
          emailAddress: email,
          password,
        });

        // send user verification code
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        setVerifying(true);
      })(),
      {
        loading: "Creating account...",
        success: "Account created successfully",
        error: "An error has occurred",
        position: "top-center",
      }
    );
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  // if verifying show verifying page
  if (verifying) {
    return <OTPverification />;
  }

  return (
    <div className="">
      <div className="flex flex-col gap-y-4 w-full md:w-96">
        {/* header */}
        <div className="flex flex-col items-center">
          <div className="">
            <h2 className="text-xl md:text-2xl font-medium font-poppins mb-1">
              Welcome to Aurora
            </h2>
            <p className="text-sm font-barlow dark:text-gray-400 text-gray-500">
              Let&apos;s get you started with Aurora
            </p>
          </div>
        </div>
        {/* header */}

        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-4">
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base   font-normal dark:text-white">
                        Username
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                            <User size={20} />
                          </div>
                          <Input
                            type="text"
                            placeholder="JohnDev"
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

              <div className="mb-4">
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base  font-normal dark:text-white">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                            <Lock size={20} />
                          </div>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="password"
                            disabled={isLoading}
                            className="w-full outline-0 ps-10  bg-light-200 dark:bg-dark-50 dark:text-white  placeholder:text-sm dark:border-0 rounded-sm placeholder:dark:text-gray-400"
                            {...field}
                          />
                          <div className="absolute inset-y-0 end-3 flex items-center ps-3.5 pointer-cursor">
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <Eye size={20} />
                              ) : (
                                <EyeClosed size={20} />
                              )}
                            </button>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Link
                href="/"
                className="flex justify-end w-full dark:text-gray-500 text-gray-400 hover:text-gray-300 mt-2"
              >
                Forgot Password
              </Link>

              <Button
                type="submit"
                label="Register"
                loadingText="creating account..."
                isLoading={isLoading}
                style="dark:bg-white bg-dark-200 text-white dark:text-black font-semibold font-barlow mt-6 hover:bg-primary-100"
              />
              <p className="text-center text-gray-400 text-sm my-6">Or</p>
            </form>
          </Form>

          <Button
            type="button"
            isLoading={false}
            label="Sign in with Google"
            style="bg-indigo-600 text-white  font-medium font-barlow  hover:bg-indigo-500 mb-2"
          />

          <p className="text-sm text-center dark:text-gray-400 text-gray-500 hover:text-gray-300 transition duration-75">
            Have an account ? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
