import {Request, Response} from "express"
import { BadRequestError, UnauthorizedError } from "./handleErrors.js";
import { checkPasswordHash, makeJWT } from "../middleware/auth.js";
import { selectUserPass } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { config } from "../config.js";

export async function handlerLogin(req:Request, res:Response){
    type ParamsExpected = {
        password: string;
        email: string;
        expiresInSections?: number;
    }

    type cleanedUser = Partial<Omit<NewUser,"hashed_password">>
    
    let token:string = "";
    
    let params:ParamsExpected = req.body;
    // console.log(`Looking for user: ${params.email}`)
    const userCheck = await selectUserPass(params.email);
    if (!userCheck){
        console.log(`User: ${params.email} not found`)
        throw new Error("Email address not found")
    }
    if(params.email && params.password){
        const passCheck = checkPasswordHash(params.password, userCheck.hashed_password)
        if(passCheck){
            if(!params.expiresInSections || params.expiresInSections > 3600){
                    params.expiresInSections = 3600;
            }
            token = makeJWT(params.email, params.expiresInSections,config.api.secret)
            // console.log(`Token created for ${params.email}: ${token}`)
            let cleanUser:cleanedUser = {
                id: userCheck.id,
                createdAt: userCheck.createdAt,
                updatedAt: userCheck.updatedAt,
                email: userCheck.email,
                
            }
            
            
            
            res.status(200).json({id: userCheck.id,
                createdAt: userCheck.createdAt,
                updatedAt: userCheck.updatedAt,
                email: userCheck.email,
                token: token,
            })

        } else {
            throw new UnauthorizedError("Please check your email or password")
        }

    } else {
        throw new BadRequestError("Email and password needed")
    }

}