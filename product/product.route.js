import express from "express";

import {
  validateProduct,
  addProduct,
  getProductDetails,
} from "./product.services.js";

const router = express.Router();

//add Product
router.post("/create", validateProduct, addProduct);

//get Product
router.get("/details/:id", getProductDetails);

export default router;
