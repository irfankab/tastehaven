import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Header } from "@/components/layout/Header";
import { Loader2, Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  sender: {
    username: string;
    avatar_url: string;
  };
}

interface User {
  id: string;
  username: string;
  avatar_url: string;
  email: string;
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, email")
        .neq("id", user.id);
      
      if (error) {
        toast({
          title: "Error fetching users",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      setUsers(profiles || []);
    };
    
    fetchUsers();
  }, [toast]);

  useEffect(() => {
    if (!selectedUser) return;

    const setupRealtimeSubscriptions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channels = [
        // Listen for messages sent to the selected user
        supabase
          .channel('messages_sent')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              filter: `sender_id=eq.${user.id}`,
            },
            (payload) => {
              console.log('Sent message:', payload);
              fetchMessages();
            }
          )
          .subscribe(),

        // Listen for messages received from the selected user
        supabase
          .channel('messages_received')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              filter: `receiver_id=eq.${user.id}`,
            },
            (payload) => {
              console.log('Received message:', payload);
              fetchMessages();
            }
          )
          .subscribe()
      ];

      return () => {
        channels.forEach(channel => supabase.removeChannel(channel));
      };
    };

    const fetchMessages = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("messages")
        .select(`
          id,
          content,
          sender_id,
          receiver_id,
          created_at,
          sender:profiles!messages_sender_id_fkey (
            username,
            avatar_url
          )
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser}),and(sender_id.eq.${selectedUser},receiver_id.eq.${user.id})`)
        .order("created_at", { ascending: true });

      if (error) {
        toast({
          title: "Error fetching messages",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setMessages(data as Message[] || []);
      setIsLoading(false);
    };

    fetchMessages();
    const cleanup = setupRealtimeSubscriptions();
    
    return () => {
      cleanup.then(cleanupFn => cleanupFn && cleanupFn());
    };
  }, [selectedUser, toast]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setIsLoading(true);
    const { error } = await supabase.from("messages").insert({
      content: newMessage,
      sender_id: user.id,
      receiver_id: selectedUser,
    });

    if (error) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    setNewMessage("");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="md:col-span-1 p-4">
            <h2 className="font-semibold mb-4">Contacts</h2>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedUser === user.id 
                        ? "bg-gray-100 hover:bg-gray-200" 
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {user.avatar_url ? (
                        <img 
                          src={user.avatar_url} 
                          alt={user.username || 'User'} 
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          {(user.username || 'A')[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{user.username || 'Anonymous'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>
          
          <Card className="md:col-span-3 p-4">
            <ScrollArea className="h-[500px] mb-4 relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : (
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
            
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                disabled={!selectedUser || isLoading}
                className="flex-1"
              />
              <Button 
                onClick={sendMessage}
                disabled={!selectedUser || !newMessage.trim() || isLoading}
                className="px-4"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;