import mongoose from "mongoose";

//create Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 55,
    required: true,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "customer",
  },
});
//create table
export const Product = mongoose.model("Product", productSchema);
