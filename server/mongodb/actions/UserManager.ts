import { connectToDB, EntityDoc } from "../index";
import UserDocument from "../UserDocument";
import { ObjectId } from "mongodb";
import { Profile } from "&server/models/Profile";
import * as UserManager from "&server/mongodb/actions/UserManager";
import { StatusEmail } from "&server/emails/StatusEmail";
import { sendEmail } from "&server/emails/Email";

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

export async function updateOrganizationVerifiedStatus(
  id: ObjectId,
  organizationVerified: boolean
): Promise<EntityDoc> {
  await connectToDB();

  const user = await UserDocument.findByIdAndUpdate(
    id,
    {
      organizationVerified,
    },
    { new: true }
  );

  const organization = (await UserManager.getUserById(id)).organization;

  // Need verified email template?
  const emailTemplate = new StatusEmail({
    name: organization.name,
    status: 0,
  });

  await sendEmail(user.email, emailTemplate);

  return user;
}
