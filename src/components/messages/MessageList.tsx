import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface MessageListProps {
  messages: Message[];
  selectedUser: string | null;
  isLoading: boolean;
}

export const MessageList = ({ messages, selectedUser, isLoading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="h-[500px] flex items-center justify-center text-gray-500">
        Select a contact to start messaging
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] mb-4 relative">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <div className="space-y-4 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === selectedUser
                  ? "justify-start"
                  : "justify-end"
              }`}
            >
              <div
                className={`rounded-lg p-3 max-w-[70%] ${
                  message.sender_id === selectedUser
                    ? "bg-gray-100"
                    : "bg-blue-500 text-white"
                }`}
              >
                <p className="break-words">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </ScrollArea>
  );
};