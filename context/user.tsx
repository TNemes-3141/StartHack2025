import { createContext, useContext, useState, ReactNode } from "react";
import { UserData } from "@/app/actions";

interface UserContextProps {
    user: UserData | null;
    setUser: (user: UserData | null) => void;
}

const UserContext = createContext<UserContextProps | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
}