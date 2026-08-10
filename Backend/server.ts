import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import config from "./src/config/config.js";

const startServer = async () => {
  await connectDB();
  app.listen(config.PORT, () => {
    console.log(`Server running at port ${config.PORT}`);
  });
};

startServer();
