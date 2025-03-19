"use client"

import { useState } from "react";
import { getGamersWithoutChayas, GamerData } from "@/app/actions";

import { Button } from "@heroui/button";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue } from "@heroui/table";


export function SupabaseTestButton() {
    const [gamers, setGamers] = useState<GamerData[]>([])

    const getGamersFromDatabase = async () => {
        const gamersWithoutChayas = await getGamersWithoutChayas();
        if (gamersWithoutChayas) {
            setGamers(gamersWithoutChayas);
        }
    }

    return <div className="flex flex-col gap-5">
        <Button color="primary" onPress={getGamersFromDatabase}>See all gamers without chayas</Button>
        {gamers.length !== 0 ? <Table>
            <TableHeader>
                <TableColumn key={"name"}>NAME</TableColumn>
                <TableColumn key={"age"}>AGE</TableColumn>
            </TableHeader>
            <TableBody items={gamers}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table> : <></>}
    </div>
}