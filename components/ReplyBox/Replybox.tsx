import React from "react";

// component
import EmailEditor from "../EmailEditor/EmailEditor";

const Replybox = () => {
  return (
    <>
      <div className="border dark:border-dark-10 border-gray-400 rounded-md">
        <EmailEditor />
      </div>
    </>
  );
};

export default Replybox;
