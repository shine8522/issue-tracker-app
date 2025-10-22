const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const taskRoutes=require("./routes/taskRoutes");
const authRoutes=require("./routes/authRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected- HOGYAAAAAAAA"))
  .catch((err) => console.log(err));

// Routes
app.get("/", (req, res) => {
  res.send("API is running...") ;
}); 
app.use("/api/tasks",taskRoutes);
 app.use("/api/auth",authRoutes);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
