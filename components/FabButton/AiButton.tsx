"use client";

import React from "react";

// icons
import { Brain } from "lucide-react";

// hooks
import { useChatStore } from "@/hooks/use-chat-store";

const AiButton = () => {
  const { openChat } = useChatStore();

  return (
    <div className="fixed bottom-10 right-6">
      <button
        onClick={openChat}
        className="p-3 rounded-full shadow-lg dark:bg-dark-10 bg-gray-500 flex items-center hover:bg-indigo-500 transition-colors duration-75"
      >
        <Brain size={18} className="text-indigo-500" />
      </button>
    </div>
  );
};

export default AiButton;
