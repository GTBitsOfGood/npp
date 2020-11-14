import IssueDocument from "&server/mongodb/IssueDocument";
import { connectToDB, EntityDoc } from "../index";
import { ObjectId } from "mongodb";

export async function createIssue(
  issue: Record<string, any>
): Promise<EntityDoc> {
  await connectToDB();
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
