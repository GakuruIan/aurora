import React from "react";

// icons
import { Mail } from "lucide-react";

// components
import Button from "@/components/Button/Button";

// routing
import Link from "next/link";

const page = () => {
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
          <form action="">
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

            <Button
              type="submit"
              label="Login"
              style="dark:bg-white bg-dark-200 text-white dark:text-black font-semibold font-barlow mb-4 hover:bg-primary-100"
            />
          </form>

          <p className="text-sm text-center dark:text-gray-400 text-gray-500 hover:text-gray-300 transition duration-75">
            Remember Password ? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
