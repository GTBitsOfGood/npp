import { connectToDB } from "../index";
import UserDocument from "../UserDocument";
import { ObjectId } from "mongodb";

async function getUserById(id: ObjectId) {
  await connectToDB();

  return UserDocument.findById(id);
}

async function getUserByEmail(email: string) {
  await connectToDB();

  return UserDocument.findOne({ email: email });
}

export default {
  getUserById,
  getUserByEmail,
};
