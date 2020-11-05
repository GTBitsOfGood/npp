import mongoose, { Schema, Types } from "mongoose";
import ContactSchema from "&server/mongodb/ContactSchema";

const IssueSchema = new Schema(
  {
    product: {
      type: Types.ObjectId,
      ref: "Application",
      required: true,
    },
    type: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.IssueDocument ||
  mongoose.model("Issue", IssueSchema);
