import mongoose, { Types } from "mongoose";

const { Schema } = mongoose;

const MeetingSchema = new Schema({
  interviewer: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  startDatetime: {
    type: Date,
    required: true,
  },
  nonprofit: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  application: {
    type: Types.ObjectId,
    ref: "Application",
    required: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Meeting ||
  mongoose.model("Meeting", MeetingSchema);
