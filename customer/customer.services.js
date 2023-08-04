import Joi from "joi";
import { customer } from "./customer.model.js";
import mongoose from "mongoose";
import { checkMongoIdValidity } from "../utils/utils.js";

export const validateCustomer = async (req, res, next) => {
  const newCustomer = req.body;
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).trim().required(),
    dob: Joi.string().required().trim(),
    gender: Joi.string().required().trim(),
    email: Joi.string().email().trim().required(),
  });
  try {
    await schema.validateAsync(newCustomer);
    next();
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};
export const addCustomer = async (req, res) => {
  const newCustomer = req.body;

  //check if user exist
  const Customer = await customer.findOne({ email: newCustomer.email });
  if (Customer) {
    return res
      .status(409)
      .send({ message: "User with this email already exists!!!" });
  }
  try {
    await customer.create(newCustomer);
    return res.status(200).send("Customer Added Successfully!!");
  } catch (error) {
    return res.status(201).send({ message: error.message });
  }
};
export const deleteCustomer = async (req, res) => {
  //extract id
  const customerId = req.params.id;
  console.log(customerId);
  //validate id
  const isValidMongoId = checkMongoIdValidity(customerId);
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid MongoId" });
  }
  //delete customer
  await customer.deleteOne({ _id: new mongoose.Types.ObjectId(customerId) });

  //send response
  return res.status(200).send({ message: "Customer Deleted Succesfully" });
};
export const getCustomerDetails = async (req, res) => {
  //extract id
  const customerId = req.params.id;
  //validate id
  const isValid = checkMongoIdValidity(customerId);
  if (!isValid) {
    return res.status(400).send({ message: "Invalid Id" });
  }
  //find user
  const customer = await customer.findById(customerId);

  //if not user throw error
  if (!customer) {
    return res.status(404).send({ message: "Customer does not exist" });
  }
  // send response
  return res.status(200).send("Findinng.....");
};
