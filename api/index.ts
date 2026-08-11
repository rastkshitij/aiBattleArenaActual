import app from "../Backend/src/app.js";
import connectDB from "../Backend/src/config/db.js";

await connectDB();

export default app;