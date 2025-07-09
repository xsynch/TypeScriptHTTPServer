
import {Request, Response} from "express";

import { createUser, deleteUsers } from "../db/queries/users.js";
import { config } from "../config.js";
import { ForbiddenError } from "./handleErrors.js";





export async function handlerUsers(req:Request,res:Response){
    type parameters = {
        email:string;
    }
    const params:parameters = req.body

    if (params.email){
        
        const userInfo = await createUser({email: params.email})
        if (!userInfo) {
            throw new Error("User Not Created")
        }

        
        res.status(201).json(userInfo);
    } else {
        throw new Error("Email address not part of data")
    }

}

export async function handlerResetUsers(){
    if (config.api.platform === "dev"){
        const results = await deleteUsers()        
    } else {
        throw new ForbiddenError("Not the development Environment")
    }
    
}