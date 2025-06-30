"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { config } from "../config";
import Modal from "./modal";
import Swal from "sweetalert2";

export default function Sidebar() {
  const [isSelect, setSelect] = useState("");
  const [name, setName] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [conpass, setConPass] = useState<string>("");
  const [isShow, setShow] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    getUser();
  }, []);

  const handleCloseModal = () => {
    setShow(false);
  };
  const handleShowModal = () => {
    setShow(true);
  };

  const getUser = async () => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.get(`${config.apiUrl}/user/info`, {
      headers: headers,
    });
    setName(res.data.name);
    setUsername(res.data.username);
    setPassword(res.data.password);
    setLevel(res.data.level);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  const handleSave = async () =>{
    if(password !== conpass){
      Swal.fire({
        icon : "error",
        title : "Invalid Password",
        text : "Please Check Your Password"
      });
      return;
    }

    const payload = {
      name : name,
      username : username,
      password : password,
      level : level

    }
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.put(`${config.apiUrl}/user/update` , payload , {
      headers : headers
    });
    console.log(res)
    Swal.fire({
              title: 'Edited !',
              text: 'Edit Successfully',
              icon: 'success',
              timer: 2000,
            });
    getUser();
    handleCloseModal();
  }

  return (
    <div className="w-72 h-screen fixed top-0 left-0 border-r ">
      <div className="text-center  text-black p-5 ">
        <h1>Moblie Shop</h1>
        <div>
          <div className="flex flex-1 items-center border shadow-2xl rounded-md p-2 ">
            <i className="fa fa-user  w-[25px] text-center"></i>
            <span>
              {name.split(" ")[0]} : {level}
            </span>
            <button
              className="bg-blue-400 rounded-full w-7 h-7   border ml-0.5  "
              onClick={handleShowModal}
            >
              <i className="fa fa-pencil "> </i>
            </button>
            <button
              className="bg-red-400 rounded-full w-7 h-7   border  "
              onClick={handleLogout}
            >
              <i className="fa fa-sign-out "> </i>
            </button>
          </div>
        </div>
      </div>
      <div className="p-5 text-black text-xl flex flex-col gap-2">
        <div
          onClick={() => setSelect("Dashboard")}
          className={`${
            isSelect == "Dashboard" ? "bg-gray-400" : ""
          } p-2 rounded-lg`}
        >
          <Link href="/backoffice/dashboard">
            <i className="fa fa-tachometer-alt mr-2 w-[25px] text-center"></i>
            Dashboard
          </Link>
        </div>
        <div
          onClick={() => setSelect("Buy")}
          className={`${
            isSelect == "Buy" ? "bg-gray-400 " : ""
          } p-2  rounded-lg`}
        >
          <Link href="/backoffice/buy">
            <i className="fa fa-shopping-cart mr-2 w-[25px] text-center"></i>Buy
            Phone
          </Link>
        </div>
        <div
          onClick={() => setSelect("Sell")}
          className={`${
            isSelect == "Sell" ? "bg-gray-400" : ""
          } p-2 rounded-lg`}
        >
          <Link href="/backoffice/sell">
            <i className="fa fa-dollar mr-2 w-[25px] text-center"></i>Sell Phone
          </Link>
        </div>

        <div
          onClick={() => setSelect("Repair")}
          className={`${
            isSelect == "Repair" ? "bg-gray-400" : ""
          } p-2 rounded-lg`}
        >
          <Link href="/backoffice/repair">
            <i className="fa fa-wrench mr-2 w-[25px] text-center"></i>Repair
            Phone
          </Link>
        </div>
        <div
          onClick={() => setSelect("Company")}
          className={`${
            isSelect == "Company" ? "bg-gray-400" : ""
          } p-2 rounded-lg`}
        >
          <Link href="/backoffice/company">
            <i className="fa fa-building mr-2 w-[25px] text-center"></i>Company
          </Link>
        </div>
        <div
          onClick={() => setSelect("User")}
          className={`${
            isSelect == "User" ? "bg-gray-400" : ""
          } p-2 rounded-lg`}
        >
          <Link href="/backoffice/user">
            <i className="fa fa-users mr-2 w-[25px] text-center"></i>User
          </Link>
        </div>
      </div>

      <Modal
        title="Edit Information"
        isOpen={isShow}
        onClose={handleCloseModal}
      >
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-col">
            <div>Username</div>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <div>name</div>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
          </div>
          <div className="flex flex-col">
            <div>Password</div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div className="flex flex-col">
            <div>Confirm Password</div>
            <input type="password" value={conpass} onChange={(e) => setConPass(e.target.value)}/>
         
          </div>
          <div onClick={handleSave}>
            <button className="btn">
              <i className="fa fa-save mr-2"></i>
              Save
            </button>
          </div>
          
        </div>
      </Modal>
    </div>
  );
}
