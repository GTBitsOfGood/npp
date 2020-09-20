import AuthAdapters from "next-auth/adapters";
import { Profile } from "./Profile.interface";

class User extends AuthAdapters.TypeORM.Models.User.model {
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

const UserSchema = {
  name: "User",
  target: User,
  columns: {
    ...AuthAdapters.TypeORM.Models.User.schema.columns,
    nickname: {
      type: "string",
      nullable: false,
    },
    familyName: {
      type: "string",
      nullable: false,
    },
    roles: {
      type: "set",
      nullable: false,
    },
  },
};

export const UserTypeORM = {
  model: User,
  schema: UserSchema,
};
