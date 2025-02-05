import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Grid, User, MapPin, Calendar, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const { toast } = useToast();

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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-500">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <Avatar className="w-32 h-32">
              <img
                src={profile.avatar_url || "/placeholder.svg"}
                alt={profile.username}
                className="w-full h-full object-cover rounded-full"
              />
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-2 md:mb-0">{profile.username}</h1>
                {isCurrentUser && (
                  <Button variant="outline">Edit Profile</Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left mb-6">
                <div>
                  <span className="font-semibold">0</span> posts
                </div>
                <div>
                  <span className="font-semibold">0</span> followers
                </div>
                <div>
                  <span className="font-semibold">0</span> following
                </div>
              </div>
              
              <div className="space-y-2">
                {profile.full_name && (
                  <p className="font-semibold">{profile.full_name}</p>
                )}
                {profile.bio && (
                  <p className="text-gray-600">{profile.bio}</p>
                )}
                <div className="flex flex-col gap-2 text-gray-600">
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                  {profile.date_of_birth && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(profile.date_of_birth).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t pt-8">
            <div className="flex justify-center mb-8">
              <Button variant="ghost" className="flex items-center gap-2">
                <Grid className="w-4 h-4" />
                <span>Posts</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {/* Posts will be added here */}
              <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
