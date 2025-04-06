import React from "react";

interface email {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  sender: {
    name: string;
  };
  internalDate: string;
}

interface EmailProps {
  email: email;
}
import { convertTimestamp } from "@/lib/utils/utils";

import { useRouter } from "next/navigation";

// utils
import { TruncateText } from "@/lib/utils/utils";

const Email: React.FC<EmailProps> = ({ email }) => {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/emails?threadId=${id}`);
  };
  return (
    <div
      key={email.id}
      onClick={() => handleClick(email.threadId)}
      className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 dark:hover:bg-dark-50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      <div className="flex w-full items-center gap-2">
        <span className="font-medium capitalize ">{email.sender?.name}</span>{" "}
        <span className="ml-auto text-xs">
          {new Date(Number(email.internalDate)).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}{" "}
        </span>
      </div>
      <span className="dark:text-gray-300  text-gray-400 font-medium text-sm">
        {TruncateText(email?.subject, 6)}
      </span>
      <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
        {email?.snippet}
      </span>
    </div>
  );
};

export default Email;
