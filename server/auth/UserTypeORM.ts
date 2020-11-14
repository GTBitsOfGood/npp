import { User } from "../models";

const UserTypeORMSchema = {
  name: "User",
  target: User,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      nullable: true,
    },
    email: {
      type: "varchar",
      unique: true,
      nullable: true,
    },
    emailVerified: {
      type: "boolean",
      nullable: true,
    },
    image: {
      type: "varchar",
      nullable: true,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
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
    organizationVerified: {
      type: "boolean",
      nullable: false,
      default: false,
    },
  },
};

export const UserTypeORM = {
  model: User,
  schema: UserTypeORMSchema,
};
