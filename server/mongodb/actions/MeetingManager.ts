import { connectToDB } from "../index";
import MeetingDocument from "../MeetingDocument";
import { ObjectId } from "mongodb";
import { updateAvailability } from "&server/mongodb/actions/AvailabilityManager";
import { Meeting } from "&server/models/Meeting";
import { updateApplicationStage } from "&server/mongodb/actions/ApplicationManager";
import { StageType } from "&server/models/StageType";

export async function addMeeting(meeting: Meeting) {
  await connectToDB();

  if (meeting.availability == null || meeting.application == null) {
    throw new Error("Invalid request!");
  }

  const availability = await updateAvailability(
    new ObjectId(meeting.availability),
    {
      isBooked: true,
    }
  );

  if (availability == null) {
    throw new Error("Availability does not exist!");
  }

  const createdMeeting = await MeetingDocument.create(meeting);

  await updateApplicationStage(
    new ObjectId(meeting.application),
    StageType.SCHEDULED
  );

  return createdMeeting;
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
