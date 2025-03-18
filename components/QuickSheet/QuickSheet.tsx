"use client";

// icons
import { Send } from "lucide-react";

// components
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
} from "../ui/sheet";

// chat hooks
import { useChatStore } from "@/hooks/use-chat-store";
import { ScrollArea } from "../ui/scroll-area";

const ChatSheet = () => {
  const { isOpen, closeChat } = useChatStore();
  return (
    <Sheet open={isOpen} onOpenChange={closeChat}>
      <SheetContent side="right">
        <SheetTitle className="text-center my-2">Aurora Quick chat</SheetTitle>
        <SheetDescription className="dark:text-gray-400 text-gray-500 text-sm">
          Quick chats, smart replies—always here when you need me. Just ask!
        </SheetDescription>

        <ScrollArea className="py-4 min-h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)]">
          <div className="flex items-start gap-2">
            <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-dark-50">
              <div className="flex items-center space-x-2 rtl:space-x-reverse"></div>
              <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                That's awesome. I think our users will really appreciate the
                improvements.
              </p>
            </div>
          </div>
        </ScrollArea>

        <SheetFooter>
          <Input placeholder="write a short message" />
          <Button>
            <Send size={18} />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ChatSheet;
