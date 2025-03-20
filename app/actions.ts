"use server"

import { eq } from 'drizzle-orm'

import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/database/db'
import { users } from '@/lib/database/schema'


// export type GamerData = {
//     id: number,
//     name: string | null,
//     age: number | null,
// }
export type UserData = {
    id: number,
    username: string,
    email: string,
    createdAt: Date | null,
}

// export async function getGamersWithoutChayas(): Promise<GamerData[] | undefined> {
//     try {
//         const chapterCardData = await db.select({
//             id: gamers.id,
//             name: gamers.name,
//             age: gamers.age,
//         }).from(gamers).where(
//             eq(gamers.numChayas, 0)
//         )
        
//         return chapterCardData;
//     } catch (e) {
//         console.log("Error while fetching")
//     }
// }

export async function listAllUsers(): Promise<UserData[] | undefined> {
    try {
        const data = await db.select({
            id: users.id,
            username: users.username,
            email: users.email,
            createdAt: users.created_at
        }).from(users);
        
        return data;
    } catch (e) {
        console.log("Error while fetching");
    }
}

export async function getUserById(id: number): Promise<UserData | undefined> {
    try {
        const data = await db.select({
            id: users.id,
            username: users.username,
            email: users.email,
            createdAt: users.created_at
        }).from(users).where(
            eq(users.id, id)
        ).limit(1);
        
        return data[0];
    } catch (e) {
        console.log("Error while fetching");
    }
}