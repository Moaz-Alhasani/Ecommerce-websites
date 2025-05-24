class User_Auth_Services{


    public async google_auth_redirect(req:any,res:any):Promise<void>{
        res.redirect('/profile/')
    }

    public async profilepage(req:any,res:any){
        res.render('views',{user:req.user})
    }
}

export  const user_auth_services:User_Auth_Services=new User_Auth_Services();