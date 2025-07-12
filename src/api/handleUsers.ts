
import {Request, Response} from "express";

import { createUser, deleteUsers } from "../db/queries/users.js";
import { config } from "../config.js";
import { ForbiddenError } from "./handleErrors.js";
import { hashPassword } from "../middleware/auth.js";
import { NewUser } from "../db/schema.js";






export async function handlerUsers(req:Request,res:Response){
    type parameters = {
        password: string;
        email:string;
    }
    const params:parameters = req.body

    if (params.email && params.password){
        
        const userInfo = await createUser({email: params.email,
            hashed_password :hashPassword(params.password)
        })
        if (!userInfo) {
            throw new Error("User Not Created")
        }
        type CleanUser = Omit<NewUser,"hashed_password">
        let cleanedUser:CleanUser = {
            email: userInfo.email,
            id: userInfo.id,
            createdAt: userInfo.createdAt,
            updatedAt: userInfo.updatedAt,
        }
        
        res.status(201).json(cleanedUser);
    } else {
        throw new Error("Email and Password needed to create a user")
    }

}

export async function handlerResetUsers(){
    if (config.api.platform === "dev"){
        const results = await deleteUsers()        
    } else {
        throw new ForbiddenError("Not the development Environment")
    }
    
}