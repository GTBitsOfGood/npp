import { connectToDB, EntityDoc } from "../index";
import UserDocument from "../UserDocument";
import { ObjectId } from "mongodb";

async function getUserById(id: ObjectId) {
  await connectToDB();

  return UserDocument.findById(id);
}

async function getUserByEmail(email: string) {
  await connectToDB();

  return UserDocument.findOne({ email: email });
}

async function updateOrganizationForUser(
  id: ObjectId,
  organization: Record<string, any>
): Promise<EntityDoc> {
  await connectToDB();

  return UserDocument.findByIdAndUpdate(
    id,
    {
      organization,
    },
    { new: true }
  );
}

async function updateOrganizationVerifiedStatus(
  id: ObjectId,
  organizationVerified: boolean
): Promise<EntityDoc> {
  await connectToDB();

  return UserDocument.findByIdAndUpdate(
    id,
    {
      organizationVerified,
    },
    { new: true }
  );
}

export default {
  getUserById,
  getUserByEmail,
  updateOrganizationForUser,
  updateOrganizationVerifiedStatus,
};
