import { Profile } from "./Profile";

export class User implements Profile {
  // ts-ignored because sometimes set through field injection
  // @ts-ignore
  email: string;
  // @ts-ignore
  emailVerified: boolean;
  // @ts-ignore
  familyName: string;
  // @ts-ignore
  id: string;
  // @ts-ignore
  image: string;
  // @ts-ignore
  name: string;
  // @ts-ignore
  nickname: string;
  // @ts-ignore
  roles: string[];

  constructor(profile: Profile) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    // TypeORM does field injection when loading from DB, meaning profile can be null
    if (profile) {
      this.email = profile.email;
      this.name = profile.name;
      this.image = profile.image;
      this.nickname = profile.nickname;
      this.familyName = profile.familyName;
      this.roles = profile.roles || [];
      this.emailVerified = profile.emailVerified;
    }
  }
}
