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
  filter,
  sort,
  limit,
}: {
  filter?: {
    product?: string;
    issueType?: IssueType;
    description?: string;
    status?: IssueStatus;
  };
  sort?: {
    createdAt: -1 | 1;
    updatedAt: -1 | 1;
  };
  limit?: {
    number: number;
    page: number;
  };
}): Promise<EntityDoc[]> {
  await connectToDB();

  let search = IssueDocument.find({
    ...(filter?.product != null && {
      product: Types.ObjectId(filter.product),
    }),
    ...(filter?.issueType != null && {
      issueType: filter?.issueType,
    }),
    ...(filter?.status != null && {
      status: filter?.status,
    }),
    ...(filter?.description != null && {
      $text: {
        $search: filter?.description,
      },
    }),
  }).sort({
    ...(filter?.description != null && {
      score: { $meta: "textScore" },
    }),
    ...(sort != null
      ? sort
      : {
          updatedAt: -1,
        }),
  });

  if (limit != null) {
    search = search.skip(limit.number * limit.page).limit(limit.number);
  }

  return search.lean();
}

export async function getIssueById(id: Types.ObjectId): Promise<EntityDoc> {
  await connectToDB();
  return IssueDocument.findById(id);
}
