import express, { Application } from 'express'
import { asyncWapper } from '../../../globals/middlware/error.middlware';
import { validateSchema } from '../../../globals/middlware/validate.middlware';
import upload from '../../../globals/constants/mluter';
import { checkPermission, vrefiyUser } from '../../../globals/middlware/auth.middlware';
import { authcontrollers } from '../controller/auth';


const authRouter=express.Router();
authRouter.post('/login-admin',asyncWapper(authcontrollers.sing_inAdmin))
authRouter.post('/login',asyncWapper(authcontrollers.sing_in))



export default authRouter