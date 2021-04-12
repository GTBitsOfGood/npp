import { connectToDB, EntityDoc } from "../index";
import UserDocument from "../UserDocument";
import { ObjectId } from "mongodb";
import { Profile } from "&server/models/Profile";
import { OrganizationStatus } from "&server/models/OrganizationStatus";
import stringSimilarity from "string-similarity";

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

  let orgStatus = OrganizationStatus.Pending;
  try {
    const response = await fetch(
      `https://projects.propublica.org/nonprofits/api/v2/organizations/` +
        `${organization.ein.replace("-", "")}.json`
    );

    const given = organization.organizationName.toLowerCase();
    const found = (await response.json()).organization.name.toLowerCase();
    if (stringSimilarity.compareTwoStrings(given, found) > 0.333)
      orgStatus = OrganizationStatus.Verified;
  } catch (err) {
    console.error(err.message);
  }

  return UserDocument.findByIdAndUpdate(
    id,
    {
      organization,
      orgStatus,
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
