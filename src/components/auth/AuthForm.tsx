import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff } from "lucide-react";

interface AuthFormProps {
  defaultMode?: 'login' | 'signup';
}

export const AuthForm = ({ defaultMode = 'login' }: AuthFormProps) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(defaultMode === 'login');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    verifyPassword?: string;
    fullName?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!fullName) {
        newErrors.fullName = "Full name is required";
      }
      
      if (password !== verifyPassword) {
        newErrors.verifyPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast.success("Welcome back!");
        navigate("/");
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth`,
          },
        });

        if (signUpError) throw signUpError;

        // Automatically sign in after signup
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        toast.success("Account created successfully!");
        navigate("/");
      }
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please check your email to confirm your account";
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/90 border-none shadow-xl transition-all duration-300 hover:shadow-2xl animate-fade-in">
      <CardHeader className="space-y-3 pb-6">
        <CardTitle className="text-2xl sm:text-3xl text-center font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          {isLogin ? "Welcome Back" : "Join TasteHaven"}
        </CardTitle>
        <p className="text-center text-gray-600">
          {isLogin ? "Sign in to your account" : "Create your account"}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: undefined });
              }}
              className={`bg-white/50 h-12 text-lg transition-all duration-200 focus:bg-white ${
                errors.email ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              disabled={isLoading}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-sm text-red-500 pl-1">{errors.email}</p>
            )}
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setErrors({ ...errors, fullName: undefined });
                }}
                className={`bg-white/50 h-12 text-lg transition-all duration-200 focus:bg-white ${
                  errors.fullName ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                disabled={isLoading}
                autoComplete="name"
              />
              {errors.fullName && (
                <p className="text-sm text-red-500 pl-1">{errors.fullName}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: undefined });
                }}
                className={`bg-white/50 h-12 text-lg pr-12 transition-all duration-200 focus:bg-white ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                disabled={isLoading}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 pl-1">{errors.password}</p>
            )}
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showVerifyPassword ? "text" : "password"}
                  placeholder="Verify Password"
                  value={verifyPassword}
                  onChange={(e) => {
                    setVerifyPassword(e.target.value);
                    setErrors({ ...errors, verifyPassword: undefined });
                  }}
                  className={`bg-white/50 h-12 text-lg pr-12 transition-all duration-200 focus:bg-white ${
                    errors.verifyPassword ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showVerifyPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.verifyPassword && (
                <p className="text-sm text-red-500 pl-1">{errors.verifyPassword}</p>
              )}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 text-lg bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              isLogin ? "Sign In" : "Create Account"
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full hover:bg-white/10 text-gray-700 hover:text-gray-900 transition-all duration-200"
            onClick={() => {
              setIsLogin(!isLogin);
              setPassword("");
              setVerifyPassword("");
              setErrors({});
            }}
            disabled={isLoading}
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};