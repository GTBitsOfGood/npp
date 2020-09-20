import AuthAdapters from "next-auth/adapters";
import { Profile } from "./Profile";

export class User
  extends AuthAdapters.TypeORM.Models.User.model
  implements Profile {
  // ts-ignored because sometimes set through field injection
  // @ts-ignore
  email: string;
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
    super(profile);
    // TypeORM does field injection when loading from DB, meaning profile can be null
    if (profile) {
      this.nickname = profile.nickname;
      this.familyName = profile.familyName;
      this.roles = profile.roles || [];
    }
  }
}
