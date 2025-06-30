import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();
export const ProductController = {
    create : async (req , res) =>{
        try{

            const qty = req.body.qty;
            if(qty > 1000){
                res.status(400).json({error : "Quantity must be less than 1000"})
                return;
            }
            for(let i = 0 ; i < qty ; i++){
                await prisma.product.create({
                    data :{
                        serial : req.body.serial,
                        release : req.body.release,
                        name : req.body.name,
                        price : req.body.price,
                        color : req.body.color,
                        customerName : req.body.customerName,
                        customerPhone : req.body.customerPhone,
                        customerAddress : req.body.customerAddress,
                        remark : req.body.remark
                    }
                })
            }

            res.json({ message : "Create Product Successfully"})
        }catch(error){
            res.status(500).json({error : error.message})
        }
    },
    list : async (req , res) =>{
        try {
            const products = await prisma.product.findMany({
                where : {
                    status : {
                        not : "delete"
                    }
                },
                orderBy:{
                    id : "desc",
                },
            });
            res.json(products);
        } catch (error) {
            res.status(500).json({error : error.message});
        }
    },
    update : async (req , res) =>{
        try {
            await prisma.product.update({
                where : { id : req.params.id},
                data : {
                        serial : req.body.serial,
                        release : req.body.release,
                        name : req.body.name,
                        price : req.body.price,
                        color : req.body.color,
                        customerName : req.body.customerName,
                        customerPhone : req.body.customerPhone,
                        customerAddress : req.body.customerAddress,
                        remark : req.body.remark
                }

            })
            res.json({message : "Update success"})
        } catch (error) {
            res.status(500).json({error : error.message});
        }
    },
    remove : async ( req , res) =>{
        try {
            await prisma.product.update({
                where : { id : req.params.id},
               data : { status : "delete"}

            })
            res.json({message : "Delete success"})
        } catch (error) {
            res.status(500).json({error : error.message});
        }
    }
}