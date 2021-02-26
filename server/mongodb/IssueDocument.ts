import mongoose, { Schema, Types } from "mongoose";
import ContactSchema from "&server/mongodb/ContactSchema";

const IssueSchema = new Schema(
  {
    product: {
      type: Types.ObjectId,
      ref: "Application",
      required: true,
    },
    issueType: {
      type: [String],
      required: true,
      enum: ["NOT_LOADING", "DATA_MISSING", "OTHER"],
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    contact: {
      type: ContactSchema,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["CREATED", "IN_PROGRESS", "RESOLVED"],
      default: "CREATED",
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Issue || mongoose.model("Issue", IssueSchema);
