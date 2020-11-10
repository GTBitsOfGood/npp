import { DateTime } from "luxon";
import { Application } from "&server/models/Application";
import { ProductType } from "&server/models/ProductType";
import { callInternalAPI } from "&server/utils/ActionUtils";
import { HttpMethod } from "&server/models/HttpMethod";
import urls from "&utils/urls";
import { contactFromJsonResponse } from "&server/models/Contact";

const applicationRoute = urls.api.application;

async function createApplication(
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

async function getApplicationById(applicationId: string): Promise<Application> {
  const response: Record<string, any> = await callInternalAPI(
    applicationRoute + `?id=${applicationId}`,
    HttpMethod.GET
  );
  return applicationFromJson(response);
}

async function getApplications(): Promise<Application[]> {
  const response: Record<string, any>[] = await callInternalAPI(
    applicationRoute,
    HttpMethod.GET
  );
  return response.map(applicationFromJson);
}

async function deleteApplication(applicationId: string): Promise<Application> {
  const response: Record<string, any> = await callInternalAPI(
    applicationRoute + `?id=${applicationId}`,
    HttpMethod.DELETE
  );
  return applicationFromJson(response);
}

async function updateApplicationDecision(
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

async function updateApplicationMeeting(
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

function applicationFromJson(object: { [key: string]: any }): Application {
  return {
    id: object._id,
    users: object.users,
    organization: object.organization,
    primaryContact: contactFromJsonResponse(object.primaryContact),
    productType: object.productType.map((val: string) => {
      return ProductType[val as keyof typeof ProductType];
    }),
    submittedAt: DateTime.fromISO(object.submittedAt),
    meeting: object.meeting,
    decision: object.decision,
  };
}

export default {
  createApplication,
  getApplicationById,
  getApplications,
  deleteApplication,
  updateApplicationDecision,
  updateApplicationMeeting,
};
