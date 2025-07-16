

import { db } from "../index.js";
import { NewRefeshToken,refresh_tokens  } from "../schema.js";
import { eq, sql } from "drizzle-orm";

export async function createRefreshToken(refreshtoken: NewRefeshToken) {
  console.log(`This will create a new refresh token`)
  const [result] = await db
    .insert(refresh_tokens)
    .values(refreshtoken)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteRefreshToken(){
    const [result] = await db.delete(refresh_tokens).returning();
    return result;
}

export async function selectRefreshToken(userID:string){
  const [result] = await db.select().from(refresh_tokens).where(eq(refresh_tokens.user_id,userID))
  return result;
}

export async function revokeRefreshToken(refreshtoken:string) {
    const [result] = await db.update(refresh_tokens).set({revokedAt: sql`NOW()`}).where(eq(refresh_tokens.token, refreshtoken)).returning();
    return result;
}

export async function selectUserFromToken(token:string) {
    const [result] = await db.select().from(refresh_tokens).where(eq(refresh_tokens.token,token));
    return result
}