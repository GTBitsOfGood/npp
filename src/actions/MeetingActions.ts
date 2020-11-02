import { callInternalAPI } from "&server/utils/ActionUtils";
import { HttpMethod } from "&server/models/HttpMethod";
import urls from "&utils/urls";
import { Availability } from "&server/models/Availability";
import { DateTime } from "luxon";
import { Meeting } from "&server/models/Meeting";

const meetingRoute = urls.api.meeting;

async function getMeetingById(objectId: string): Promise<Meeting> {
  const response: Record<string, any> = await callInternalAPI(
    meetingRoute + `?id=${objectId}`,
    HttpMethod.GET
  );
  return meetingFromJsonResponse(response);
}

async function getMeetingByApplicationId(objectId: string): Promise<Meeting> {
  const response: Record<string, any> = await callInternalAPI(
    meetingRoute + `?applicationId=${objectId}`,
    HttpMethod.GET
  );
  return meetingFromJsonResponse(response);
}

async function getMeetings(): Promise<Meeting[]> {
  const response: Record<string, any>[] = await callInternalAPI(
    meetingRoute,
    HttpMethod.GET
  );
  return response.map(meetingFromJsonResponse);
}

async function createMeeting(meeting: Availability): Promise<Meeting> {
  const response: Record<string, any>[] = await callInternalAPI(
    meetingRoute,
    HttpMethod.PUT,
    {
      meeting,
    }
  );
  return meetingFromJsonResponse(response);
}

function meetingFromJsonResponse(object: { [key: string]: any }): Meeting {
  return {
    id: object._id,
    interviewer: object.interviewer,
    startDatetime: DateTime.fromISO(object.startDatetime),
    nonprofit: object.nonprofit,
    application: object.application,
    contactName: object.contactName,
    contactPhone: object.contactPhone,
  };
}

export default {
  getMeetingById,
  getMeetingByApplicationId,
  getMeetings,
  createMeeting,
};
