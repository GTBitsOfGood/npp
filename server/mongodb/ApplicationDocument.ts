import mongoose, { Schema, Types } from "mongoose";
import { ObjectId } from "mongodb";
import ContactSchema from "&server/mongodb/ContactSchema";

const ApplicationSchema = new Schema(
  {
    users: {
      type: [Types.ObjectId],
      ref: "User",
      validate: {
        validator: (val: ObjectId[]) => val.length > 0,
        message: "Must be associated with at least one user",
      },
      required: true,
    },
    primaryContact: {
      type: ContactSchema,
      required: true,
    },
    productType: {
      type: [String],
      required: true,
      enum: ["WEBSITE", "MOBILE_APP"],
    },
    description: {
      type: String,
      required: true,
    },
    stage: {
      type: String,
      enum: [
        "SUBMITTED",
        "AWAITING_SCHEDULE",
        "SCHEDULED",
        "REVIEW",
        "DECISION",
      ],
      default: "SUBMITTED",
    },
    decision: {
      type: Boolean,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);
