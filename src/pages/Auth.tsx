import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { Header } from "@/components/layout/Header";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const mode = searchParams.get('mode');

  return (
    <div className="min-h-screen">
      <Header />
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/75"></div>
        <div className="relative z-10 w-full max-w-md mx-auto p-6">
          <AuthForm defaultMode={mode === 'signup' ? 'signup' : 'login'} />
        </div>
      </div>
    </div>
  );
};

export default Auth;