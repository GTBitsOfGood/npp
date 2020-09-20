import AuthAdapters from "next-auth/adapters";
import { User } from "../models";

const UserTypeORMSchema = {
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
  schema: UserTypeORMSchema,
};
