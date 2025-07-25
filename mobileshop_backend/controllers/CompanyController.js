import  { PrismaClient}  from '@prisma/client'
const prisma = new PrismaClient();

export const  CompanyComtroller ={
        create : async (req , res) =>{
            try{
                const oldCompany = await prisma.company.findFirst();
                const payload = {
                    name : req.body.name,
                        address : req.body.address,
                        phone : req.body.phone,
                        email : req.body.email ?? "",
                        taxCode : req.body.taxCode
                }

                if(oldCompany){
                    await prisma.company.update({
                        where : { id : oldCompany.id},
                        data : payload
                    })
                }else{
                    await prisma.company.create({
                        data : payload
                    })
                }
                res.status(200).json({message : "Create  sucessfully"})
            }catch(error){
                res.status(500).json({error : error.message});
            }
        },
        list: async (req , res) =>{
            try{
                const company = await prisma.company.findFirst();
                res.json(company);
            }catch (error){
                res.status(500).json({ error : error.message})
            }
        }
    }
