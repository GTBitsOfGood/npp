import mongoose, { Schema, Types } from "mongoose";
import { ObjectId } from "mongodb";

const Address = new Schema({
  streetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
});

const Organization = new Schema({
  organizationName: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  mission: {
    type: String,
    required: true,
  },
  address: {
    type: Address,
    required: true,
  },
  phone: {
    type: String,
  },
});

const Contact = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
});

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
    organization: {
      type: Organization,
      required: true,
    },
    primaryContact: {
      type: Contact,
      required: true,
    },
    productType: {
      type: [String],
      required: true,
      enum: ["WEBSITE", "MOBILE_APP"],
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

export const ApplicationDocument =
  mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);
