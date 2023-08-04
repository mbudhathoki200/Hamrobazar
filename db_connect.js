import mongoose from "mongoose";

const { DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
const db_url = `mongodb+srv://${DB_USERNAME}:${encodeURIComponent(
  DB_PASSWORD
)}@manish.6xntcsb.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
// console.log(process.env);
const db_connect = async () => {
  try {
    await mongoose.connect(db_url);
    console.log("MONGODB CONNECTED SUCCESSFULLY!!!");
  } catch (error) {
    console.log("PROBLEM IN CONNECTING");
    console.log(error.message);
  }
};
export { db_connect };
