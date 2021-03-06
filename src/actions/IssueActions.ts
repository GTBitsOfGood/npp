import { Issue } from "&server/models/Issue";
import { IssueStatus } from "&server/models/IssueStatus";
import { IssueType } from "&server/models/IssueType";
import { callInternalAPI } from "&server/utils/ActionUtils";
import { HttpMethod } from "&server/models/HttpMethod";
import urls from "&utils/urls";
import { contactFromJsonResponse } from "&server/models/Contact";

const issueRoute = urls.api.issue;

export async function getIssueById(issueId: string): Promise<Issue> {
  const response: Record<string, any> = await callInternalAPI(
    issueRoute + `?id=${issueId}`,
    HttpMethod.GET
  );
  return issueFromJsonResponse(response);
}

export async function getIssues(): Promise<Issue[]> {
  const response: Record<string, any> = await callInternalAPI(
    issueRoute,
    HttpMethod.GET
  );
  return response.map(issueFromJsonResponse);
}

export async function createIssue(issue: Issue): Promise<Issue> {
  const response: Record<string, any> = await callInternalAPI(
    issueRoute,
    HttpMethod.PUT,
    {
      create: true,
      issue,
    }
  );

  return issueFromJsonResponse(response);
}

export function issueFromJsonResponse(object: Record<string, any>): Issue {
  return {
    id: object._id?.toString(),
    issueType: object.issueType as IssueType[],
    description: object.description,
    images: object.images,
    contact: contactFromJsonResponse(object.contact),
    status: IssueStatus[(object.status as string) as keyof typeof IssueStatus],
    user: object.user && object.user.toString(),
  };
}
