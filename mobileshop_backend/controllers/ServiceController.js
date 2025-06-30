import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bodyParser from "body-parser";
const { json } = bodyParser;
const prisma = new PrismaClient();

dotenv.config();

export const ServiceController = {
  create: async (req, res) => {
    try {
      console.log("IN");
      await prisma.service.create({
        data: {
          name: req.body.name,
          price: req.body.price,
          remark: req.body.remark,
          payDate: new Date(),
        },
      });
      console.log("IN");
      res.json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
  list: async (req, res) => {
    try {
      const data = await prisma.service.findMany({
        orderBy: {
          payDate: "desc",
        },
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await prisma.service.update({
        where: {
          id: req.params.id,
        },
        data: {
          name: req.body.name,
          price: req.body.price,
          remark: req.body.remark,
        },
      });
      res.json({ message: "Success" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  remove: async (req, res) => {
    try {
      await prisma.service.delete({
        where: {
          id: req.params.id,
        },
      });
      res.json({ message: "Success" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
