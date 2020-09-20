import { Schema } from "mongoose";
import * as mongoose from "mongoose";

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  nickname: {
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
});

export const User = mongoose.model("User", schema);
