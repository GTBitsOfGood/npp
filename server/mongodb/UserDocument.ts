import mongoose, { Schema } from "mongoose";
import * as Authentication from "&server/utils/Authentication";

const AddressSchema = new Schema({
  streetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
});

const OrganizationSchema = new Schema({
  organizationName: {
    type: String,
    required: true,
  },
  ein: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  address: {
    type: AddressSchema,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
});

const UserSchema = new Schema(
  {
    nickname: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    familyName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      immutable: true,
    },
    updatedAt: {
      type: Date,
      required: true,
    },
    roles: {
      type: [String], // maybe change to enum once we know all the roles
      required: true,
    },
    organization: {
      type: OrganizationSchema,
      required: false,
    },
    // we need to keep this field because the admin needs to validate the organization info
    organizationVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);
UserSchema.statics.isAdminUser = function () {
  return this.roles.includes(Authentication.ADMIN_ROLE);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
