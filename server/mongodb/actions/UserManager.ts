import { connectToDB, EntityDoc } from "../index";
import UserDocument from "../UserDocument";
import { ObjectId } from "mongodb";
import { Profile } from "&server/models/Profile";
import { OrganizationStatus } from "&server/models/OrganizationStatus";

export async function getUsers() {
  await connectToDB();
  return UserDocument.find({ organization: { $ne: null } });
}

export async function getUserById(id: ObjectId) {
  await connectToDB();

  return UserDocument.findById(id);
}

export async function getUserByEmail(email: string, lean = false) {
  await connectToDB();

  return UserDocument.findOne({ email: email }, {}, { lean });
}

export async function upsertUserByProviderProfile(
  profile: Profile
): Promise<Record<string, any>> {
  await connectToDB();
  return UserDocument.findOneAndUpdate({ email: profile.email }, profile, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  }).lean(); // improve performance with lean
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

export async function updateOrgStatus(
  id: ObjectId,
  orgStatus: OrganizationStatus
): Promise<EntityDoc> {
  await connectToDB();

  return UserDocument.findByIdAndUpdate(
    id,
    {
      orgStatus,
    },
    { new: true }
  );
}
