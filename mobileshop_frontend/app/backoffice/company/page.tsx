"use client"

import axios from "axios";
import { config } from "@/app/config";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";


export default function Page(){

    const [ name , setName ] = useState("");
    const [ address , setAddress ] = useState("");
    const [ phone , setPhone ] = useState("");
    const [ email , setEmail ] = useState("");
    const [ taxCode , setTaxCode] = useState("");

    useEffect(()=>{
        fetchData()
    } ,[]);

    const fetchData = async () =>{
        const res = await axios.get(`${config.apiUrl}/company/list`);
        setName(res.data.name);
        setAddress(res.data.address);
        setPhone(res.data.phone);
        setEmail(res.data.email);
        setTaxCode(res.data.taxCode);
    }

    const handleSave = async() =>{
        try{
            const payload ={
                name : name,
                address : address,
                phone : phone,
                email : email,
                taxCode : taxCode
            }

            await axios.post(`${config.apiUrl}/company/create` , payload)
            Swal.fire({
                icon : "success",
                title : "Data Create Sucessfully",
                timer : 2000
            })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }catch(error : any){
            Swal.fire({
                icon : "error",
                title : "Data Create Failed",
                text : `Error : ${error.message} `,
                timer : 2000
            })
        }
    }
    return(
        <div className="flex flex-1 flex-col">
            
            <h1 className="border-b font-bold text-2xl text-teal-500 border-teal-500"> Shop Information </h1>

            <div className="flex flex-col gap-2 mt-4">
                <div>Shop Name</div>
                <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />

                <div>Shop Address</div>
                <input type="text" value={address} onChange={(e)=>setAddress(e.target.value)} />
                
                <div>Shop Phone</div>
                <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} />

                <div>Shop Email</div>
                <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} />

                <div>Shop TaxCode</div>
                <input type="text" value={taxCode} onChange={(e)=>setTaxCode(e.target.value)} />

                
            </div>
            <button type="button" className="mt-4 border btn" onClick={handleSave} >
                <i className="fa fa-save mr-2 "></i>
                 Save
            </button>
        </div>
    );
}