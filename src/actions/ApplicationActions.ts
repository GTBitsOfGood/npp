import { DateTime } from "luxon";
import { Application } from "&server/models/Application";
import { ProductType } from "&server/models/ProductType";
import { callInternalAPI } from "&server/utils/ActionUtils";
import { HttpMethod } from "&server/models/HttpMethod";
import urls from "&utils/urls";
import { contactFromJsonResponse } from "&server/models/Contact";
import { Types } from "mongoose";

const applicationRoute = urls.api.application;

export async function createApplication(
  application: Application
): Promise<Application> {
  const response: Record<string, any> = await callInternalAPI(
    applicationRoute,
    HttpMethod.PUT,
    {
      application: application,
    }
  );
  return applicationFromJson(response);
}

export async function getApplicationById(
  applicationId: string
): Promise<Application> {
  const response: Record<string, any> = await callInternalAPI(
    applicationRoute + `?id=${applicationId}`,
    HttpMethod.GET
  );
  return applicationFromJson(response);
}

export async function getApplications(
  adminAll = false
): Promise<Application[]> {
  const response: Record<string, any>[] = await callInternalAPI(
    applicationRoute + `?all=${adminAll}`,
    HttpMethod.GET
  );
  return response.map(applicationFromJson);
}

export async function deleteApplication(
  applicationId: string
): Promise<Application> {
  const response: Record<string, any> = await callInternalAPI(
    applicationRoute + `?id=${applicationId}`,
    HttpMethod.DELETE
  );
  return applicationFromJson(response);
}

export async function updateApplicationDecision(
  applicationId: string,
  decision: boolean
): Promise<Application> {
  const response: Record<string, any> = await callInternalAPI(
    applicationRoute,
    HttpMethod.POST,
    {
      id: applicationId,
      decision,
    }
  );
  return applicationFromJson(response);
}

export async function updateApplicationMeeting(
  applicationId: string,
  meetingId: string
): Promise<Application> {
  const response: Record<string, any> = await callInternalAPI(
    applicationRoute,
    HttpMethod.POST,
    {
      id: applicationId,
      meetingId,
    }
  );
  return applicationFromJson(response);
}

export function applicationFromJson(object: {
  [key: string]: any;
}): Application {
  return {
    id: object._id?.toString(),
    users: object.users?.map((id: Types.ObjectId) => id.toString()),
    primaryContact: contactFromJsonResponse(object.primaryContact),
    productType: object.productType?.map(
      (val: string) => ProductType[val as keyof typeof ProductType]
    ),
    description: object.description,
    stage: object.stage,
    decision: object.decision,
    createdAt: DateTime.fromISO(new Date(object.createdAt).toISOString()),
    updatedAt: DateTime.fromISO(new Date(object.updatedAt).toISOString()),
  };
}
