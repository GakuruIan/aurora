"use client";
import React, { useEffect } from "react";

// loader
import HashLoader from "react-spinners/HashLoader";

import { useMutation } from "@tanstack/react-query";

import axios from "axios";
// router

import { useRouter, useSearchParams } from "next/navigation";

// component
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();

  const urlSearchParams = useSearchParams();

  const accountId = urlSearchParams.get("account");

  const {
    mutate: SyncGoogle,
    isPending,
    isError,
  } = useMutation({
    mutationFn: () =>
      axios
        .get(`/api/google/sync?account=${accountId}`)
        .then((res) => res.data),
    onSuccess: () => {
      toast.success("Data has been sync successfully");
      router.replace("/dashboard");
    },
    onError: () => {
      toast.error("Failed to sync data");
    },
  });

  useEffect(() => {
    SyncGoogle();
  }, []);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <div className="flex items-center flex-col gap-y-4">
          <HashLoader color={"#20B6B4"} size={80} />
          <h1 className="text-xl mt-6 font-barlow dark:text-gray-400 text-gray-500">
            Please stand by as we sync your data
          </h1>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <div className="flex items-center flex-col gap-y-4">
          <h1 className="text-xl mt-6 font-barlow dark:text-gray-400 text-gray-500">
            Failed to sync your data
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
      <div className="flex items-center flex-col gap-y-4">
        <HashLoader color={"#20B6B4"} size={80} />
        <h1 className="text-xl mt-6 font-barlow dark:text-gray-400 text-gray-500">
          Redirecting...
        </h1>
      </div>
    </div>
  );
};

export default Page;
