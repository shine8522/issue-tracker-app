const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["todo", "inProgress", "done"], default: "todo" ,
    set:(v)=>v.toLowerCase(),}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
