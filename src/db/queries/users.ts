import { db } from "../index.js";
import { NewUser, users } from "../schema.js";

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