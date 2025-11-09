import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored session
    const storedToken = localStorage.getItem('pure_note_token');
    const storedUser = localStorage.getItem('pure_note_user');
    
    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-837fe92e/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!response.ok) {
        setLoading(false);
        return { success: false, error: result.error || "Erreur de connexion" };
      }

      // Store session
      localStorage.setItem('pure_note_token', result.access_token);
      localStorage.setItem('pure_note_user', JSON.stringify(result.user));
      
      setAccessToken(result.access_token);
      setUser(result.user);
      setLoading(false);
      
      return { success: true };
    } catch (error) {
      setLoading(false);
      console.error('Sign in error:', error);
      return { success: false, error: "Une erreur inattendue s'est produite" };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Use the backend server for signup
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-837fe92e/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password, name })
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || "Erreur lors de la création du compte" };
      }

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: "Une erreur inattendue s'est produite" };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('pure_note_token');
    localStorage.removeItem('pure_note_user');
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}