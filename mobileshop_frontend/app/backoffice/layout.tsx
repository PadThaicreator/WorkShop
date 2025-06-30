import React from "react";
import Sidebar from "./sidebar";


export default function Layout ({children} : {children : React.ReactNode}){
    return(
        <div className="flex flex-1 flex-col bg">
            <Sidebar  />
            <div className="p-5 bg-gray-200    flex flex-1 ml-72 flex-col">
            
                <div className="bg-white p-5 rounded-lg shadow-lg shadow-gray-500 flex  top-2 ">
                    {children}
                </div>
                
            </div>
        </div>
    );
}