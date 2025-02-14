
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface User {
  id: string;
  username: string;
  avatar_url: string;
  email: string;
}

interface ContactListProps {
  users: User[];
  selectedUser: string | null;
  onSelectUser: (userId: string) => void;
}

export const ContactList = ({ users, selectedUser, onSelectUser }: ContactListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="md:col-span-1 p-4 h-[600px] flex flex-col">
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <ScrollArea className="flex-1 -mx-2 px-2">
        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelectUser(user.id)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                selectedUser === user.id 
                  ? "bg-primary/10 hover:bg-primary/20" 
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.username || 'User'} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold shadow-sm">
                    {(user.username || 'A')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <p className={`font-medium ${selectedUser === user.id ? 'text-primary' : 'text-gray-900'}`}>
                    {user.username || 'Anonymous'}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </button>
          ))}
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No contacts found
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
