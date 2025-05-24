import express, { Application } from 'express'
import adminRouter from '../../features/adminDashborad/router/adminRouter'
import authRouter from '../../features/userauth/router/router'

const appRouter=(app:Application)=>{
    app.use('/api/v1/admin',adminRouter)
    app.use('/api/v2/auth',authRouter)
}
export default appRouter