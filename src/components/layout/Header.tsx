import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/restaurants/SearchBar";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Menu, X } from "lucide-react";

export const Header = ({ onSearch }: { onSearch?: (query: string) => void }) => {
  const [session, setSession] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center">
            <Link to="/" className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              REVBD
            </Link>
          </div>

          {onSearch && (
            <div className="hidden sm:block flex-1 max-w-2xl mx-8">
              <SearchBar onSearch={onSearch} />
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center space-x-4">
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
          >
            {isMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {onSearch && (
                <div className="mb-4">
                  <SearchBar onSearch={onSearch} />
                </div>
              )}
              {session ? (
                <>
                  <Link
                    to="/messages"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Messages
                  </Link>
                  <Link
                    to="/friends"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Friends
                  </Link>
                  <button
                    onClick={() => {
                      supabase.auth.signOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/auth?mode=signup"
                    className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-red-700 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};