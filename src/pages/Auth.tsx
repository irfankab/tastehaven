import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/75"></div>
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;