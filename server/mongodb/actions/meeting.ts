import { connectToDB } from "../index";
import MeetingSchema from "../Meeting";
import { ObjectId } from "mongodb";

export async function addMeeting(meeting: Document) {
  await connectToDB();

  return MeetingSchema.create(meeting);
}

export async function getMeetings() {
  await connectToDB();

  return MeetingSchema.find().sort({ startDateTime: -1 });
}

export async function getMeetingById(id: ObjectId) {
  await connectToDB();

  return MeetingSchema.findById(id);
}

export async function getMeetingByApplication(id: ObjectId) {
  await connectToDB();

  return MeetingSchema.findOne({ application: new ObjectId(id) });
}
