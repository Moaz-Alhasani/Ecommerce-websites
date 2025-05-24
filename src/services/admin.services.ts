import express,{Request,Response,NextFunction, request} from "express"
import { prisma } from "../prisma";
import bcrypt from "bcrypt"
import { generateJwt } from "../globals/middlware/auth.middlware";
class AdminServices {
    public async register(requestBody: any) {
      const { name, email, password } = requestBody;
      const emailExists = await this.IsEmailAlreadyExist(email);
      if (emailExists) {
        throw new Error("Email is already registered.");
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newAdmin = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role:"ADMIN"
        },
      });

      const payload = {
            email:newAdmin.email,
            name: newAdmin.name,
            role: newAdmin.role,
            id: newAdmin.id
        };
        const token=await generateJwt(payload)
      return token;
    }
    public async AddCategory(requestBody:any){
      const{ name }=requestBody
      const newCategory=await prisma.category.create({
        data:{
          name
        }
      })
      return newCategory
    }
    public async updateCategory(requestBody: any, categoryId: number) {
      const { name } = requestBody;
      console.log(categoryId)
      const updatedCategory = await prisma.category.update({
        where: { id: categoryId },
        data: { name },
      });
      return updatedCategory;
    }

    public async removeCategory(categoryId: number) {
      const relatedProducts = await prisma.product.findMany({
        where: { categoryId },
      });

      if (relatedProducts.length > 0) {
        throw new Error('Cannot delete category with associated products');
      }

      const deletedCategory = await prisma.category.delete({
        where: { id: categoryId },
      });

      return deletedCategory;
    }

    public   async getAllCategories() {
        const categories = await prisma.category.findMany();
        return categories;
    }

    public async AddProduct(requestBody:any,newPhotoUrl: string | null){
      const {name, description,categoryId}=requestBody
      const post=await prisma.product.create({
        data:{
          name,
          description,
          imageUrl:newPhotoUrl || '',
          categoryId:parseInt(categoryId)
        }
      })
      return post;
    }
public async UpdateProduct(requestBody: any, productId: number) {
      const { name, description, imageUrl, categoryId } = requestBody;
      const existingProduct = await prisma.product.findUnique({
          where: { id: productId },
          select: {
            categoryId: true,
            imageUrl: true,
          }
      });

      if (!existingProduct) {
        throw new Error('Product not found');
      }
      const resolvedCategoryId = categoryId ? parseInt(categoryId) : existingProduct.categoryId;
      const resolvedImageUrl = imageUrl || existingProduct.imageUrl;
      const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
              name,
              description,
              imageUrl: resolvedImageUrl,
              category: {
                connect: {
                  id: resolvedCategoryId,
                },
              },
              updatedAt: new Date(),
            }
      });

    return updatedProduct;
  }


        
    public async RemoveProduct(productId: number) {
      await prisma.product.delete({
        where: { id: productId }
      });
    }
    

    public   async getAllProduct() {
        const product = await prisma.product.findMany();
        return product;
    }


    private async IsEmailAlreadyExist(email: string): Promise<boolean> {
      const user = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      return !!user;
    }
  }
export const adminservices:AdminServices=new AdminServices();