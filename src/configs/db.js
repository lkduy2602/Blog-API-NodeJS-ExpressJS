import mongoose from "mongoose";

export const DBconnection = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI).catch((err) => {
    console.log(`For some reasons we couldn't connect to the DB`, err);
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
