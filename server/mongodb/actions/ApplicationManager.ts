import { connectToDB, EntityDoc } from "../index";
import { ObjectId } from "mongodb";
import ApplicationDocument from "&server/mongodb/ApplicationDocument";
import { SessionUser } from "&server/models/SessionUser";
import { StageType } from "&server/models/StageType";
import { DateTime } from "luxon";
import { Application } from "&server/models/Application";
import { Types } from "mongoose";
import { docToContact } from "&server/models/Contact";

export async function addApplication(
  application: Record<string, any>
): Promise<Application> {
  await connectToDB();

  return docToApplication(await ApplicationDocument.create(application));
}

export async function getApplications(
  user: SessionUser,
  query: Record<string, unknown> = {}
): Promise<Application[]> {
  await connectToDB();

  const findBy = user.isAdmin && query.all ? {} : { users: user.id };

  return (
    await ApplicationDocument.find(findBy)
      .sort({
        createdAt: -1,
      })
      .lean()
  ).map(docToApplication);
}

export async function getApplicationIdsByStage(
  stage: StageType
): Promise<string[]> {
  await connectToDB();

  const applications = await ApplicationDocument.find({
    stage,
  })
    .sort({
      createdAt: -1,
    })
    .distinct("_id");

  return applications.map((i) => i.toString());
}

export async function getAcceptedApplication(
  user: SessionUser
): Promise<Application> {
  await connectToDB();

  return docToApplication(
    await ApplicationDocument.findOne({
      stage: StageType.DECISION,
      decision: true,
      users: user.id,
    }).sort({
      createdAt: -1,
    })
  );
}

export async function getApplicationById(id: ObjectId): Promise<Application> {
  await connectToDB();

  const application = await ApplicationDocument.findById(id);

  if (application == null) {
    throw new Error("Application does not exist!");
  }

  return docToApplication(application);
}

export async function deleteApplication(id: ObjectId): Promise<EntityDoc> {
  await connectToDB();
  return ApplicationDocument.findByIdAndRemove(id);
}

export async function updateApplicationStage(
  id: ObjectId,
  stage: StageType
): Promise<Application> {
  await connectToDB();

  return docToApplication(
    await ApplicationDocument.findByIdAndUpdate(
      id,
      { stage },
      { upsert: false, new: true }
    )
  );
}

export async function updateApplicationDecision(
  id: ObjectId,
  decision: boolean
): Promise<Application> {
  await connectToDB();

  return docToApplication(
    await ApplicationDocument.findByIdAndUpdate(
      id,
      { decision },
      { upsert: false, new: true }
    )
  );
}

export async function updateApplicationMeeting(
  id: ObjectId,
  meetingId: ObjectId
): Promise<Application> {
  await connectToDB();

  return docToApplication(
    await ApplicationDocument.findByIdAndUpdate(
      id,
      { meeting: meetingId },
      { upsert: false, new: true }
    )
  );
}

export function docToApplication(object: { [key: string]: any }): Application {
  return {
    id: object._id.toString(),
    users: object.users?.map((id: Types.ObjectId) => id.toString()),
    primaryContact: docToContact(object.primaryContact),
    productType: object.productType,
    description: object.description,
    stage: object.stage,
    decision: object.decision,
    createdAt: DateTime.fromISO(new Date(object.createdAt).toISOString()),
    updatedAt: DateTime.fromISO(new Date(object.updatedAt).toISOString()),
  };
}
