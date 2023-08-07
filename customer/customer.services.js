import Joi from "joi";
import { customer } from "./customer.model.js";
import mongoose from "mongoose";
import { checkMongoIdValidity } from "../utils/utils.js";

export const validateCustomer = async (req, res, next) => {
  const newCustomer = req.body;
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).trim().required(),
    dob: Joi.string().required().trim(),
    gender: Joi.string()
      .required()
      .trim()
      .valid("male", "female", "preferNotToSay"),
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
  // const customer = await customer.findById(customerId);
  const Customer = await customer.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(customerId),
      },
    },
    {
      $lookup: {
        from: "products",
        foreignField: "customerId",
        localField: "_id",
        as: "productData",
      },
    },
    {
      $project: {
        name: 1,
        email: 1,
        "productData.name": 1,
        "productData.price": 1,
      },
    },
  ]);
  //if not user throw error
  if (Customer.length === 0) {
    return res.status(404).send({ message: "Customer does not exist" });
  }
  // send response
  return res.status(200).send(Customer);
};

//edit a customer
export const editCutomer = async (req, res) => {
  const customerId = req.params.id;
  console.log(customerId);
  //check id validity
  const isValid = checkMongoIdValidity(customerId);

  if (!isValid) {
    return res.status(401).send({ message: "Invalid Id" });
  }

  //check customer with id exists or not
  const customer = await customer.findOne({ _id: customerId });

  //if not throw error
  if (!customer) {
    return res.status(400).send({ message: "Customer Doesn't Exist" });
  }

  //edit in db
  const newDetails = req.body;
  await customer.updateOne(
    { _id: customerId },
    {
      $set: {
        name: newDetails.name,
        dob: newDetails.dob,
        gender: newDetails.gender,
        email: newDetails.email,
      },
    }
  );

  //send response
  return res.status(200).send({ message: "Customer Edited Succesfully" });
};

// search customer
export const searchCustomer = async (req, res) => {
  const searchDetails = req.body;
  const searchedCustomers = await customer.find({
    name: { $regex: `${searchDetails.name}`, $options: "i" },
  });
  if (searchedCustomers.length == 0) {
    return res
      .status(400)
      .send({ message: "Couldn't find user with the details" });
  }
  return res.status(200).send(searchedCustomers);
};
