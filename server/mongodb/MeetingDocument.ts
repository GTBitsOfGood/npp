import mongoose, { Types } from "mongoose";

const { Schema } = mongoose;

const MeetingSchema = new Schema({
  availability: {
    type: Types.ObjectId,
    ref: "availability",
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
});

export default mongoose.models.Meeting ||
  mongoose.model("Meeting", MeetingSchema);
