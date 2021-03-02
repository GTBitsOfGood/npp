import { Types } from "mongoose";
import IssueDocument from "&server/mongodb/IssueDocument";
import { connectToDB, EntityDoc } from "../index";
import { getApplicationById } from "&server/mongodb/actions/ApplicationManager";
import { ObjectId } from "mongodb";
import { identity } from "lodash";

export async function createIssue(
  issue: Record<string, any>
): Promise<EntityDoc> {
  await connectToDB();

  console.log(issue);

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

export async function completeIssueById(id: ObjectId): Promise<EntityDoc> {
  await connectToDB();
  console.log(id);
  return IssueDocument.findByIdAndUpdate(
    id,
    { status: "RESOLVED", dateCompleted: new Date() },
    { new: true }
  );
}

export async function getIssueByUserId(id: ObjectId): Promise<EntityDoc[]> {
  await connectToDB();
  return IssueDocument.find({ user: id }).exec();
}
