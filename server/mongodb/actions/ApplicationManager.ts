import { connectToDB, EntityDoc } from "../index";
import { ObjectId } from "mongodb";
import ApplicationDocument from "&server/mongodb/ApplicationDocument";
import { SessionUser } from "&server/models/SessionUser";
import { StageType } from "&server/models/StageType";

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

  let applications = ApplicationDocument.find(findBy).sort({
    createdAt: -1,
  });

  if (user.isAdmin && query.all) {
    applications = applications.populate({
      path: "users",
      model: "User",
    });
  }

  return applications.lean();
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

  return ApplicationDocument.findByIdAndUpdate(
    id,
    { stage },
    { upsert: false, new: true }
  );
}

export async function updateApplicationDecision(
  id: ObjectId,
  decision: boolean
): Promise<EntityDoc> {
  await connectToDB();

  return ApplicationDocument.findByIdAndUpdate(
    id,
    { decision },
    { upsert: false, new: true }
  );
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
