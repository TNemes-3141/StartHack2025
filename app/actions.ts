"use server"

import { eq } from 'drizzle-orm'

import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/database/db'
import { gamers } from '@/lib/database/schema'


export type GamerData = {
    id: number,
    name: string | null,
    age: number | null,
}

export async function getGamersWithoutChayas(): Promise<GamerData[] | undefined> {
    try {
        const chapterCardData = await db.select({
            id: gamers.id,
            name: gamers.name,
            age: gamers.age,
        }).from(gamers).where(
            eq(gamers.numChayas, 0)
        )
        
        return chapterCardData;
    } catch (e) {
        console.log("Error while fetching")
    }
}