import { connectToDB, EntityDoc } from "../index";
import UserDocument from "../UserDocument";
import { ObjectId } from "mongodb";

export async function getUserById(id: ObjectId) {
  await connectToDB();

  return UserDocument.findById(id);
}

export async function getUserByEmail(email: string) {
  await connectToDB();

  return UserDocument.findOne({ email: email });
}

export async function updateOrganizationInfo(
  id: ObjectId,
  organizationInfo: Record<string, any>
): Promise<EntityDoc> {
  await connectToDB();

  return UserDocument.findByIdAndUpdate(id, {
    organizationInfo,
  });
}

export async function updateOrganizationVerifiedStatus(
  id: ObjectId,
  organizationVerified: boolean
): Promise<EntityDoc> {
  await connectToDB();

  return UserDocument.findByIdAndUpdate(id, {
    organizationVerified,
  });
}
