"use client";

import React, { useState } from "react";

// icons
import { Mail, Lock, Eye, EyeClosed, User } from "lucide-react";

// components
import Button from "@/components/Button/Button";

// routing
import Link from "next/link";

const page = () => {
  const [showPassword, setShowPassword] = useState(false);

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
          <form action="">
            <div className="mb-8">
              <label className="text-base font-barlow  font-normal dark:text-white">
                Username
              </label>

              <div className="relative mt-2">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <User size={20} />
                </div>
                <input
                  type="email"
                  className="w-full outline-0  bg-light-100 dark:bg-dark-50 dark:text-white bg-light  placeholder:text-sm focus:outline-indigo-400 ps-10 p-3 rounded-sm font-barlow"
                  placeholder="John@gmail.com"
                  required
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="text-base font-barlow  font-normal dark:text-white">
                Email
              </label>

              <div className="relative mt-2">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  className="w-full outline-0  bg-light-100 dark:bg-dark-50 dark:text-white bg-light  placeholder:text-sm focus:outline-indigo-400 ps-10 p-3 rounded-sm font-barlow"
                  placeholder="John@gmail.com"
                  required
                />
              </div>
            </div>

            <div className="">
              <label className="text-base font-barlow  font-normal dark:text-white">
                Password
              </label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full outline-0 px-2 py-3 bg-light-100 dark:bg-dark-50 dark:text-white bg-light  placeholder:text-sm focus:outline-indigo-400 ps-10 p-3"
                  placeholder="Password"
                  required
                />

                <div className="absolute inset-y-0 end-3 flex items-center ps-3.5">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="flex justify-end w-full dark:text-gray-500 text-gray-400 hover:text-gray-300 mt-2"
            >
              Forgot Password
            </Link>

            <Button
              type="submit"
              label="Login"
              style="dark:bg-white bg-dark-200 text-white dark:text-black font-semibold font-barlow mt-6 hover:bg-primary-100"
            />
            <p className="text-center text-gray-400 text-sm my-6">Or</p>
          </form>

          <Button
            type="button"
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

export default page;
