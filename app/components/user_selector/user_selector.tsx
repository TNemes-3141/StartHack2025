import {Select, SelectItem} from "@heroui/react";
import { useState } from "react";
import { useEffect } from "react";
import { listAllUsers, UserData } from "@/app/actions";

function UserSelector() {

    const [users, setUsers]: any = useState([]);
    const [selectedId, setSelectedId] = useState(-1);
    
    useEffect(() => {
        const fetchUsers = async () => {
            const userData: UserData[] | undefined = await listAllUsers();
            if (userData) {
                setUsers(userData);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        console.log(selectedId);
    }, [selectedId]);

    const handleSelectionChange = (e:any) => {
        setSelectedId(e.target.value);
      };

    return (
        <div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                <Select onChange={handleSelectionChange} className="max-w-xs" label="Select a user">
                    {users.map((user: UserData) => (
                    <SelectItem key={user.id}>{user.username}</SelectItem>
                    ))}
                </Select>
            </div>
        </div>
    );
}

export default UserSelector;