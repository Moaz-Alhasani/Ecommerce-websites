import express,{Request,Response,NextFunction} from "express"
import { adminservices } from "../../../services/admin.services";
import { HTTB_STATUS } from "../../../globals/constants/http";
import { date } from "joi";
class AdminControllers{
    public async addAdmin(req:Request,res:Response,next:NextFunction){
        const token=await adminservices.register(req.body)
        res.status(HTTB_STATUS.OK).json({
            message:"Admin Add successfly",
            date:token
        })   
    }
    public async addCategory(req:Request,res:Response,next:NextFunction){
        const category=await adminservices.AddCategory(req.body)
        res.status(HTTB_STATUS.OK).json({
            message:"category Add successfly",
            date:category
        }) 
    }
    public async editCategory(req: Request, res: Response, next: NextFunction) {
          const updated = await adminservices.updateCategory(req.body, Number(req.params.id));
          res.status(HTTB_STATUS.OK).json({
            message: "Category updated successfully",
            data: updated
          });
      }
    
      public async deleteCategory(req: Request, res: Response, next: NextFunction) {
             await adminservices.removeCategory(Number(req.params.id));
          res.status(HTTB_STATUS.OK).json({
            message: "Category deleted successfully",
          });
      }
    
      public async getAllGategory(req: Request, res: Response, next: NextFunction) {
          const categories = await adminservices.getAllCategories();
          res.status(HTTB_STATUS.OK).json({
            message: "Categories retrieved successfully",
            data: categories,
          });
      }

    public async addProduct(req:Request,res:Response,next:NextFunction){
        const pohto=req.file ?req.file.path:null
        console.log(pohto)
        const product=await adminservices.AddProduct(req.body,pohto)
        res.status(HTTB_STATUS.OK).json({
            message: "product Add successfully",
            data: product,
          });
    }
    
  public async EditProduct(req: Request, res: Response, next: NextFunction) {
      const imageUrl = req.file ? req.file.path : undefined;

      const updateProduct = await adminservices.UpdateProduct(
        { ...req.body, imageUrl },
        Number(req.params.id)
      );

      res.status(HTTB_STATUS.OK).json({
        message: "product updated successfully",
        data: updateProduct,
      });
  }
    
    public async deleteProduct(req:Request,res:Response,next:NextFunction){
        await adminservices.RemoveProduct(Number(req.params.id))
        res.status(HTTB_STATUS.OK).json({
            message: "product Deleted successfully",
          });
    }



  public async getAllProduct(req: Request, res: Response, next: NextFunction) {
      const product = await adminservices.getAllProduct();
        res.status(HTTB_STATUS.OK).json({
            message: "Product retrieved successfully",
            data: product,
          });
      }
}

export const admincontrollers:AdminControllers=new AdminControllers();