import { connectToDB, EntityDoc } from "../index";
import { ObjectId } from "mongodb";
import ApplicationDocument from "&server/mongodb/ApplicationDocument";
import { SessionUser } from "&server/models/SessionUser";
import { StageType, stageToIndex } from "&server/models/StageType";
import { sendEmail } from "&server/emails/Email";
import { StatusEmail } from "&server/emails/StatusEmail";
import { Types } from "mongoose";
import * as UserManager from "&server/mongodb/actions/UserManager";

export async function addApplication(
  application: Record<string, any>
): Promise<EntityDoc> {
  await connectToDB();

  return ApplicationDocument.create(application);
}

export async function getApplications(
  user: SessionUser,
  query: Record<string, unknown> = {}
): Promise<EntityDoc[]> {
  await connectToDB();

  const findBy = user.isAdmin && query.all ? {} : { users: user.id };

  return ApplicationDocument.find(findBy)
    .sort({
      createdAt: -1,
    })
    .lean();
}

export async function getApplicationsByStage(
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
): Promise<EntityDoc> {
  await connectToDB();

  return ApplicationDocument.findOne({
    stage: StageType.DECISION,
    decision: true,
    users: user.id,
  }).sort({
    createdAt: -1,
  });
}

export async function getApplicationById(id: ObjectId): Promise<EntityDoc> {
  await connectToDB();

  const application = await ApplicationDocument.findById(id);

  if (application == null) {
    throw new Error("Application does not exist!");
  }

  return application;
}

export async function deleteApplication(id: ObjectId): Promise<EntityDoc> {
  await connectToDB();
  return ApplicationDocument.findByIdAndRemove(id);
}

export async function updateApplicationStage(
  id: ObjectId,
  stage: StageType
): Promise<EntityDoc> {
  await connectToDB();

  const application = await ApplicationDocument.findByIdAndUpdate(
    id,
    { stage },
    { upsert: false, new: true }
  );

  // Awaiting scheduling meeting
  if (stageToIndex[stage] === 1) {
    await sendApplicationEmail(application, 1);
  }

  return application;
}

export async function updateApplicationDecision(
  id: ObjectId,
  decision: boolean
): Promise<EntityDoc> {
  await connectToDB();

  const application = await ApplicationDocument.findByIdAndUpdate(
    id,
    { decision },
    { upsert: false, new: true }
  );

  // Decision made status is 4
  // Might need a custom template for this including the decision ? Ask Bryce
  await sendApplicationEmail(application, 4);

  return application;
}

export async function updateApplicationMeeting(
  id: ObjectId,
  meetingId: ObjectId
): Promise<EntityDoc> {
  await connectToDB();

  return ApplicationDocument.findByIdAndUpdate(
    id,
    { meeting: meetingId },
    { upsert: false, new: true }
  );
}

async function sendApplicationEmail(
  application: any,
  stage: number
): Promise<void> {
  const organization = (
    await UserManager.getUserById(Types.ObjectId(application.users[0]))
  ).organization;

  const emailTemplate = new StatusEmail({
    name: organization.name,
    status: stage,
  });

  await sendEmail(application.primaryContact.email, emailTemplate);
}
