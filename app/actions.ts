"use server"

import { eq } from 'drizzle-orm'

import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/database/db'
import { users, portfolioAssets, portfolios } from '@/lib/database/schema'

export type UserData = {
    id: number,
    username: string,
    email: string,
    createdAt: Date | null,
}

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

export type PortfolioData = {
    id: number;
    name: string;
    created_at: Date | null;
    assets: {
      id: number;
      asset_type: string | null;
      symbol: string | null;
      quantity: number;
      purchase_price: number;
      purchase_date: Date | null;
      up_by: number | null;
    }[];
  };

  export async function fetchUserPortfolios(userId: number): Promise<PortfolioData[] | undefined> {
    const results = await db
      .select({
        portfolioId: portfolios.id,
        name: portfolios.name,
        created_at: portfolios.created_at,
        assetId: portfolioAssets.id,
        asset_type: portfolioAssets.asset_type,
        symbol: portfolioAssets.symbol,
        quantity: portfolioAssets.quantity,
        purchase_price: portfolioAssets.purchase_price,
        purchase_date: portfolioAssets.purchase_date,
        up_by: portfolioAssets.up_by,
      })
      .from(portfolios)
      .leftJoin(portfolioAssets, eq(portfolios.id, portfolioAssets.portfolio_id))
      .where(eq(portfolios.user_id, userId));
  
    if (!results.length) return undefined;
  
    // Group assets by portfolio
    const portfoliosMap = new Map<number, PortfolioData>();
  
    results.forEach((row) => {
      if (!portfoliosMap.has(row.portfolioId)) {
        portfoliosMap.set(row.portfolioId, {
          id: row.portfolioId,
          name: row.name,
          created_at: row.created_at,
          assets: [],
        });
      }
  
      if (row.assetId) {
        portfoliosMap.get(row.portfolioId)?.assets.push({
          id: row.assetId,
          asset_type: row.asset_type,
          symbol: row.symbol,
          quantity: Number(row.quantity), // Convert decimal to number
          purchase_price: Number(row.purchase_price), // Convert decimal to number
          purchase_date: row.purchase_date,
          up_by: row.up_by ? Number(row.up_by) : null, // Convert decimal to number
        });
      }
    });
  
    return Array.from(portfoliosMap.values());
  }