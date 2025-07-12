import { compare, hash, genSalt, hashSync, compareSync } from "bcrypt"

export function hashPassword(password: string): string {
    
    const saltrounds = 10;
    
    return hashSync(password, saltrounds);

}

export  function checkPasswordHash(password: string, hash: string){
    return compareSync(password,hash)
}

