import { Issue } from "&server/models/Issue";
import { IssueStatus } from "&server/models/IssueStatus";
import { callInternalAPI } from "&server/utils/ActionUtils";
import { HttpMethod } from "&server/models/HttpMethod";
import urls from "&utils/urls";

const issueRoute = urls.api.issue;

async function getIssueById(issueId: string): Promise<Issue> {
  const response: Record<string, any> = await callInternalAPI(
    issueRoute + `?id=${issueId}`,
    HttpMethod.GET
  );
  return issueFromJsonResponse(response);
}

async function getIssues(): Promise<Issue[]> {
  const response: Record<string, any> = await callInternalAPI(
    issueRoute,
    HttpMethod.GET
  );
  return response.map(issueFromJsonResponse);
}

async function createIssue(issue: Issue): Promise<Issue> {
  const response: Record<string, any> = await callInternalAPI(
    issueRoute,
    HttpMethod.PUT,
    {
      issue,
    }
  );

  return issueFromJsonResponse(response);
}

function issueFromJsonResponse(object: Record<string, any>): Issue {
  return {
    id: object._id,
    issueType: object.issueType,
    description: object.description,
    images: object.images,
    contact: object.contact,
    status: IssueStatus[(object.status as string) as keyof typeof IssueStatus],
  };
}

export default {
  getIssueById,
  getIssues,
  createIssue,
};
