import { Prisma } from '@prisma/client';
import { Request, Response } from "express";
import prisma from "../model/db";

import {
    createTask,
    //   showTasks,
    //   updateTask,
    //   deleteTask,
} from "../services/task";

export const create = async (req: Request, res: Response) => {
    const { title, content, startAt } = req.body;
    const phone = req.headers['x-channel'] as string;

    const data = { title, content, startAt, phone }

    const result = await createTask(data);
    return res.json(result);
};

// export const read = async (req: Request, res: Response) => {
//   const products = await showProducts();

//   return res.status(201).json({
//     message: "List Data Product",
//     data: products,
//   });
// };

// export const update = async (req: Request, res: Response) => {
//   const id = parseInt(req.params.id);
//   const product = await updateProduct(
//     {
//       name: req.body.name,
//       price: req.body.price,
//     },
//     id
//   );

//   return res.status(201).json({
//     message: "Success Update Product",
//     data: product,
//   });
// };

// export const remove = async (req: Request, res: Response) => {
//   const id = parseInt(req.params.id);

//   const product = await deleteProduct(id);

//   return res.status(201).json({
//     message: "Success Delete Product",
//     data: product,
//   });
// };