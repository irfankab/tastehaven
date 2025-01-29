import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
}

interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
}

const Friends = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
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

      // Subscribe to friendship changes
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

  const followUser = async (userId: string) => {
    if (!currentUserId) return;

    const { error } = await supabase.from("friendships").insert({
      user_id: currentUserId,
      friend_id: userId,
      status: "following",
    });

    if (error) {
      toast({
        title: "Error following user",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "You are now following this user",
      });
    }
  };

  const unfollowUser = async (userId: string) => {
    if (!currentUserId) return;

    const friendship = friendships.find(
      (f) =>
        f.user_id === currentUserId &&
        f.friend_id === userId
    );

    if (!friendship) return;

    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("id", friendship.id);

    if (error) {
      toast({
        title: "Error unfollowing user",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "You have unfollowed this user",
      });
    }
  };

  const isFollowing = (userId: string) => {
    if (!currentUserId) return false;

    return friendships.some(
      (f) =>
        f.user_id === currentUserId &&
        f.friend_id === userId &&
        f.status === "following"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Users</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{user.username}</h3>
                </div>
                <Button
                  variant={isFollowing(user.id) ? "destructive" : "default"}
                  onClick={() =>
                    isFollowing(user.id)
                      ? unfollowUser(user.id)
                      : followUser(user.id)
                  }
                >
                  {isFollowing(user.id) ? "Unfollow" : "Follow"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Friends;