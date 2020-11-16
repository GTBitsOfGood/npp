import { Types } from "mongoose";
import { connectToDB } from "../index";
import MeetingDocument from "../MeetingDocument";
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
    Types.ObjectId(meeting.availability),
    {
      isBooked: true,
    }
  );

  if (availability == null) {
    throw new Error("Availability does not exist!");
  }

  const createdMeeting = await MeetingDocument.create(meeting);

  await updateApplicationStage(
    Types.ObjectId(meeting.application),
    StageType.SCHEDULED
  );

  return createdMeeting;
}

// set limit?
export async function getMeetings() {
  await connectToDB();

  return MeetingDocument.find().sort({ startDateTime: -1 });
}

export async function getMeetingById(id: Types.ObjectId) {
  await connectToDB();

  return MeetingDocument.findById(id);
}

export async function getMeetingByApplicationId(id: string) {
  await connectToDB();

  const meeting = await MeetingDocument.findOne({
    application: Types.ObjectId(id),
  })
    .sort({
      createdAt: -1,
    })
    .populate("availability")
    .lean();

  if (meeting == null) {
    throw new Error("Application does not have a meeting!");
  }

  return meeting;
}

export async function cancelMeeting(id: Types.ObjectId) {
  await connectToDB();

  const meeting = await MeetingDocument.findByIdAndUpdate(
    id,
    {
      cancelled: true,
    },
    {
      new: true,
      lean: true,
    }
  );

  if (meeting == null) {
    throw new Error("Meeting does not exist!");
  }

  await updateAvailability(meeting.availability, {
    isBooked: false,
  });

  return meeting;
}
