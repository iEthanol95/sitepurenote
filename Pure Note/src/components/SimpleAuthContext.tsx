import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface SimpleAuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

export function SimpleAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('pure_note_user');
    const storedToken = localStorage.getItem('pure_note_token');
    const rememberMe = localStorage.getItem('pure_note_remember_me') === 'true';
    
    if (storedUser && storedToken && rememberMe) {
      try {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedToken);
      } catch (error) {
        localStorage.removeItem('pure_note_user');
        localStorage.removeItem('pure_note_token');
        localStorage.removeItem('pure_note_remember_me');
      }
    } else if (!rememberMe) {
      // Clear session if remember me is false
      localStorage.removeItem('pure_note_user');
      localStorage.removeItem('pure_note_token');
      localStorage.removeItem('pure_note_remember_me');
    }
  }, []);

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    try {
      setLoading(true);
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-837fe92e/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      if (!response.ok) {
        setLoading(false);
        return { success: false, error: result.error || "Erreur de connexion" };
      }

      // Store session
      localStorage.setItem('pure_note_token', result.access_token);
      localStorage.setItem('pure_note_user', JSON.stringify(result.user));
      localStorage.setItem('pure_note_remember_me', rememberMe.toString());
      
      setUser(result.user);
      setAccessToken(result.access_token);
      setLoading(false);
      
      return { success: true };
    } catch (error) {
      clearTimeout(timeoutId);
      setLoading(false);
      console.error('Sign in error:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, error: "La connexion a expiré. Veuillez réessayer." };
      }
      return { success: false, error: "Une erreur inattendue s'est produite" };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    try {
      setLoading(true);
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-837fe92e/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password, name }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      if (!response.ok) {
        setLoading(false);
        return { success: false, error: result.error || "Erreur lors de la création du compte" };
      }

      setLoading(false);
      return { success: true };
    } catch (error) {
      clearTimeout(timeoutId);
      setLoading(false);
      console.error('Signup error:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, error: "La création du compte a expiré. Veuillez réessayer." };
      }
      return { success: false, error: "Une erreur inattendue s'est produite" };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('pure_note_token');
    localStorage.removeItem('pure_note_user');
    localStorage.removeItem('pure_note_remember_me');
    setUser(null);
    setAccessToken(null);
  };

  return (
    <SimpleAuthContext.Provider value={{ user, accessToken, loading, signIn, signUp, signOut }}>
      {children}
    </SimpleAuthContext.Provider>
  );
}

export function useSimpleAuth() {
  const context = useContext(SimpleAuthContext);
  if (context === undefined) {
    throw new Error("useSimpleAuth must be used within a SimpleAuthProvider");
  }
  return context;
}