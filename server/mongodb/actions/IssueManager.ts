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
}): Promise<{
  count: number;
  data: EntityDoc[];
}> {
  await connectToDB();

  const agg = await IssueDocument.aggregate([
    [
      {
        $match: {
          _id: { $exists: true },
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
        },
      },
      {
        $sort: {
          ...(description != null && {
            score: { $meta: "textScore" },
          }),
          ...(sortCreated != null && {
            createdAt: sortCreated,
          }),
          ...(sortUpdated != null && {
            updatedAt: sortUpdated,
          }),
          ...(sortCreated == null &&
            sortUpdated == null && {
              createdAt: -1,
            }),
        },
      },
      {
        $facet: {
          stage1: [{ $group: { _id: null, count: { $sum: 1 } } }],
          stage2:
            limit != null && page != null
              ? [
                  { $skip: Number(limit) * Number(page) },
                  { $limit: Number(limit) },
                ]
              : [],
        },
      },
      { $unwind: "$stage1" },
      {
        $project: {
          count: "$stage1.count",
          data: "$stage2",
        },
      },
    ],
  ]);

  if (agg == null) {
    return {
      count: 0,
      data: [],
    };
  }

  return agg[0];
}

export async function getIssueById(id: Types.ObjectId): Promise<EntityDoc> {
  await connectToDB();
  return IssueDocument.findById(id);
}
