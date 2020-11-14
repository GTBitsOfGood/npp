import { connectToDB, EntityDoc } from "../index";
import { ObjectId } from "mongodb";
import ApplicationDocument from "&server/mongodb/ApplicationDocument";
import { SessionUser } from "&server/models/SessionUser";

async function addApplication(
  application: Record<string, any>
): Promise<EntityDoc> {
  await connectToDB();

  return ApplicationDocument.create(application);
}

async function getApplications(
  user: SessionUser,
  query: Record<string, unknown> = {}
): Promise<EntityDoc[]> {
  await connectToDB();

  const findBy = user.isAdmin && query.all ? {} : { users: user.id };

  return ApplicationDocument.find(findBy).sort({ createdAt: -1 }).lean();
}

async function getApplicationById(id: ObjectId): Promise<EntityDoc> {
  await connectToDB();

  return ApplicationDocument.findById(id);
}

async function deleteApplication(id: ObjectId): Promise<EntityDoc> {
  await connectToDB();
  return ApplicationDocument.findByIdAndRemove(id);
}

async function updateApplicationDecision(
  id: ObjectId,
  decision: boolean
): Promise<EntityDoc> {
  await connectToDB();

  return ApplicationDocument.findOneAndUpdate(
    { _id: id },
    { decision },
    { upsert: false, new: true }
  );
}

async function updateApplicationMeeting(
  id: ObjectId,
  meetingId: ObjectId
): Promise<EntityDoc> {
  await connectToDB();

  return ApplicationDocument.findOneAndUpdate(
    { _id: id },
    { meeting: meetingId },
    { upsert: false, new: true }
  );
}

export default {
  addApplication,
  getApplications,
  getApplicationById,
  deleteApplication,
  updateApplicationDecision,
  updateApplicationMeeting,
};
