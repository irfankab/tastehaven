
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Loader2, Send } from "lucide-react";
import { ContactList } from "@/components/messages/ContactList";
import { MessageList } from "@/components/messages/MessageList";

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
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to view messages",
          variant: "destructive",
        });
        return;
      }

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

    const fetchMessages = async () => {
      setIsLoading(true);
      try {
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

        if (error) throw error;
        setMessages(data as Message[] || []);
      } catch (error: any) {
        toast({
          title: "Error fetching messages",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Set up realtime subscription
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${selectedUser},receiver_id.eq.${selectedUser})`
        },
        (payload) => {
          console.log('Received realtime update:', payload);
          fetchMessages(); // Refresh messages when we receive an update
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    // Initial fetch
    fetchMessages();

    // Cleanup subscription
    return () => {
      channel.unsubscribe();
    };
  }, [selectedUser, toast]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { error } = await supabase.from("messages").insert({
        content: newMessage,
        sender_id: user.id,
        receiver_id: selectedUser,
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ContactList 
            users={users}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
          />
          
          <Card className="md:col-span-3 p-4">
            <MessageList 
              messages={messages}
              selectedUser={selectedUser}
              isLoading={isLoading}
            />
            
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
