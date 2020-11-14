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

async function updateOrganizationInfo(
  id: ObjectId,
  organizationInfo: Record<string, any>
): Promise<EntityDoc> {
  await connectToDB();

  return UserDocument.findByIdAndUpdate(id, {
    organizationInfo,
  });
}

async function updateOrganizationVerifiedStatus(
  id: ObjectId,
  organizationVerified: boolean
): Promise<EntityDoc> {
  await connectToDB();

  return UserDocument.findByIdAndUpdate(id, {
    organizationVerified,
  });
}

export default {
  getUserById,
  getUserByEmail,
  updateOrganizationInfo,
  updateOrganizationVerifiedStatus,
};
