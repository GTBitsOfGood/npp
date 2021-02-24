import { Types } from "mongoose";
import { callInternalAPI } from "&server/utils/ActionUtils";
import { HttpMethod } from "&server/models/HttpMethod";
import urls from "&utils/urls";
import { Meeting } from "&server/models/Meeting";
import { DateTime } from "luxon";
import { availabilityFromJsonResponse } from "&actions/AvailabilityActions";

const meetingRoute = urls.api.meeting;

export async function getMeetingById(objectId: string): Promise<Meeting> {
  const response: Record<string, any> = await callInternalAPI(
    meetingRoute + `?id=${objectId}`,
    HttpMethod.GET
  );
  return meetingFromJsonResponse(response);
}

export async function getMeetingByApplicationId(
  objectId: string
): Promise<Meeting> {
  const response: Record<string, any> = await callInternalAPI(
    meetingRoute + `?applicationId=${objectId}`,
    HttpMethod.GET
  );
  return meetingFromJsonResponse(response);
}

export async function getMeetings(): Promise<Meeting[]> {
  const response: Record<string, any>[] = await callInternalAPI(
    meetingRoute,
    HttpMethod.GET
  );
  return response.map(meetingFromJsonResponse);
}

export async function createMeeting(meeting: Meeting): Promise<Meeting> {
  const response: Record<string, any>[] = await callInternalAPI(
    meetingRoute,
    HttpMethod.PUT,
    {
      meeting,
    }
  );
  return meetingFromJsonResponse(response);
}

export async function cancelMeeting(id: string): Promise<void> {
  await callInternalAPI(meetingRoute + `?id=${id}`, HttpMethod.DELETE);
}

export function meetingFromJsonResponse(object: {
  [key: string]: any;
}): Meeting {
  return {
    id: object._id?.toString(),
    availability:
      typeof object.availability === "string" ||
      object.availability instanceof Types.ObjectId
        ? object.availability.toString()
        : availabilityFromJsonResponse(object.availability),
    nonprofit: object.nonprofit?.toString(),
    application: object.application?.toString(),
    cancelled: object.cancelled,
    createdAt: DateTime.fromISO(new Date(object.createdAt).toISOString()),
    updatedAt: DateTime.fromISO(new Date(object.updatedAt).toISOString()),
    meetingId: -1,
    meetingLink: "",
  };
}
