import { callInternalAPI } from "&server/utils/ActionUtils";
import { HttpMethod } from "&server/models/HttpMethod";
import urls from "&utils/urls";
import { DateTime } from "luxon";
import { Availability } from "&server/models/Availability";
const availabilityRoute = urls.api.availability;

export async function getAvailabilityById(
  objectId: string
): Promise<Availability> {
  const response: Record<string, any> = await callInternalAPI(
    availabilityRoute + `?id=${objectId}`,
    HttpMethod.GET
  );
  return availabilityFromJsonResponse(response);
}

export async function getAvailabilitiesForStartOfWeek(): Promise<
  Availability[]
> {
  const response: Record<string, any>[] = await callInternalAPI(
    availabilityRoute,
    HttpMethod.GET
  );
  return response.map(availabilityFromJsonResponse);
}

export async function createAvailability(
  availability: Availability
): Promise<Availability> {
  const response: Record<string, any>[] = await callInternalAPI(
    availabilityRoute,
    HttpMethod.PUT,
    {
      availability,
    }
  );
  return availabilityFromJsonResponse(response);
}

export async function updateAvailability(
  id: string,
  updates: Record<string, any>
): Promise<Availability> {
  const response: Record<string, any>[] = await callInternalAPI(
    availabilityRoute,
    HttpMethod.POST,
    {
      id,
      updates,
    }
  );
  return availabilityFromJsonResponse(response);
}

export async function deleteAvailability(id: string): Promise<Availability> {
  const response: Record<string, any>[] = await callInternalAPI(
    availabilityRoute + `?id=${id}`,
    HttpMethod.DELETE
  );
  return availabilityFromJsonResponse(response);
}

function availabilityFromJsonResponse(object: {
  [key: string]: any;
}): Availability {
  return {
    id: object._id,
    interviewer: object.interviewer,
    startDatetime: DateTime.fromISO(object.startDatetime),
    endDatetime: DateTime.fromISO(object.endDatetime),
    isBooked: object.isBooked,
  };
}
