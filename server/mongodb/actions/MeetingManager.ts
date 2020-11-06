import { connectToDB } from "../index";
import MeetingDocument from "../MeetingDocument";
import { ObjectId } from "mongodb";

async function addMeeting(meeting: Record<string, any>) {
  await connectToDB();

  return MeetingDocument.create(meeting);
}

// set limit?
async function getMeetings() {
  await connectToDB();

  return MeetingDocument.find().sort({ startDateTime: -1 });
}

async function getMeetingById(id: ObjectId) {
  await connectToDB();

  return MeetingDocument.findById(id);
}

async function getMeetingByApplicationId(id: ObjectId) {
  await connectToDB();

  return MeetingDocument.findOne({ application: id });
}

export default {
  addMeeting,
  getMeetings,
  getMeetingById,
  getMeetingByApplicationId,
};
