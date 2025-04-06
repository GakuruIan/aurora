import React from "react";

import { useQuery } from "@tanstack/react-query";

// components
import Loader from "../loading/loader";
import Error from "@/components/Error/Error";
import Email from "../email";

// axios
import axios from "axios";

const Inbox = () => {
  const {
    data: emails,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["emails"],
    queryFn: () => axios.get("/api/google/emails").then((res) => res.data),
  });

  if (isError) {
    return <Error error={error?.message} />;
  }

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {emails?.map((email) => (
            <Email key={email.id} email={email} />
          ))}
        </>
      )}
    </div>
  );
};

export default Inbox;
