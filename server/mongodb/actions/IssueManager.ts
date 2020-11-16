import IssueDocument from "&server/mongodb/IssueDocument";
import { connectToDB, EntityDoc } from "../index";
import { getApplicationById } from "&server/mongodb/actions/ApplicationManager";
import { ObjectId } from "mongodb";

export async function createIssue(
  issue: Record<string, any>
): Promise<EntityDoc> {
  await connectToDB();

  if (issue.product == null || issue.product === "") {
    throw new Error("Product must be provided!");
  }

  const application = await getApplicationById(issue.product);
  if (application == null || application.decision != true) {
    throw new Error("Invalid product provided!");
  }

  return IssueDocument.create(issue);
}

export async function getIssues(): Promise<EntityDoc[]> {
  await connectToDB();
  return IssueDocument.find().sort({ updatedAt: -1 });
}

export async function getIssueById(id: ObjectId): Promise<EntityDoc> {
  await connectToDB();
  return IssueDocument.findById(id);
}
