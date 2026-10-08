import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

type AuthContextType = {
    isAuthenticated: boolean;
    login: (email: string, password: string) => boolean;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "abjad_admin_authenticated";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem(STORAGE_KEY) === "true";
    });

    useEffect(() => {
        if (isAuthenticated) {
            localStorage.setItem(STORAGE_KEY, "true");
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [isAuthenticated]);

    const login = (email: string, password: string) => {
        // Static authentication for development.
        // Any non-empty email/password is accepted.
        if (!email.trim() || !password.trim()) {
            return false;
        }

        setIsAuthenticated(true);
        return true;
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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