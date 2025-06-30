/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Modal from "../modal";
import Swal from "sweetalert2";
import axios from "axios";
import { config } from "@/app/config";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setEditMode] = useState(false);
  const [serial, setSerial] = useState("");
  const [name, setName] = useState("");
  const [release, setRelease] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [color, setColor] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [remark, setRemark] = useState("");
  const [products, setProducts] = useState([]);
  const [id, setId] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/buy/list`);
      setProducts(response.data);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    clearForm();
    setIsOpen(false);
  };

  const handleSave = async () => {
    try {
      const payload = {
        serial: serial,
        name: name,
        release: release,
        color: color,
        price: price,
        customerName: customerName,
        customerPhone: customerPhone,
        customerAddress: customerAddress,
        remark: remark,
        qty: qty,
      };
      if (id === 0) {
        await axios.post(`${config.apiUrl}/buy/create`, payload);
      } else {
        await axios.put(`${config.apiUrl}/buy/update/${id}`, payload);
        setId(0);
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Save Sucess",
        timer: 2000,
      });
      clearForm();
      setIsOpen(false);
      fetchData();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  const handleEdit = (id: number) => {
    const product = products.find((product: any) => product.id === id) as any;
    if (!product) {
      console.error("Product not found");
      return;
    }
    setSerial(product.serial);
    setName(product.name);
    setRelease(product.release);
    setColor(product.color);
    setPrice(product.price);
    setCustomerAddress(product.customerAddress ?? " ");
    setCustomerName(product.customerName);
    setCustomerPhone(product.customerPhone);
    setRemark(product.remark ?? " ");
    setId(product.id);
    setEditMode(true);

    handleOpenModal();
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
        await axios.put(`${config.apiUrl}/buy/delete/${id}`);
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

  const clearForm = () => {
    setEditMode(false);
    setSerial("");
    setName("");
    setRelease("");
    setColor("");
    setPrice(0);
    setQty(1);
    setCustomerAddress("");
    setCustomerName("");
    setCustomerPhone("");
    setRemark("");
    setId(0);
  };
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="border-b font-bold text-2xl text-teal-500 border-teal-500">
        Product List
      </h1>
      <div className="mt-4">
        <table className="table mt-3">
          <thead>
            <tr>
              <th>Serial</th>
              <th>Product Name</th>
              <th>Release</th>
              <th>Color</th>
              <th>Price</th>
              <th>Customer Name</th>
              <th>Customer Phone</th>
              <th>Remark</th>
              <th className="w-[160px]"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.id}>
                <td>{product.serial}</td>
                <td>{product.name}</td>
                <td>{product.release}</td>
                <td>{product.color}</td>
                <td>{product.price}</td>
                <td>{product.customerName}</td>
                <td>{product.customerPhone}</td>
                <td>{product.remark}</td>
                <td className="text-center ">
                  <div className="flex flex-row">
                    <button
                      className="btn-edit mr-2 flex items-center justify-center  p-2"
                      onClick={() => handleEdit(product.id)}
                    >
                      <i className="fa-solid fa-edit text-center"></i>
                    </button>

                    <button
                      className="btn-delete flex items-center justify-center p-2"
                      onClick={() => handleDelete(product.id)}
                    >
                      <i className="fa-solid fa-trash text-center"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className="btn mt-5"
        onClick={() => {
          clearForm();
          handleOpenModal();
        }}
      >
        <i className="fa-solid fa-plus mr-2"></i>
        Add Product
      </button>

      <Modal title="Add Product" isOpen={isOpen} onClose={handleCloseModal}>
        <div className="flex flex-col gap-2">
          <div className="block mb-2 text-sm font-medium ">Serial</div>
          <input
            type="text"
            className="input"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
          />

          <div className="block mb-2 text-sm font-medium ">Product Name</div>
          <input
            type="text"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="block mb-2 text-sm font-medium ">Release</div>
          <input
            type="text"
            className="input"
            value={release}
            onChange={(e) => setRelease(e.target.value)}
          />

          <div className="block mb-2 text-sm font-medium ">Color</div>
          <input
            type="text"
            className="input"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />

          <div className="block mb-2 text-sm font-medium ">Price</div>
          <input
            type="text"
            className="input"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />

          <div className="block mb-2 text-sm font-medium ">Customer Name</div>
          <input
            type="text"
            className="input"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <div className="block mb-2 text-sm font-medium ">Customer Phone</div>
          <input
            type="text"
            className="input"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />

          <div className="block mb-2 text-sm font-medium ">
            Customer Address
          </div>
          <input
            type="text"
            className="input"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
          />

          <div className="block mb-2 text-sm font-medium ">Remark</div>
          <input
            type="text"
            className="input"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />

          {!isEdit && (
            <div>
              <div className="block mb-2 text-sm font-medium">Quantity</div>
              <input
                type="text"
                className="input"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value ?? 0))}
              />
            </div>
          )}

          <div className="mt-2">
            <button type="button" className="btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
