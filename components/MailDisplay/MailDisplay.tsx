import React from "react";

// icons
import { Reply, Forward } from "lucide-react";

// components
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import EmailForm from "@/components/Email/EmailForm/EmailForm";

// react query
import { useQuery } from "@tanstack/react-query";

// axios
import axios from "axios";

// router
import { useSearchParams } from "next/navigation";

import { PreprocessEmailContent } from "@/lib/utils/processEmail";

const MailDisplay = () => {
  const urlSearchParams = useSearchParams();

  const threadId = urlSearchParams.get("threadId");

  const {
    data: emailthread,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["emailthread", threadId],
    queryFn: () =>
      axios.get(`/api/google/emails/${threadId}`).then((res) => res.data),
    enabled: !!threadId,
  });

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)] py-4 w-full">
        <div className="flex items-center "></div>
      </div>
    );
  }

  if (!threadId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)] py-4 w-full">
        <div className="flex items-center ">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No mail selected
          </p>
          <Separator orientation="vertical" className="mx-2 h-6" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your messages will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] px-1 md:px-2 py-4 w-full">
      {isLoading ? (
        <>
          <div className="flex items-center justify-center my-auto py-4 w-full">
            <div className="flex items-center ">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-dark-10 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="">
          <header className="flex items-center justify-between w-full">
            <div className="flex items-center gap-x-2 mb-4 ">
              <Avatar>
                <AvatarFallback className="rounded-lg">A</AvatarFallback>
              </Avatar>
              <div className="">
                <h2 className="text-sm tracking-wide font-poppins">
                  {emailthread?.sender?.name}
                </h2>
                <p className="text-sm hover:dark:text-gray-300 hover:cursor-pointer transition-colors duration-75 dark:text-gray-400 text-gray-500">
                  reply to {emailthread?.sender?.email}
                </p>
              </div>
            </div>
          </header>
          <ScrollArea className=" flex-1 h-[30rem] ">
            {emailthread?.messages?.map((message) => (
              <div
                className="md:px-2 w-full mb-4 max-w-[22rem] md:max-w-[32rem]"
                key={message.id}
              >
                <div className="flex items-center w-full mb-2">
                  <h2 className="font-medium ">{message?.subject}</h2>
                  {/* timestamp */}

                  {/* timestamp */}
                </div>

                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{
                    __html: PreprocessEmailContent(message?.content || ""),
                  }}
                />

                <p className=" text-sm dark:text-gray-500 text-gray-400">
                  sent on:{" "}
                  {new Date(Number(message?.internalDate)).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }
                  )}{" "}
                </p>
              </div>
            ))}
          </ScrollArea>
          <div className="mt-auto">
            <div className="border dark:border-dark-10 border-gray-300 rounded-md">
              <div className="p-4">
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button className="mr-4">
                      <Reply />
                      Reply
                    </Button>
                  </DrawerTrigger>

                  <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                      <DrawerHeader>
                        <DrawerTitle>Reply Box</DrawerTitle>
                        <DrawerDescription>Write your email</DrawerDescription>
                      </DrawerHeader>

                      <div className="">
                        <EmailForm to={emailthread?.sender?.email} />
                      </div>

                      <DrawerFooter></DrawerFooter>
                    </div>
                  </DrawerContent>
                </Drawer>

                <Button>
                  <Forward />
                  Forward
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MailDisplay;
