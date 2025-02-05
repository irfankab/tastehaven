import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

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
  return (
    <Card className="md:col-span-1 p-4">
      <h2 className="font-semibold mb-4">Contacts</h2>
      <ScrollArea className="h-[500px]">
        <div className="space-y-2">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelectUser(user.id)}
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
                    className="w-8 h-8 rounded-full object-cover"
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
  );
};