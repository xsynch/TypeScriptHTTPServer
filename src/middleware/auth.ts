import { compare, hash, genSalt, hashSync, compareSync } from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import {  randomBytes } from "node:crypto";


import { UnauthorizedError } from "../api/handleErrors.js";


type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function hashPassword(password: string): string {
    
    const saltrounds = 10;
    
    return hashSync(password, saltrounds);

}

export  function checkPasswordHash(password: string, hash: string){
    return compareSync(password,hash)
}

export function validateJWT(tokenString: string, secret: string): string {
    let resultPayload:payload
    try {
        resultPayload = jwt.verify(tokenString, secret) as payload 

        
    } catch (error){
        
            throw new UnauthorizedError(`Could not validate token: ${tokenString}`)
        
    }
    
    return resultPayload.sub as string 
}


export function makeJWT(userID: string, expiresIn: number, secret: string): string{
    const userPayload: payload = {
        iss: "chirpy",
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
        
    }
    userPayload.exp = userPayload.iat? userPayload.iat + expiresIn: expiresIn
    const token = jwt.sign(userPayload,secret)
    
    
    return token 
}

export function getBearerToken(req: Request): string {
    const authHeader = req.get('Authorization');
    
    let token:string = "";
    if(authHeader){
        token = authHeader.split(" ")[1]
        if (token) {
            return token
        } else {
            throw new UnauthorizedError(`Invalid Token with this header: ${authHeader}`)
        }
    } else {
        throw new UnauthorizedError("Authorization Required")
    }
    
}

export function makeRefreshToken(){
    const buf = randomBytes(32);
    const hexString = buf.toString('hex')
    
    return hexString;
}

export function getAPIKey(req: Request){
    const authHeader = req.get('Authorization')
    let authKey: string = "";
    if(authHeader){
        const apiHeader = authHeader.split(" ")
        if(!apiHeader || apiHeader[0].toLocaleLowerCase() !== "apikey"){
            throw new UnauthorizedError("Invalid Apikey")
        } else {
            return apiHeader[1];
        }
    }
}