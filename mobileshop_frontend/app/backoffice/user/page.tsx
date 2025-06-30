/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { config } from "@/app/config";
import Swal from "sweetalert2";
import Modal from "../modal";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [isShowModal, sestShowModal] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [conpassword, setConPassword] = useState("");
  const [level, setLevel] = useState("user");
  const [levelList, setLevelList] = useState(["admin", "user"]);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}/user/list`);
      setUsers(res.data);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };
  const handleSave = async () => {
    try {
      if (password !== conpassword || password === "") {
        Swal.fire({
          icon: "warning",
          title: "Incorrect",
          text: "Password not match",
        });
        return;
      }
      const payload = {
        name: name,
        username: username,
        password: password,
        level: level,
      };
      let res;
      if (id) {
        res = await axios.put(
          `${config.apiUrl}/user/updateUser/${id}`,
          payload
        );
        console.log(res);
      } else {
        res = await axios.post(`${config.apiUrl}/user/create`, payload);
        console.log(res);
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Save Sucess",
        timer: 2000,
      });
      fetchData();
      clearForm();
      handleCloseModal();
    } catch (error: any) {
      if (error.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Invalid Username",
          text: "Username already exists",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });
      }
    }
  };
  const handleOpenModal = () => {
    sestShowModal(true);
  };
  const handleCloseModal = () => {
    sestShowModal(false);
    clearForm();
  };

  const handleDelete = async (id: string) => {
    try {
      const button = await Swal.fire({
        icon: "question",
        title: "Do you want to delete",
        showCancelButton: true,
        showConfirmButton: true,
      });
      if (button.isConfirmed) {
        await axios.put(`${config.apiUrl}/user/delete/${id}`);
        fetchData();
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  const handleEdit = (id: number) => {
    const user = users.find((user: any) => user.id === id) as any;
    if (user) {
      setId(user.id);
      setName(user.name);
      setUserName(user.username);
      setLevel(user.level);
      setPassword(user.password);
      handleOpenModal();
    }
  };

  const clearForm = () => {
    setId("");
    setName("");
    setUserName("");
    setLevel("");
    setPassword("");
    setConPassword("");
  };
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="border-b font-bold text-2xl text-teal-500 border-teal-500">
        User Management
      </h1>
      <div>
        <button className="btn mt-2" onClick={handleOpenModal}>
          <i className="fa fa-plus"></i>
          Add User
        </button>

        <table className="mt-2 min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((items: any) => (
              <tr key={items.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {items.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {items.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {items.level}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                  <button
                    className="bg-blue-600 p-2 rounded-lg"
                    onClick={() => handleEdit(items.id)}
                  >
                    <i className="fa fa-pen text-white"></i>
                  </button>
                  <button
                    className="bg-red-600 p-2 rounded-lg"
                    onClick={() => handleDelete(items.id)}
                  >
                    <i className="fa fa-trash text-white"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isShowModal}
        onClose={handleCloseModal}
        title="User Management"
      >
        <div className="space-y-6">
          {/* Name field */}
          <div className="form-group">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              placeholder="Enter full name"
            />
          </div>

          {/* Username field */}
          <div className="form-group">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              placeholder="Enter username"
            />
          </div>

          {/* Password field */}
          <div className="form-group">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              placeholder="Enter password"
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="password"
              type="password"
              value={conpassword}
              onChange={(e) => setConPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              placeholder="Enter password"
            />
          </div>

          {/* Level dropdown */}
          <div className="form-group">
            <label
              htmlFor="level"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Level
            </label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white transition-all duration-200"
            >
              {levelList.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end pt-4 mt-6 border-t border-gray-100">
            <button
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg mr-3 hover:bg-gray-300 transition-colors duration-200"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-200 flex items-center"
              onClick={handleSave}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
