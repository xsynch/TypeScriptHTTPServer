
import {Request, Response} from "express";

import { createUser, deleteUsers, selectUserPass, upgradeUserToChirpyRed } from "../db/queries/users.js";
import { config } from "../config.js";
import { ForbiddenError, UnauthorizedError } from "./handleErrors.js";
import { getBearerToken, hashPassword, validateJWT } from "../middleware/auth.js";
import { NewUser } from "../db/schema.js";
import { updateUserEmailAndPassword } from "../db/queries/users.js";







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
            is_chirpy_red: userInfo.is_chirpy_red,
            
        }
        
        res.status(201).json({
            id: cleanedUser.id,
            email: cleanedUser.email,
            createdAt: cleanedUser.createdAt,
            updatedAt: cleanedUser.updatedAt,
            isChirpyRed: cleanedUser.is_chirpy_red
        });
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

export async function handlerUpdateUsers(req:Request, res:Response){

    const token = getBearerToken(req)
    type ParamsExpected = {
        email: string;
        password: string;
    }
    const params:ParamsExpected = req.body;
    const userJWTEmail = validateJWT(token, config.api.secret)
    
    // if (userJWTEmail !== params.email){
    //     console.log(`Email mismatch: ${userJWTEmail} and ${params.email}`)
    //     throw new UnauthorizedError("Unable to update the user's password")
    // }
    if(userJWTEmail){
        
        const fullUser = await selectUserPass(userJWTEmail)
        if(fullUser) {
            const newPassHash = hashPassword(params.password)
            const updatedUser = await updateUserEmailAndPassword(fullUser.id,params.email, newPassHash)
            if (updatedUser){
                res.status(200).json({
                    id: updatedUser.id,
                    email: updatedUser.email,
                    createdAt: updatedUser.createdAt,
                    updatedAt: updatedUser.updatedAt,
                    isChirpyRed: updatedUser.is_chirpy_red,
                })
            }else {
                throw new Error("Error updating the users password, Please try again")
            }
        }
        


    } else {
        throw new UnauthorizedError("Please try logging in again")
    }

}

export async function handlerUpgradeUsers(req:Request, res:Response){
    type ParamsExpected = {
        event: string,
        data: {
            userId: string,
        }
    };
    let params:ParamsExpected = req.body;
    if(params.event != "user.upgraded"){
        res.status(204).json({
            success: true,
        })
    } else {
        const result = await upgradeUserToChirpyRed(params.data.userId)
        if(result){
            res.status(204).json({
                id: result.id,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt,
                email: result.email,
                isChirpyRed: result.is_chirpy_red
            })
        }
    }
}