import React from "react";

//icons
import { Paperclip, SendHorizontal, Menu } from "lucide-react";

// components
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const assistant = () => {
  return (
    <>
      <div className="flex items-center justify-between mx-auto px-2.5 md:px-0 max-w-5xl py-4">
        <div className="">
          <div className="md:hidden block">
            <Menu size={18} />
          </div>
        </div>

        <div className="">
          <Avatar>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="w-full h-[calc(100vh-88px)] flex items-center justify-center">
        <div className="px-4 md:px-0">
          <div className="mb-2 ">
            <h1 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-linear-one to-linear-two md:text-5xl font-space mb-4">
              Hello there ,John
            </h1>
            <h4 className="text-base md:text-xl font-barlow max-w-4xl text-gray-500 dark:text-400">
              I’m here to assist—whether it&apos;s notes, tasks, or just a quick
              question. What’s up?
            </h4>
          </div>
          <div className="bg-light-100 dark:bg-dark-50 overflow-hidden rounded-lg px-3 py-3">
            <form action="" className="">
              <textarea
                name=""
                id=""
                placeholder="Ask anything"
                rows={3}
                style={{ resize: "none", scrollbarWidth: "none" }}
                className="w-full py-2 bg-inherit outline-0"
              ></textarea>

              <div className="flex items-center justify-between py-2 w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center border border-gray-400    justify-center  py-1.5 px-4 rounded-full cursor-pointer"
                >
                  <div className="flex gap-x-2 items-center justify-center">
                    <Paperclip
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                    <p className=" text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Add Attachment</span>
                    </p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" />
                </label>

                <button
                  type="submit"
                  className="bg-dark-300 flex items-center justify-normal dark:bg-white p-2 text-white dark:text-gray-700 rounded-full"
                >
                  <SendHorizontal size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default assistant;
