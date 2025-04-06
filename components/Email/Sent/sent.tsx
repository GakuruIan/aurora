import React from "react";

import { useQuery } from "@tanstack/react-query";

// components
import Loader from "../loading/loader";
import Error from "@/components/Error/Error";
import Email from "../email";

// axios
import axios from "axios";

const Sent = () => {
  const {
    data: sent_emails,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["sent_emails"],
    queryFn: () => axios.get("/api/google/emails/sent").then((res) => res.data),
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
          {sent_emails?.map((email) => (
            <Email key={email.id} email={email} />
          ))}
        </>
      )}
    </div>
  );
};

export default Sent;
