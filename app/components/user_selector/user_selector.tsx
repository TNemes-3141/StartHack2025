import {Select, SelectItem} from "@heroui/react";
import { useState } from "react";
import { useEffect } from "react";
import { getUserById, listAllUsers, UserData } from "@/app/actions";
import { useUserContext } from "@/context/user";

function UserSelector() {

    const [userList, setUserList]: any = useState([]);
    const [selectedId, setSelectedId] = useState(-1);
    const userContext = useUserContext();
    if (!userContext) {
        return null;
    }
    const {user, setUser} = userContext;
    
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
        getUserById(e.target.value).then((data) => {
            if (data == undefined) {
                console.error("undefined")
                return;
            }
            setUser(data);
        }).catch(e => {console.error(e)});
      };

    return (
        <div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                <Select onChange={handleSelectionChange} className="max-w-xs" label="Select a user">
                    {userList.map((user: UserData) => (
                    <SelectItem key={user.id}>{user.username}</SelectItem>
                    ))}
                </Select>
            </div>
        </div>
    );
}

export default UserSelector;