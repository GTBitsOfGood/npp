import { Types } from "mongoose";
import { connectToDB } from "../index";
import MeetingDocument from "../MeetingDocument";
import {
  docToAvailability,
  getAvailabilityById,
  updateAvailability,
} from "&server/mongodb/actions/AvailabilityManager";
import {
  Meeting,
  MeetingCore,
  MeetingWithAvailability,
} from "&server/models/Meeting";
import { updateApplicationStage } from "&server/mongodb/actions/ApplicationManager";
import { StageType } from "&server/models/StageType";
import { DateTime } from "luxon";

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

  genConferenceLinks(meeting);

  const createdMeeting = await MeetingDocument.create(meeting);

  await updateApplicationStage(
    Types.ObjectId(meeting.application),
    StageType.SCHEDULED
  );

  return docToMeeting(createdMeeting);
}

export async function getMeetings(): Promise<Meeting[]> {
  await connectToDB();

  return (await MeetingDocument.find().sort({ startDateTime: -1 }).lean()).map(
    docToMeeting
  );
}

export async function getMeetingById(
  id: Types.ObjectId
): Promise<Meeting | null> {
  await connectToDB();
  const meeting = await MeetingDocument.findById(id);
  return meeting != null ? docToMeeting(meeting) : null;
}

export async function getMeetingWithAvailabilityByRoomName(
  roomName: string
): Promise<MeetingWithAvailability | null> {
  await connectToDB();
  const meeting = await MeetingDocument.findOne({ roomName: roomName })
    .populate("availability")
    .lean();
  return meeting != null ? docToMeetingWithAvailability(meeting) : null;
}

export async function getMeetingByApplicationId(
  id: Types.ObjectId
): Promise<MeetingWithAvailability> {
  await connectToDB();

  const meeting = await MeetingDocument.findOne({
    application: id,
  })
    .sort({
      createdAt: -1,
    })
    .populate("availability")
    .lean();

  if (meeting == null) {
    throw new Error("Application does not have a meeting!");
  }

  return docToMeetingWithAvailability(meeting);
}

export async function cancelMeeting(id: Types.ObjectId): Promise<Meeting> {
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

  return docToMeeting(meeting) as Meeting;
}

export function docToMeeting(object: { [key: string]: any }): Meeting {
  return {
    ...docToMeetingCore(object),
    availability: object.availability as string,
  };
}

export function docToMeetingWithAvailability(object: {
  [key: string]: any;
}): MeetingWithAvailability {
  return {
    ...docToMeetingCore(object),
    availability: docToAvailability(object.availability),
  };
}

export function docToMeetingCore(object: { [key: string]: any }): MeetingCore {
  return {
    id: object._id?.toString(),
    nonprofit: object.nonprofit?.toString(),
    application: object.application?.toString(),
    cancelled: object.cancelled,
    createdAt: DateTime.fromISO(object.createdAt.toISOString()),
    updatedAt: DateTime.fromISO(object.updatedAt.toISOString()),
    meetingId: -1,
    meetingLink: "",
  } as MeetingCore;
}

export async function genConferenceLinks(meeting: Meeting) {
  const scheduledTime = await getAvailabilityById(
    Types.ObjectId(meeting.availability)
  );

  const data = {
    startWithPersonalUrl: false,
    meetingStart: scheduledTime.startDatetime,
    meetingEnd: scheduledTime.endDatetime,
    meetingName: "INSERT MEETING NAME PLS CHANGE LATER",
  };

  await fetch("https://api.join.me/v1/meetings", {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((json) => {
      meeting.meetingId = json.meetingId;
      meeting.meetingLink = json.viewerLink;
    });
}
