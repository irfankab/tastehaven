
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

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
      <div className="h-[500px] flex flex-col items-center justify-center text-gray-500 bg-gray-50/50 rounded-lg">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Your Messages</h3>
          <p className="text-sm text-gray-500">Select a contact to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] mb-4 relative bg-gray-50/30 rounded-lg">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4 p-4">
          {messages.map((message, index) => {
            const isFirstMessage = index === 0 || messages[index - 1].sender_id !== message.sender_id;
            const showTimestamp = index === 0 || 
              new Date(message.created_at).getTime() - new Date(messages[index - 1].created_at).getTime() > 300000;

            return (
              <div key={message.id}>
                {showTimestamp && (
                  <div className="text-center my-4">
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                      {format(new Date(message.created_at), "MMM d, h:mm a")}
                    </span>
                  </div>
                )}
                <div
                  className={`flex ${
                    message.sender_id === selectedUser
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2 max-w-[70%] shadow-sm ${
                      message.sender_id === selectedUser
                        ? "bg-white text-gray-900 rounded-tl-none"
                        : "bg-primary text-white rounded-tr-none"
                    } ${isFirstMessage ? "mt-2" : "mt-1"}`}
                  >
                    <p className="break-words text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {messages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No messages yet. Start the conversation!
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </ScrollArea>
  );
};
