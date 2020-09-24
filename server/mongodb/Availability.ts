import mongoose from "mongoose";

const { Schema } = mongoose;

const AvailabilitySchema = new Schema({
    interviewer: {
        type: Schema.Types.ObjectId,
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
    }
})

export default mongoose.models.Availability ||
  mongoose.model("Availability", AvailabilitySchema);