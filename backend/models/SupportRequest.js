const mongoose = require("mongoose");

const supportRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    intro: {
      type: String,
      required: [true, "Introduction is required"],
    },
    skills: {
      type: String,
      required: [true, "Skills are required"],
    },
    availability: {
      type: String,
      required: [true, "Availability is required"],
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "resolved"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SupportRequest", supportRequestSchema);
