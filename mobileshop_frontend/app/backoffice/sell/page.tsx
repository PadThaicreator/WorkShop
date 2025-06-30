/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { config } from "@/app/config";
import axios from "axios";
import Swal from "sweetalert2";

export default function Page() {
  const [serial, setSerial] = useState("");
  const [sellList, setSellList] = useState([]);
  const [price, setPrice] = useState(0);
  const [id, setId] = useState("");
  const [total , setTotal] = useState(0)
  
  const handleSave = async () => {
    try {
      const payload = {
        serial: serial,
        price: price
      };
      await axios.post(`${config.apiUrl}/sell/create`, payload);
      await fetchData(); // Refresh the list after saving
      // Reset form fields
      setSerial("");
      setPrice(0);
      Swal.fire({
        title: "Success",
        text: "Product added successfully",
        icon: "success",
      });
    } catch (error : any) {
      if (error.response.status === 400){
        Swal.fire({
          title: "Failed",
          text: "Product Not Found",
          icon: "error",
        });
      }
      else{
        Swal.fire({
          title: "Failed",
          text: error.message,
          icon: "error",
        });
      }
    }
  };

  const handleDelete = async (itemId : string) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(`${config.apiUrl}/sell/delete/${itemId}`);
          fetchData(); // Refresh the list after deletion
          Swal.fire(
            "Deleted!",
            "Your record has been deleted.",
            "success"
          );
        }
      });
    } catch (error : any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}/sell/list`);
      setSellList(res.data);
      let totals = 0;
      for ( let i = 0 ; i < res.data.length ; i++){
        totals +=res.data[i].price
      }
      setTotal(totals)
    } catch (error : any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirm = async() =>{
    try {
      const button = await Swal.fire({
        text : "Confirm Buy Product ?",
        icon : "question",
        title : "Buy Confirm",
        showCancelButton : true,
        showConfirmButton : true
      })

      if(button.isConfirmed){
        await axios.put(`${config.apiUrl}/sell/confirm`);
        fetchData();
      }
    } catch (error : any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  }
  
  return (
    <div className="flex flex-1 flex-col p-6 bg-gray-50 min-h-screen">
      <h1 className="border-b-2 font-bold text-2xl text-teal-600 border-teal-500 pb-2 mb-6">
        Product Sell
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Product</h2>
        
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Serial</label>
            <input
              type="text"
              placeholder="Enter serial number"
              onChange={(e) => setSerial(e.target.value)}
              value={serial}
              className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              placeholder="Enter price"
              onChange={(e) => setPrice(Number(e.target.value))}
              value={price}
              className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          
          <div className="w-full md:w-auto">
            <button 
              type="button" 
              className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-4 py-2 rounded-md transition duration-200 flex items-center"
              onClick={handleSave}
            >
              <i className="fa fa-save mr-2"></i>
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-lg font-semibold text-gray-700 p-4 border-b">Product List</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sellList.length > 0 ? (
                sellList.map((item : any) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.product.serial}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 p-2 rounded-full transition duration-200"
                        onClick={() => handleDelete(item.id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {sellList.length > 0 && (
          <div className="px-6 py-3 bg-gray-50">
            <div className="text-right text-sm font-medium text-gray-700">
              Total Products: <span className="text-teal-600">{sellList.length}</span>
            </div>
            <div className="text-right text-sm font-medium text-gray-700 mt-1">
              Total Price: <span className="text-teal-600">${total.toFixed(2)}</span>
            </div>
        </div>
        )}
        <div className="flex items-center justify-center  m-4">
          <button className="btn cursor-pointer" onClick={handleConfirm}>
            <i className="fa fa-check mr-2"></i>
            Confirm Buy
          </button>
        </div>
      </div>
    </div>
  );
}