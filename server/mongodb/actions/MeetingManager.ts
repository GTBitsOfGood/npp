import { connectToDB } from "../index";
import MeetingSchema from "../MeetingDocument";
import { ObjectId } from "mongodb";

async function addMeeting(meeting: Document) {
  await connectToDB();

  return MeetingSchema.create(meeting);
}

// set limit?
async function getMeetings() {
  await connectToDB();

  return MeetingSchema.find().sort({ startDateTime: -1 });
}

async function getMeetingById(id: ObjectId) {
  await connectToDB();

  return MeetingSchema.findById(id);
}

async function getMeetingByApplicationId(id: ObjectId) {
  await connectToDB();

  return MeetingSchema.findOne({ application: id });
}

export default {
  addMeeting,
  getMeetings,
  getMeetingById,
  getMeetingByApplicationId,
};
