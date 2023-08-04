import express from "express";

import {
  validateCustomer,
  addCustomer,
  deleteCustomer,
  getCustomerDetails,
} from "./customer.services.js";
const router = express.Router();

//create customer
router.post("/customer/create", validateCustomer, addCustomer);

//delete customer
router.delete("/customer/delete/:id", deleteCustomer);

//get single cutomer details
router.get("/customer/details/:id", getCustomerDetails);

export default router;
