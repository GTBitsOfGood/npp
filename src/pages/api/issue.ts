import { generateMethodRoute } from "&server/routes/RouteFactory";
import * as Authentication from "&server/utils/Authentication";
import * as IssueManager from "&server/mongodb/actions/IssueManager";
import { SessionUser } from "&server/models/SessionUser";
import * as ApplicationManager from "&server/mongodb/actions/ApplicationManager";
import { AuthenticationError } from "&server/utils/AuthenticationError";
import { validateAndSanitizeIdString } from "&server/utils/Validators";
import { PublicError } from "&server/routes/PublicError";

const handler = generateMethodRoute(
  {
    requireSession: true,
  },
  {
    get: async (req) => {
      if (req.query.id) {
        const id = validateAndSanitizeIdString(req.query.id as string);
        return validateUserHasAccessToIssue(
          req.user as SessionUser,
          await IssueManager.getIssueById(id)
        );
      } else if (req.query.userId) {
        const userId = validateAndSanitizeIdString(req.query.userId as string);
        return validateUserHasAccessToIssue(
          req.user as SessionUser,
          await IssueManager.getIssueByUserId(userId)
        );
      } else {
        Authentication.ensureAdmin(req.user);
        return IssueManager.getIssues();
      }
    },
    put: async (req) => {
      if (req.body.create) {
        const issue = req.body.issue;
        await validateUserHasAccessToIssue(req.user as SessionUser, issue);
        const result = await IssueManager.createIssue({
          ...issue,
          dateSubmitted: new Date(),
        });
        if (!result) {
          throw new PublicError("Failed to insert document", 500);
        }
        return result;
      } else {
        const issue = req.body.issue;
        const issueId = req.body.id;
        await validateUserHasAccessToIssue(req.user as SessionUser, issue);
        const result = await IssueManager.completeIssueById(issueId);
        if (!result) {
          throw new PublicError("Failed to update document", 500);
        }
        return result;
      }
    },
  }
);

async function validateUserHasAccessToIssue(
  user: SessionUser,
  issue: Record<string, any>
) {
  if (!issue) {
    return null;
  }

  if (!user.isAdmin) {
    const application = await ApplicationManager.getApplicationById(
      issue.product
    );
    if (application.user != user.id) {
      throw new AuthenticationError(
        "User is trying to access an issue they are not authorized to access"
      );
    }
  }
  return issue;
}

export default handler;
