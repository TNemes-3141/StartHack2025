import {Select, SelectItem} from "@heroui/react";
import { useState } from "react";
import { useEffect } from "react";
import { fetchUserPortfolios, getUserById, listAllUsers, UserData } from "@/app/actions";
import { usePortfolioDataContext } from "@/context/portfolioData";
import { cn } from "@/lib/utils";

function UserSelector( {className}: {className?: string}) {

    const [userList, setUserList]: any = useState([]);
    const [selectedId, setSelectedId] = useState(-1);
    const portfolioDataContext = usePortfolioDataContext();
    if (!portfolioDataContext) {
        return null;
    }
    const {portfolioData, setPortfolioData} = portfolioDataContext;
    
    useEffect(() => {
        const fetchUsers = async () => {
            const userData: UserData[] | undefined = await listAllUsers();
            if (userData) {
                setUserList(userData);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        console.log(selectedId);
    }, [selectedId]);

    const handleSelectionChange = (e:any) => {
        setSelectedId(e.target.value);
        fetchUserPortfolios(e.target.value).then((portfolios) => {
            if (portfolios == undefined) {
                console.error("porfolio is undefined");
                return
            }
            
            console.log(portfolios);
            setPortfolioData(portfolios);
        }).catch((error) => {
            console.error(error);
        });
      };

    return (
        <div className={cn(className)}>
            <div className="flex flex-wrap gap-4 max-h-12 w-64">
            <Select onChange={handleSelectionChange} className="w-full [&>div>button]:min-h-10 [&>div>button]:h-10" label="Select a portfolio">
                {userList.map((user: UserData) => (
                <SelectItem key={user.id}>{user.username}</SelectItem>
                ))}
            </Select>
            </div>
        </div>
    );
}

export default UserSelector;