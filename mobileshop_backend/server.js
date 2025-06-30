import express from 'express';
import cors from 'cors';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { UserController } from './controllers/UserController.js';
import { CompanyComtroller }  from './controllers/CompanyController.js';
import { ProductController } from './controllers/ProductController.js';
import { SellController } from './controllers/SellController.js';
import { ServiceController } from './controllers/ServiceController.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
  res.send('helloWorld');
});


app.get("/check-db-connection" , async (req , res)=>{
  try{
      await prisma.$connect();
      res.send({ message : "Connect to DataBase" });

  }catch(error){
      
      console.log("Error : ", error.message)
      res.status(500).send({error : error.message})
  }
});

//User
app.post('/api/user/signin', UserController.signIn);
app.get('/api/user/info' , UserController.info);
app.put('/api/user/update' , UserController.update);
app.get('/api/user/list' , UserController.list);
app.put('/api/user/delete/:id' , UserController.remove);
app.put('/api/user/updateUser/:id' , UserController.updateUser);
app.post('/api/user/create' , UserController.create);
//company

app.post('/api/company/create' , CompanyComtroller.create);
app.get('/api/company/list' , CompanyComtroller.list);

//product

app.post('/api/buy/create' , ProductController.create);
app.get('/api/buy/list' , ProductController.list);
app.put('/api/buy/update/:id' , ProductController.update);
app.put('/api/buy/delete/:id' , ProductController.remove);



//sell

app.post('/api/sell/create', SellController.create)
app.get('/api/sell/list', SellController.list)
app.delete('/api/sell/delete/:id' , SellController.remove);
app.put('/api/sell/confirm' , SellController.confirm);
app.get('/api/sell/dashboard', SellController.dashboard)


//service

app.post('/api/service/create', ServiceController.create)
app.get('/api/service/list' , ServiceController.list)
app.put('/api/service/update/:id' , ServiceController.update)
app.delete('/api/service/delete/:id' , ServiceController.remove)


app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
