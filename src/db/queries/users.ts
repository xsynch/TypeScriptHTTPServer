import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
  console.log(`This is the create user function with ${user.email}`)
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteUsers(){
    const [result] = await db.delete(users).returning();
    return result;
}

export async function selectUserPass(email:string){
  const [result] = await db.select().from(users).where(eq(users.email,email))
  return result;
}


export async function selectEmailFromID(userID: string){
  const [result] = await db.select().from(users).where(eq(users.id,userID))
  return result;
}


export async function updateUserEmailAndPassword(userID: string, email: string, password: string){
  const [result] = await db.update(users).set({hashed_password: password, email: email}).where(eq(users.id, userID)).returning();
  return result;
}

export async function upgradeUserToChirpyRed(userID: string){
  const [result] = await db.update(users).set({is_chirpy_red: true}).where(eq(users.id, userID)).returning();
  return result;
}