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
    submittedAt: {
      type: Date,
      default: null,
    },
    meeting: {
      type: Types.ObjectId,
      ref: "Meeting",
      default: null,
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

ApplicationSchema.virtual("status").get(function (this: any) {
  // not sure what I was doing here lol
  if (this.decision) {
    return "DECISION";
  } else if (this.interviewScheduled) {
    this.populate;
  } else if (this.submittedAt) {
  } else {
    return "DRAFT";
  }
});

export default mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);
