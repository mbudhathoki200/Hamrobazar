import express from "express";

import {
  validateCustomer,
  addCustomer,
  deleteCustomer,
  getCustomerDetails,
  editCutomer,
  searchCustomer,
} from "./customer.services.js";
const router = express.Router();

//create customer
router.post("/customer/create", validateCustomer, addCustomer);

//delete customer
router.delete("/delete/:id", deleteCustomer);

//get single cutomer details
router.get("/details/:id", getCustomerDetails);

//edit customer
router.put("/edit/:id", validateCustomer, editCutomer);
//search by name(regex)
router.get("/search", searchCustomer);
export default router;
