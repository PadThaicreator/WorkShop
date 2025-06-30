import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
const { json } = bodyParser;
const  prisma = new PrismaClient();

dotenv.config();


export const UserController = {
        signIn : async (req , res) =>{
           
            try{
                console.log("signIn Called")
                
                const username = req.body.username;
                const password = req.body.password;

                console.log("In 📦 req.body:", req.body); // 👈 เช็กตรงนี้
                const user = await prisma.user.findFirst({
                    where : { 
                        username :username,
                        password :password,
                        status : "active"
                    }
                });

                console.log("OutSide")
                // console.log("user : " , user)
                if(!user){
                    return res.status(401).json({message : "Invalid username or password"});
                }
    
                const token =jwt.sign({id : user.id} , process.env.SECRET_KEY,{ expiresIn : "7d"});
                res.json({token: token || ""});
            }catch (error){
                console.error("❌ SERVER ERROR:", error); // สำคัญมาก!!
                res.status(500).json({error : error.message});
            }
        },
        info : async ( req ,res) =>{
            try{
                const headers = req.headers.authorization
                const token = headers.split(" ")[1];
                const decoded = jwt.verify(token , process.env.SECRET_KEY);
                const user = await prisma.user.findFirst({
                    where : {id : decoded.id},
                    select : {
                        name : true,
                        level : true,
                        username : true,
                        password : true,
                    }
                })
                res.json(user)
            }catch (error){
               res.status(500).json({error : error.message});
            }
        },
        update : async ( req ,res ) =>{
          
            try {
                console.log("In Update req.body:", req.body);
                const headers = req.headers.authorization
                const token = headers.split(" ")[1];
                const decoded = jwt.verify(token , process.env.SECRET_KEY);
                const conUser = await prisma.user.findFirst({
                    where : {id : decoded.id},
                });
                const newPassword = req.body.password !== undefined ? req.body.password : conUser.password

                const user = await prisma.user.update({
                    where : {id : decoded.id},
                    data : {
                        name : req.body.name,
                        username : req.body.username,
                        password : newPassword
                    }
                });
                res.json({message : "Success"})
            } catch (error) {
                console.error("❌ Error in update:", error);
                res.status(500).json({error : error.message});
            }
        },
        list : async (req ,res) =>{
            try {
                const users = await prisma.user.findMany({
                    where : {
                        status : "active"
                    },
                    orderBy : {
                        id : "desc"
                    }
                });
                res.json(users)
            } catch (error) {
                res.status(500).json({error : error.message});
            }
        },
        updateUser: async (req, res) => {
          try {
            console.log("IN")
            const user = await prisma.user.findFirst({
              where : {
                username : req.body.username
              }
            })
            if(user){
              return res.status(401).json({message : "Username already exists"});
            }
            await prisma.user.update({
              where: {
                id: req.params.id,
              },
              data: {
                name : req.body.name,
                username : req.body.username,
                level : req.body.level,
                password :  req.body.password
              },
            });
            res.json({ message: "Success" });
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        },
        remove: async (req, res) => {
          try {
            await prisma.user.update({
              where: {
                id: req.params.id,
              },
              data : {
                status : "inactive"
              }
            });
            res.json({ message: "Success" });
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        },
        create : async (req,res) =>{
          try {
            console.log("IN create user" , req.body)
            const user = await prisma.user.findFirst({
              where : {
                username : req.body.username
              }
            })
            if(user){
              return res.status(401).json({message : "Username already exists"});
            }
            await prisma.user.create({
              data : {
                name : req.body.name,
                username : req.body.username,
                password : req.body.password,
                level : req.body.level,

              }
            })
            console.log("IN create user")
            res.json({message : "Success"})
          } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message });
          }
        }
    }

