import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Header } from "@/components/layout/Header";
import { Loader2 } from "lucide-react";

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
  status: string;
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

  const followUserByEmail = async (email: string) => {
    setIsLoading(true);
    try {
      // First find the user by email
      const { data: userToFollow, error: userError } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("email", email)
        .single();

      if (userError || !userToFollow) {
        toast({
          title: "User not found",
          description: "No user found with that email address",
          variant: "destructive",
        });
        return;
      }

      if (userToFollow.id === currentUserId) {
        toast({
          title: "Invalid action",
          description: "You cannot follow yourself",
          variant: "destructive",
        });
        return;
      }

      // Check if already following
      const isAlreadyFollowing = friendships.some(
        (f) =>
          f.user_id === currentUserId &&
          f.friend_id === userToFollow.id
      );

      if (isAlreadyFollowing) {
        toast({
          title: "Already following",
          description: "You are already following this user",
          variant: "destructive",
        });
        return;
      }

      // Create friendship
      const { error: friendshipError } = await supabase
        .from("friendships")
        .insert({
          user_id: currentUserId,
          friend_id: userToFollow.id,
          status: "following",
        });

      if (friendshipError) throw friendshipError;

      toast({
        title: "Success",
        description: "You are now following this user",
      });
      
      setSearchEmail("");
    } catch (error: any) {
      toast({
        title: "Error following user",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        <div className="space-y-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Follow by Email</h2>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={() => followUserByEmail(searchEmail)}
                disabled={isLoading || !searchEmail}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Following...
                  </>
                ) : (
                  "Follow"
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
                  <Button
                    variant={isFollowing(user.id) ? "destructive" : "default"}
                    onClick={() =>
                      isFollowing(user.id)
                        ? unfollowUser(user.id)
                        : followUserByEmail(user.email)
                    }
                    className="ml-2"
                  >
                    {isFollowing(user.id) ? "Unfollow" : "Follow"}
                  </Button>
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