import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
const { json } = bodyParser;
const  prisma = new PrismaClient();

dotenv.config();


export const SellController = {
        create : async ( req , res) =>{
            try {
                const serial = req.body.serial;
                const product = await prisma.product.findFirst({
                    where : {serial : serial,
                            status : 'instock'
                    }
                })

                if(!product){
                    res.status(400).json({message : "Product Not Found"})
                    return;
                }

                await prisma.sell.create({
                    data: {
                        productId : product.id,
                        // product : product.name,
                        price : req.body.price,
                        status : "pending",
                        payDate : new Date()
                    }
                });

                res.json({message : "success"});
            } catch (error) {
                res.status(500).json({message : error.message})
            }
        },
        list: async (req , res) =>{
            try{
                const sell = await prisma.sell.findMany({
                    where : {
                        status : 'pending'
                    },
                    orderBy :{
                        id : 'desc'
                    },
                    include :{
                        product : true
                    }
                    
                });
                res.json(sell);
            }catch (error){
                res.status(500).json({ error : error.message})
            }
        },
        remove : async ( req , res) =>{
            try {
                await prisma.sell.delete({
                    where : { id : req.params.id},
                  
    
                })
                res.json({message : "Delete success"})
            } catch (error) {
                res.status(500).json({error : error.message});
            }
        },
        confirm : async (req ,res) =>{
            try {
                const sells = await prisma.sell.findMany({
                    where : {
                        status : 'pending'
                    }
                })
                for(const sell of sells){
                    await prisma.product.update({
                        data : {
                            status : 'sold'
                        },
                        where : {
                            id : sell.productId
                        }
                    })
                }

                 await prisma.sell.updateMany({
                    where : {
                        status : 'pending'
                    },
                    data : {
                        status : 'paid',
                        payDate : new Date()
                    }
                    
                })
                
                res.json({message : "Update Success"})
            } catch (error) {
                res.status(500).json({error : error.message});
            }
        },
        dashboard : async (req,res) =>{
            try {
                const income  = await prisma.sell.aggregate({
                    _sum :{
                        price : true
                    },
                    where :{
                        status : 'paid'
                    }
                })

                const Repair = await prisma.service.count();
                const countSell = await prisma.sell.count({
                    where : {
                        status : 'paid'
                    }
                });

                return res.json({
                    totalIncome : income._sum.price,
                    totalRepair : Repair,
                    totalSale : countSell
                });

            } catch (error) {
                res.status(500).json({error : error.message});
            }
        }
}

