import mongoose, { mongo } from "mongoose";

export const checkMongoIdValidity = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
