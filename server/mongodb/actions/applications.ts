import { connectToDB } from "../index";
import { Application } from "../Application";
import { ObjectId } from "mongodb";

export async function addApplication(application: Document) {
  await connectToDB();

  return Application.create(application);
}

export async function getApplications() {
  await connectToDB();

  return Application.find().sort({ submittedAt: -1 });
}

export async function getApplication(id: ObjectId) {
  await connectToDB();

  return Application.findById({ _id: id });
}
