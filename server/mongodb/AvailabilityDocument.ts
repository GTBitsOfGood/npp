import mongoose, { Schema, Types } from "mongoose";

const AvailabilitySchema = new Schema({
  interviewer: {
    type: Types.ObjectId,
    required: true,
  },
  startDatetime: {
    type: Date,
    required: true,
  },
  endDatetime: {
    type: Date,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Availability ||
  mongoose.model("Availability", AvailabilitySchema);
