import joi from "joi";
import mongoose from "mongoose";

import { Product } from "./product.module.js";
import { checkMongoIdValidity } from "../utils/utils.js";

//validate
export const validateProduct = async (req, res, next) => {
  const schema = joi.object({
    name: joi.string().min(3).max(55),
    price: joi.number().min(0).required(),
    customerId: joi.string(),
  });
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

//add product
export const addProduct = async (req, res) => {
  const newProduct = req.body;
  await Product.create(newProduct);
  return res.status(200).send({ message: "Product Created Succesfully!" });
};

//getProduct along with customer
export const getProductDetails = async (req, res) => {
  //extract id
  const productId = req.params.id;
  //validate id
  const isValid = checkMongoIdValidity(productId);
  //ifnot throw error
  if (!isValid) {
    return res.status(400).send({ message: "Invalid Id" });
  }
  //find product
  // const product = await Product.findOne({ _id: productId });
  const product = await Product.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(productId),
      },
    },
    {
      $lookup: {
        from: "customers",
        foreignField: "_id",
        localField: "customerId",
        as: "customerData",
      },
    },
    {
      $project: {
        name: 1,
        price: 1,
        customerDetails: {
          Name: { $first: "$customerData.name" },
          Email: { $first: "$customerData.email" },
        },
      },
    },
  ]);
  console.log(product);
  if (product.length === 0) {
    return res.status(400).send({ message: "Product doesnot exist" });
  }
  return res.status(200).send(product);
};
