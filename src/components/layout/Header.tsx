import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/restaurants/SearchBar";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Header = ({ onSearch }: { onSearch?: (query: string) => void }) => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-bold text-gray-900 tracking-tight">
              REVBD
            </Link>
          </div>

          {onSearch && (
            <div className="flex-1 max-w-2xl mx-8">
              <SearchBar onSearch={onSearch} />
            </div>
          )}

          <nav className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  to="/messages"
                  className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-full transition-colors"
                >
                  Messages
                </Link>
                <Link
                  to="/friends"
                  className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-full transition-colors"
                >
                  Friends
                </Link>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-full transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-full transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};