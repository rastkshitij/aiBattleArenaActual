import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const startServer = async () => {
  await connectDB();
  app.listen(3000, () => {
    console.log("Server running at port 3000");
  });
};

startServer();
