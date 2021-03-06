import { callInternalAPI } from "&server/utils/ActionUtils";
import { HttpMethod } from "&server/models/HttpMethod";
import urls from "&utils/urls";
import {
  Meeting,
  MeetingCore,
  MeetingWithAvailability,
} from "&server/models/Meeting";
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
): Promise<MeetingWithAvailability> {
  const response: Record<string, any> = await callInternalAPI(
    meetingRoute + `?applicationId=${objectId}`,
    HttpMethod.GET
  );
  return meetingWithAvailabilityFromJsonResponse(response);
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
    ...meetingCoreFromJsonResponse(object),
    availability: object.availability as string,
  };
}

export function meetingWithAvailabilityFromJsonResponse(object: {
  [key: string]: any;
}): MeetingWithAvailability {
  return {
    ...meetingCoreFromJsonResponse(object),
    availability: availabilityFromJsonResponse(object.availability),
  };
}

export function meetingCoreFromJsonResponse(object: {
  [key: string]: any;
}): MeetingCore {
  return {
    ...object,
    createdAt: DateTime.fromISO(new Date(object.createdAt).toISOString()),
    updatedAt: DateTime.fromISO(new Date(object.updatedAt).toISOString()),
  } as MeetingCore;
}
