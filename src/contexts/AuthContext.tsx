import {
    createContext,
    ReactNode,
    useEffect,
    useState,
} from 'react'
import { loginService } from '../services/loginService';
import { LoginGetResponse } from '../types/auth';
import { set } from 'zod';
import toast from 'react-hot-toast';

interface AuthContextType {
    user: LoginGetResponse['user'] | null;
    loading: boolean;
    error: string;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}
interface AuthProviderProps {
    children: ReactNode;
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<LoginGetResponse['user'] | null>(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect (() => {
    
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    const login = async (email: string, password: string) => {
        setLoading(true);
        setError("");
        try {
            const response = await loginService.login({ email, password });
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
            toast.success('Inicio de sesión exitoso');
            return true;
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
            return false;
        } finally {
            setLoading(false);
        }
    };
    const logout = async() => {
        if(!user) return;
        setLoading(true);
        try {

            await loginService.logout(user?.email);
            setUser(null);
            localStorage.removeItem('user');
        } catch (error) {
            console.log(error);
        }
    };
    const value: AuthContextType = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
