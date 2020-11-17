import IssueDocument from "&server/mongodb/IssueDocument";
import { connectToDB, EntityDoc } from "../index";
import { getApplicationById } from "&server/mongodb/actions/ApplicationManager";
import { Types } from "mongoose";
import { IssueType } from "&server/models/IssueType";
import { IssueStatus } from "&server/models/IssueStatus";

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

export async function getIssues({
  product,
  issueType,
  description,
  status,
  sortCreated,
  sortUpdated,
  limit,
  page,
}: {
  product?: string;
  issueType?: IssueType;
  description?: string;
  status?: IssueStatus;
  sortCreated?: -1 | 1;
  sortUpdated?: -1 | 1;
  limit?: number;
  page?: number;
}): Promise<EntityDoc[]> {
  await connectToDB();

  let search = IssueDocument.find({
    ...(product != null && {
      product: Types.ObjectId(product),
    }),
    ...(issueType != null && {
      issueType: issueType,
    }),
    ...(status != null && {
      status: status,
    }),
    ...(description != null && {
      $text: {
        $search: description,
      },
    }),
  }).sort({
    ...(description != null && {
      score: { $meta: "textScore" },
    }),
    ...(sortCreated != null && {
      createdAt: sortCreated,
    }),
    ...(sortUpdated != null && {
      updatedAt: sortUpdated,
    }),
  });

  if (limit != null && page != null) {
    search = search.skip(Number(limit) * Number(page)).limit(Number(limit));
  }

  return search.lean();
}

export async function getIssueById(id: Types.ObjectId): Promise<EntityDoc> {
  await connectToDB();
  return IssueDocument.findById(id);
}
