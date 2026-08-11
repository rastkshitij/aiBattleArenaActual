import app from "./Backend/src/app.js";
import connectDB from "./Backend/src/config/db.js";

const start = async () => {
  await connectDB();
  return app;
};

export default start;