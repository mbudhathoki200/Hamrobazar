import express from "express";

import { db_connect } from "./db_connect.js";
import customerRoutes from "./customer/customer.routes.js";

const app = express();
app.use(express.json());

//register Routes
app.use("/customer", customerRoutes);

//mongoConnect
db_connect();

//port
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening on Port ${port}`);
});
