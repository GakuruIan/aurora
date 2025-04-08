"use client";
import Image from "next/image";
import Link from "next/link";

import logo from "@/public/colorful-logo.png";

import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const { userId, isLoaded } = useAuth();

  return (
    <div className="relative min-h-screen  bg-dark-250">
      {/* navbar */}
      <div className="py-4 mx-auto lg:max-w-5xl xl:max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          <Image src={logo} alt="Logo" className="size-10" />
          <h5 className="text-base text-white">Aurora AI</h5>
        </div>

        <div className="flex items-center">
          <ul className="flex items-center gap-x-6">
            <li className="font-poppins hover:text-gray-400 text-white  transition duration-75  text-sm">
              Home
            </li>
            <li className="font-poppins hover:text-gray-400 text-white  transition duration-75  text-sm">
              Contact
            </li>
            <li className="font-poppins hover:text-gray-400 text-white  transition duration-75  text-sm">
              Services
            </li>
            <li className="font-poppins hover:text-gray-400 text-white  transition duration-75  text-sm">
              About
            </li>
          </ul>
        </div>
      </div>
      {/* navbar */}

      <div className="relative  mt-14  flex flex-col gap-y-8 w-full items-center justify-center ">
        <div className="">
          <div className="relative group mb-4">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-linear-one to-linear-two rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-75"></div>
            <button className="relative w-56 bg-dark-50 rounded-lg leading-none px-4 py-2.5">
              <p className="text-sm px-6 py-1 text-white font-barlow">
                Trusted by 1200
              </p>
            </button>
          </div>
        </div>

        <div className="text-center mb-2 px-2.5 md:px-0">
          {/* heading */}
          <h1 className="text-3xl text-white font-space font-medium md:text-6xl text-center md:max-w-3xl mb-4">
            Your AI-Powered Personal Assistant-{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-linear-one to-linear-two">
              Aurora
            </span>
          </h1>

          <p className="text-sm md:text-base text-gray-400 ">
            Stay Organized, Automate Tasks, and Get AI-Driven Insights – All in
            One Place.
          </p>
        </div>

        {/* heading */}

        {/* animated input */}

        <div className="flex items-center">
          <div className=" px-4 py-2">
            {/* animated text */}
            <p className="text-sm text-gray-400">Summarize Emails</p>
            {/* animated text */}
          </div>
        </div>
        {/* animated input

        {/* button */}

        <Link
          href={userId && isLoaded ? "/dashboard" : "/login"}
          className="flex items-center w-48 bg-indigo-600 hover:bg-indigo-500 transition duration-75 text-white  rounded-md justify-center font-medium font-barlow text-sm px-4 py-2.5 "
        >
          {userId && isLoaded ? "Go to Dashboard" : "Get started"}
        </Link>
        {/* button */}
      </div>
    </div>
  );
}
