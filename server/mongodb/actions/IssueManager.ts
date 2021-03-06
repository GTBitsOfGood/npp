import IssueDocument from "&server/mongodb/IssueDocument";
import { connectToDB, EntityDoc } from "../index";
import { getApplicationById } from "&server/mongodb/actions/ApplicationManager";
import { ObjectId } from "mongodb";

export async function createIssue(
  issue: Record<string, any>
): Promise<EntityDoc> {
  await connectToDB();
  console.log("test");

  if (issue.product == null || issue.product === "") {
    throw new Error("Product must be provided!");
  }

  const application = await getApplicationById(issue.product);
  if (application == null) {
    throw new Error("Invalid product provided!");
  }
  if (application.decision != true) {
    throw new Error(
      "Can't create an issue for an application that has not been decided"
    );
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
