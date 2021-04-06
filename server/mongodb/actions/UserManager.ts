import { connectToDB, EntityDoc } from "../index";
import UserDocument from "../UserDocument";
import { ObjectId } from "mongodb";
import { Profile } from "&server/models/Profile";
import stringSimilarity from "string-similarity";

export async function getUserById(id: ObjectId) {
  await connectToDB();

  return UserDocument.findById(id);
}

export async function getUserByEmail(email: string) {
  await connectToDB();

  return UserDocument.findOne({ email: email });
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

  let organizationVerified;
  try {
    const response = await fetch(
      `https://projects.propublica.org/nonprofits/api/v2/organizations/` +
        `${organization.ein.replace("-", "")}.json`
    );
    const similarity = stringSimilarity.compareTwoStrings(
      (await response.json()).organization.name.toLowerCase(),
      organization.organizationName.toLowerCase()
    );
    organizationVerified = similarity > 0.333;
  } catch (err) {
    organizationVerified = false;
  }

  return UserDocument.findByIdAndUpdate(
    id,
    {
      organization,
      organizationVerified,
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
