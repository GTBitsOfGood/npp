import mongoose, { Schema, Types } from "mongoose";

const MeetingSchema = new Schema(
  {
    availability: {
      type: Types.ObjectId,
      ref: "Availability",
      required: true,
    },
    nonprofit: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    application: {
      type: Types.ObjectId,
      ref: "Application",
      required: true,
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
    meetingLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Meeting ||
  mongoose.model("Meeting", MeetingSchema);
