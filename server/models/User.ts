import { Profile } from "./Profile";

/**
 * This class has an "id" field but because TypeORM is not
 * really designed for MongoDB (NOSQL; "_id"), we can't include it as part of the type.
 * NOTE: You can access the "id" field on this class, but if we include it in the
 * type, a NULL "id" field will be created for all users
 */
export class User {
  // ts-ignored because sometimes set through field injection
  // @ts-ignore
  email: string;
  // @ts-ignore
  emailVerified: boolean;
  // @ts-ignore
  familyName: string;
  // @ts-ignore
  image: string;
  // @ts-ignore
  name: string;
  // @ts-ignore
  nickname: string;
  // @ts-ignore
  roles: string[];
  organizationVerified: boolean;

  constructor(profile: Profile) {
    /*
       TypeORM does field injection when loading from DB, meaning profile can be null

       With the way we currently have next auth updates propagating,
       this only called when the user is initially created. If this changes,
       then extra workarounds will need to be done to prevent organizationVerified
       from being overridden
     */
    if (profile) {
      this.email = profile.email;
      this.name = profile.name;
      this.image = profile.image;
      this.nickname = profile.nickname;
      this.familyName = profile.familyName;
      this.roles = profile.roles || [];
      this.emailVerified = profile.emailVerified;
      this.organizationVerified = false;
    }
  }
}
