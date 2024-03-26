import React, { createContext, useContext, useEffect, useState } from "react";
import supabase from '../supabase.ts';
import {AuthContextType, User} from "../types.ts";

/**
 * Create a context with an initial undefined value. This will be overridden with an actual value in the provider.
 * Manage user authentication state and provide authentication methods throughout the component tree.
 */
const AuthContext = createContext<AuthContextType | null>(null);

type AuthContextProviderProps = {
    children: React.ReactNode;
};

/**
 * Providing authentication-related functionality to its children components.
 * Maintains the user state, representing the currently authenticated user, using the useState hook.
 */
export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    /**
     * Event listener for authentication state changes when the component mounts.
     * Listens for changes in the authentication state (user authentication status) and updates the user state accordingly.
     */
    useEffect(() => {
        // This effect sets the user on mount and listens for auth state changes.
        const { data: { subscription, } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    /**
     * Handle user authentication actions using Supabase methods.
     */
    const signUp = async (email: string, password: string): Promise<void> => {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) console.error("Error signing up:", error.message);

    };

    const logIn = async (email: string, password: string): Promise<void> => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) console.error("Error signing in:", error.message);
    };

    const logOut = async (): Promise<void> => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Error signing out:", error.message);
    };

    /**
     * Wraps its children with the authentication context value containing the authentication methods and the user state.
     */
    return (
        <AuthContext.Provider value={{ signUp, logIn, logOut, user }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook for accessing the authentication auth.
 * @returns The authentication auth, using the useContext hook.
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthContextProvider");
    return context;
};
