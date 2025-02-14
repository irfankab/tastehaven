
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Grid, User, MapPin, Calendar, Mail, Plus, Link, Image, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreatePostModal } from "@/components/profile/CreatePostModal";
import { PostsGrid } from "@/components/profile/PostsGrid";
import { useNavigate } from "react-router-dom";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  location: string;
  email: string;
  date_of_birth: string;
}

interface Post {
  id: string;
  media_url: string;
  media_type: string;
  caption: string;
}

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [friendshipStatus, setFriendshipStatus] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPosts = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    }
  };

  const checkFriendshipStatus = async (currentUserId: string, profileId: string) => {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select('*')
        .or(`and(user_id.eq.${currentUserId},friend_id.eq.${profileId}),and(user_id.eq.${profileId},friend_id.eq.${currentUserId})`);

      if (error) throw error;

      if (data && data.length > 0) {
        setFriendshipStatus(data[0].status);
      }
    } catch (error) {
      console.error('Error checking friendship status:', error);
    }
  };

  const handleFriendAction = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (!friendshipStatus) {
        const { error } = await supabase
          .from('friendships')
          .insert([{
            user_id: user.id,
            friend_id: profile?.id,
            status: 'pending'
          }]);

        if (error) throw error;
        setFriendshipStatus('pending');
        toast({
          title: "Friend request sent",
          description: "Your friend request has been sent successfully.",
        });
      }
    } catch (error) {
      console.error('Error handling friend action:', error);
      toast({
        title: "Error",
        description: "Failed to send friend request",
        variant: "destructive",
      });
    }
  };

  const handleMessage = () => {
    if (profile) {
      navigate(`/messages?user=${profile.id}`);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id || user?.id)
          .single();

        if (error) throw error;

        setProfile(profileData);
        setIsCurrentUser(user?.id === (id || user?.id));
        
        if (profileData) {
          fetchPosts(profileData.id);
          if (user && !isCurrentUser) {
            checkFriendshipStatus(user.id, profileData.id);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-500">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <Avatar className="w-32 h-32 ring-4 ring-primary/10">
                <img
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt={profile.username}
                  className="w-full h-full object-cover rounded-full"
                />
              </Avatar>
              
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-center md:text-left">
                    <h1 className="text-2xl font-bold mb-1">{profile.username}</h1>
                    {profile.full_name && (
                      <p className="text-gray-600">{profile.full_name}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                    {isCurrentUser ? (
                      <>
                        <Button variant="outline" className="w-full md:w-auto">
                          Edit Profile
                        </Button>
                        <Button 
                          onClick={() => setIsCreatePostModalOpen(true)}
                          className="w-full md:w-auto"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create Post
                        </Button>
                      </>
                    ) : (
                      <>
                        {friendshipStatus !== 'accepted' && (
                          <Button 
                            onClick={handleFriendAction}
                            disabled={friendshipStatus === 'pending'}
                            className="w-full md:w-auto"
                          >
                            {friendshipStatus === 'pending' ? 'Pending' : 'Add Friend'}
                          </Button>
                        )}
                        <Button 
                          variant="outline"
                          onClick={handleMessage}
                          className="w-full md:w-auto"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center py-4 border-y">
                  <div className="space-y-1">
                    <span className="text-2xl font-semibold">{posts.length}</span>
                    <p className="text-sm text-gray-600">posts</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-2xl font-semibold">0</span>
                    <p className="text-sm text-gray-600">followers</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-2xl font-semibold">0</span>
                    <p className="text-sm text-gray-600">following</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {profile.bio && (
                    <p className="text-gray-600">{profile.bio}</p>
                  )}
                  <div className="flex flex-col gap-2 text-sm text-gray-600">
                    {profile.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{profile.email}</span>
                      </div>
                    )}
                    {profile.date_of_birth && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(profile.date_of_birth).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="border-b mb-6">
              <div className="flex justify-center">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Grid className="w-4 h-4" />
                  <span>Posts</span>
                </Button>
              </div>
            </div>
            
            {posts.length > 0 ? (
              <PostsGrid posts={posts} />
            ) : (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No posts yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  When {isCurrentUser ? 'you share' : `${profile.username} shares`} photos, they'll appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onPostCreated={() => fetchPosts(profile.id)}
      />
    </div>
  );
};

export default Profile;
