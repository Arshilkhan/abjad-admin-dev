import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type AuthContextType = {
  isAuthenticated: boolean;
  isPlatformAdmin: boolean;
  isLoading: boolean;
  authError: string;
  login: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const apiBaseUrl = (
  import.meta.env.VITE_PLATFORM_ADMIN_API_URL as string | undefined
)?.replace(/\/+$/, "");

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlatformAdmin, setIsPlatformAdmin] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) setSession(nextSession);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;

      if (error) setAuthError("Could not restore your login session.");
      setSession(data.session);
      setSessionReady(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!sessionReady) return;

    let cancelled = false;

    const verifyPlatformAdmin = async () => {
      setIsLoading(true);
      setIsPlatformAdmin(false);
      setAuthError("");

      if (!session) {
        setIsLoading(false);
        return;
      }

      if (!isSupabaseConfigured) {
        setAuthError("Supabase is not configured for this deployment.");
        setIsLoading(false);
        return;
      }

      if (!apiBaseUrl) {
        setAuthError("The platform authorization API is not configured.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${apiBaseUrl}/api/admin/organizations`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              Accept: "application/json",
            },
            cache: "no-store",
          },
        );

        if (cancelled) return;

        if (response.status === 401 || response.status === 403) {
          setAuthError(
            "This account is not authorized to access Platform Admin.",
          );
          return;
        }

        if (!response.ok) {
          setAuthError(
            `Could not verify platform access (HTTP ${response.status}).`,
          );
          return;
        }

        setIsPlatformAdmin(true);
      } catch {
        if (!cancelled) {
          setAuthError(
            "Could not reach the platform authorization API. Check the API URL and CORS configuration.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void verifyPlatformAdmin();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, sessionReady]);

  const login = useCallback(
    async (email: string, password: string) => {
      if (!isSupabaseConfigured) {
        return {
          error: "Supabase is not configured. Check the deployment environment variables.",
        };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      return { error: error?.message ?? null };
    },
    [],
  );

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error("Could not sign out. Please try again.");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(session),
        isPlatformAdmin,
        isLoading: !sessionReady || isLoading,
        authError,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
