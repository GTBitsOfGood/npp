import { Issue } from "&server/models/Issue";
import { IssueStatus } from "&server/models/IssueStatus";
import { IssueType } from "&server/models/IssueType";
import { callInternalAPI } from "&server/utils/ActionUtils";
import { HttpMethod } from "&server/models/HttpMethod";
import urls from "&utils/urls";
import { contactFromJsonResponse } from "&server/models/Contact";

const issueRoute = urls.api.issue;

const getQueryString = (params: Record<string, unknown>) => {
  const paramsWithoutUndefined = Object.keys(params).reduce((accum, key) => {
    if (params[key] !== undefined) {
      accum[key] = params[key];
    }

    return accum;
  }, {} as Record<string, any>);

  return Object.keys(paramsWithoutUndefined).length > 0
    ? "?" + new URLSearchParams(paramsWithoutUndefined).toString()
    : "";
};

export async function getIssueById(issueId: string): Promise<Issue> {
  const response: Record<string, any> = await callInternalAPI(
    issueRoute + `?id=${issueId}`,
    HttpMethod.GET
  );
  return issueFromJsonResponse(response);
}

export async function getIssues(params: {
  product?: string;
  issueType?: IssueType;
  description?: string;
  status?: IssueStatus;
  sortCreated?: -1 | 1;
  sortUpdated?: -1 | 1;
  limit?: number;
  page?: number;
}): Promise<Issue[]> {
  const response: Record<string, any> = await callInternalAPI(
    issueRoute + getQueryString(params),
    HttpMethod.GET
  );
  return response.map(issueFromJsonResponse);
}

export async function createIssue(issue: Issue): Promise<Issue> {
  const response: Record<string, any> = await callInternalAPI(
    issueRoute,
    HttpMethod.PUT,
    {
      issue,
    }
  );

  return issueFromJsonResponse(response);
}

export function issueFromJsonResponse(object: Record<string, any>): Issue {
  return {
    id: object._id?.toString(),
    issueType: object.issueType.map((val: string) => {
      return IssueType[val as keyof typeof IssueType];
    }),
    description: object.description,
    images: object.images,
    contact: contactFromJsonResponse(object.contact),
    status: IssueStatus[(object.status as string) as keyof typeof IssueStatus],
  };
}
