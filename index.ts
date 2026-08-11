import express from "express";
import app from "./Backend/src/app.js";
import connectDB from "./Backend/src/config/db.js";

const handler = express();

handler.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

handler.use(app);

export default handler;