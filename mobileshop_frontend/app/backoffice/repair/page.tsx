/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { config } from "@/app/config";
import Swal from "sweetalert2";
import Modal from "../modal";
import dayjs from "dayjs";
export default function Page() {
  const [isShowModal, sestShowModal] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [remark, setRemark] = useState("");
  const [id, setId] = useState("");
  const [repair, setRepair] = useState([]);

  const handleOpenModal = () => {
    sestShowModal(true);
  };
  const handleCloseModal = () => {
    sestShowModal(false);
  };
  const handleSave = async () => {
    try {
      const payload = {
        name: name,
        price: price,
        remark: remark,
      };
      console.log(payload);
      if (id) {
        const res = await axios.put(
          `${config.apiUrl}/service/update/${id}`,
          payload
        );
        console.log(res);
      } else {
        const res = await axios.post(
            `${config.apiUrl}/service/create`,
            payload
          );
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
      setId("")
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  const clearForm = () => {
    setName("");
    setPrice(0);
    setRemark("");
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}/service/list`);
      setRepair(res.data);
    } catch (error: any) {
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

  const handleDelete = async (id: string) => {
    try {
      const button = await Swal.fire({
        icon: "question",
        title: "Do you want to delete",
        showCancelButton: true,
        showConfirmButton: true,
      });
      if (button.isConfirmed) {
        await axios.delete(`${config.apiUrl}/service/delete/${id}`);
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
    const repairEd = repair.find((repair: any) => repair.id === id) as any;
    if (repairEd) {
      setId(repairEd.id);
      setName(repairEd.name);
      setPrice(repairEd.price);
      setRemark(repairEd.remark);
      handleOpenModal();
    }
  };
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="border-b font-bold text-2xl text-teal-500 border-teal-500">
        Service Repair
      </h1>
      <div>
        <button className="btn mt-2" onClick={handleOpenModal}>
          <i className="fa-solid fa-plus mr-2"></i>
          Add Service
        </button>
        <table className="mt-2 min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remark
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PayDate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {repair.map((items: any) => (
              <tr key={items.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {items.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {items.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {items.remark}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {dayjs(items.payDate).format("DD/MM/YYYY")}
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
        title="Service Repair"
        onClose={handleCloseModal}
      >
        <div>
          <div>Repair Name</div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <div>Price</div>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <div>Remark</div>
          <input
            type="text"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </div>
        <div>
          <button className="btn" onClick={handleSave}>
            <i className="fa-solid fa-save mr-2"></i>
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
}
