"use client";

import React, { useState } from "react";

// form
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// icons
import { Mail, Lock, Eye, EyeClosed } from "lucide-react";

// routing
import Link from "next/link";
// router
import { redirect } from "next/navigation";

// clerk
import { useSignIn } from "@clerk/nextjs";

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

const formSchema = z.object({
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
  const [showPassword, setShowPassword] = useState(false);

  const { isLoaded, signIn, setActive } = useSignIn();

  //form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;
    if (!isLoaded) return;

    return toast.promise(
      (async () => {
        const signInAttempt = await signIn.create({
          identifier: email,
          password,
        });

        if (signInAttempt.status === "complete") {
          await setActive({ session: signInAttempt.createdSessionId });
          redirect("/dashboard");
        } else {
          console.error("Sign-in requires further steps:", signInAttempt);
          throw new Error("Sign-in requires further verification.");
        }
      })(),
      {
        loading: "Signing in...",
        success: "Login successful!",
        error: "Failed to sign in. Please check your credentials.",
        position: "top-center",
      }
    );
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

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
              Let&apos;s get you into your account
            </p>
          </div>
        </div>
        {/* header */}

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

              <Link
                href="/forgot-password"
                className="flex justify-end w-full dark:text-gray-500 text-gray-400 hover:text-gray-300 mt-2"
              >
                Forgot Password
              </Link>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              label="Login"
              style="dark:bg-white bg-dark-200 text-white dark:text-black font-semibold font-barlow mt-6 hover:bg-primary-100"
            />
            <p className="text-center text-gray-400 text-sm my-6">Or</p>

            <p className="text-sm text-center dark:text-gray-400 text-gray-500 hover:text-gray-300 transition duration-75">
              Dont have an account ? <Link href="/register">Sign up</Link>
            </p>
          </form>
        </Form>

        <Button
          type="button"
          isLoading={false}
          label="Sign in with Google"
          style="bg-indigo-600 text-white  font-medium font-barlow  hover:bg-indigo-500 mb-6"
        />
      </div>
    </div>
  );
};

export default Page;
