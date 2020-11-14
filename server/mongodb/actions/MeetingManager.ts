import { connectToDB } from "../index";
import MeetingDocument from "../MeetingDocument";
import { ObjectId } from "mongodb";

export async function addMeeting(meeting: Record<string, any>) {
  await connectToDB();

  return MeetingDocument.create(meeting);
}

// set limit?
export async function getMeetings() {
  await connectToDB();

  return MeetingDocument.find().sort({ startDateTime: -1 });
}

export async function getMeetingById(id: ObjectId) {
  await connectToDB();

  return MeetingDocument.findById(id);
}

export async function getMeetingByApplicationId(id: ObjectId) {
  await connectToDB();

  return MeetingDocument.findOne({ application: id });
}
