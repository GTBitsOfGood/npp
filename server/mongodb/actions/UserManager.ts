import { connectToDB, EntityDoc } from "../index";
import UserDocument from "../UserDocument";
import { ObjectId } from "mongodb";
import { ADMIN_ROLE } from "&server/utils/Authentication.ts";

export async function getUserById(id: ObjectId) {
  await connectToDB();

  return UserDocument.findById(id);
}

export async function getUserByEmail(email: string) {
  await connectToDB();

  return UserDocument.findOne({ email: email });
}

export async function upgradeToAdmin(id: ObjectId): Promise<EntityDoc> {
  await connectToDB();
  return UserDocument.findByIdAndUpdate(
    id,
    {
      $$addToSet: { roles: ADMIN_ROLE },
    },
    { new: true }
  );
}

export async function updateOrganizationForUser(
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

export async function updateOrganizationVerifiedStatus(
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
