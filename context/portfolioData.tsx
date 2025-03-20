import { createContext, useContext, useState, ReactNode } from "react";
import { PortfolioData } from "@/app/actions";

interface PortfolioDataContextProps {
    portfolioData: PortfolioData[] | null;
    setPortfolioData: (user: PortfolioData[] | null) => void;
}

const PortfolioDataContext = createContext<PortfolioDataContextProps | null>(null);

export function PortfolioDataProvider({ children }: { children: ReactNode }) {
    const [portfolioData, setPortfolioData] = useState<PortfolioData[] | null>(null);
    return (
        <PortfolioDataContext.Provider value={{ portfolioData, setPortfolioData }}>
            {children}
        </PortfolioDataContext.Provider>
    );
}

export function usePortfolioDataContext() {
    const context = useContext(PortfolioDataContext);
    if (context === undefined) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
}