import { eq,asc } from "drizzle-orm";
import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
//   console.log(`This is the create chirp function with ${chirp.body}`)
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteChirp(){
    const [result] = await db.delete(chirps).where(eq(chirps.id,""));
    return result;
}

export async function getAllChirps(){
    const result = await db.select().from(chirps).orderBy(asc(chirps.createdAt));
    return result;
}