import mongoose, { Schema, Types } from "mongoose";
import ContactSchema from "&server/mongodb/ContactSchema";

const IssueSchema = new Schema(
  {
    product: {
      type: Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },
    issueType: {
      type: [String],
      required: true,
      enum: ["NOT_LOADING", "DATA_MISSING", "OTHER"],
      index: true,
    },
    description: {
      type: String,
      required: true,
      text: true,
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
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Issue || mongoose.model("Issue", IssueSchema);
