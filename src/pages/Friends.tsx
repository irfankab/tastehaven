import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Header } from "@/components/layout/Header";
import { Loader2, UserPlus, UserMinus, Check, X } from "lucide-react";

interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
}

interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const Friends = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        toast({
          title: "Error fetching current user",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      if (user) {
        setCurrentUserId(user.id);
      }
    };

    fetchCurrentUser();
  }, [toast]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUserId) return;

      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", currentUserId);

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

    const fetchFriendships = async () => {
      if (!currentUserId) return;

      const { data, error } = await supabase
        .from("friendships")
        .select("*")
        .or(`user_id.eq.${currentUserId},friend_id.eq.${currentUserId}`);

      if (error) {
        toast({
          title: "Error fetching friendships",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setFriendships(data || []);
    };

    if (currentUserId) {
      fetchUsers();
      fetchFriendships();

      const channel = supabase
        .channel("friendships_channel")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "friendships",
          },
          () => {
            fetchFriendships();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentUserId, toast]);

  const sendFriendRequest = async (userId: string) => {
    if (!currentUserId) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("friendships")
        .insert({
          user_id: currentUserId,
          friend_id: userId,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Friend request sent successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error sending friend request",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFriendRequest = async (friendshipId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from("friendships")
        .update({ status })
        .eq("id", friendshipId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Friend request ${status}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating friend request",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeFriend = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from("friendships")
        .delete()
        .eq("id", friendshipId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Friend removed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error removing friend",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getFriendshipStatus = (userId: string) => {
    const friendship = friendships.find(
      f => (f.user_id === currentUserId && f.friend_id === userId) ||
           (f.user_id === userId && f.friend_id === currentUserId)
    );

    if (!friendship) return null;

    return {
      id: friendship.id,
      status: friendship.status,
      isReceiver: friendship.friend_id === currentUserId
    };
  };

  const renderFriendshipButton = (userId: string) => {
    const friendship = getFriendshipStatus(userId);

    if (!friendship) {
      return (
        <Button 
          onClick={() => sendFriendRequest(userId)}
          disabled={isLoading}
          size="sm"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Friend
        </Button>
      );
    }

    if (friendship.status === 'pending') {
      if (friendship.isReceiver) {
        return (
          <div className="flex gap-2">
            <Button 
              onClick={() => handleFriendRequest(friendship.id, 'accepted')}
              variant="default"
              size="sm"
            >
              <Check className="w-4 h-4 mr-2" />
              Accept
            </Button>
            <Button 
              onClick={() => handleFriendRequest(friendship.id, 'rejected')}
              variant="destructive"
              size="sm"
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        );
      }
      return (
        <Button 
          variant="secondary"
          size="sm"
          disabled
        >
          Pending
        </Button>
      );
    }

    if (friendship.status === 'accepted') {
      return (
        <Button 
          onClick={() => removeFriend(friendship.id)}
          variant="destructive"
          size="sm"
        >
          <UserMinus className="w-4 h-4 mr-2" />
          Remove Friend
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="space-y-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Find Friends by Email</h2>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={() => {
                  const user = users.find(u => u.email === searchEmail);
                  if (user) {
                    sendFriendRequest(user.id);
                    setSearchEmail("");
                  } else {
                    toast({
                      title: "User not found",
                      description: "No user found with that email address",
                      variant: "destructive",
                    });
                  }
                }}
                disabled={isLoading || !searchEmail}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Friend
                  </>
                )}
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{user.username || 'Anonymous'}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  {renderFriendshipButton(user.id)}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;