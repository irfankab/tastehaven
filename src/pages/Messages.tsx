import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUsers = async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url");
      
      if (error) {
        toast({
          title: "Error fetching users",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      setUsers(profiles);
    };
    
    fetchUsers();
  }, [toast]);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) return;

      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          profiles:sender_id(username, avatar_url)
        `)
        .or(`sender_id.eq.${currentUser.user.id},receiver_id.eq.${currentUser.user.id}`)
        .order("created_at", { ascending: true });

      if (error) {
        toast({
          title: "Error fetching messages",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel("messages_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUser, toast]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) return;

    const { error } = await supabase.from("messages").insert({
      content: newMessage,
      sender_id: currentUser.user.id,
      receiver_id: selectedUser,
    });

    if (error) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setNewMessage("");
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <Card className="p-4">
            <h2 className="font-semibold mb-4">Users</h2>
            <ScrollArea className="h-[500px]">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user.id)}
                  className={`w-full text-left p-2 rounded hover:bg-gray-100 ${
                    selectedUser === user.id ? "bg-gray-100" : ""
                  }`}
                >
                  {user.username}
                </button>
              ))}
            </ScrollArea>
          </Card>
        </div>
        
        <div className="col-span-3">
          <Card className="p-4">
            <ScrollArea className="h-[500px] mb-4">
              <div className="space-y-4">
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
                      <p>{message.content}</p>
                      <span className="text-xs opacity-70">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;