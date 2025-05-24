import { Request,Response,NextFunction } from "express";
import { UNAUTHORIZED_Exception,  forbiddenExcption} from "./error.middlware";
import jwt from "jsonwebtoken";
import { USERPAYLOAD } from "../../type";
import { string } from "joi";
import { prisma } from "../../prisma";


export function generateJwt(pyload:any){
    return jwt.sign(pyload,process.env.JWT_SECRET!,{expiresIn:'1d'})
}

export function vrefiyUser(req:Request,res:Response,next:NextFunction){
    if (!req.headers['authorization'] || !req.headers['authorization'].startsWith('Bearer')){
        throw new UNAUTHORIZED_Exception('Token is invlaid , please login agin')
    }
    const token=req.headers['authorization'].split(' ')[1]
    try{
        const userDecoded=jwt.verify(token,process.env.JWT_SECRET!) as USERPAYLOAD
        req.currentuser=userDecoded
        next();
    }
    catch(error){
        throw new UNAUTHORIZED_Exception('Token is invlaid , please login agin')
    }
}

export const checkPermission = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.currentuser?.role;
        if (!userRole || !roles.includes(userRole)) {
            throw new forbiddenExcption ('YOU ARE NOT ALLOWED');
        }
        next();
    }
};