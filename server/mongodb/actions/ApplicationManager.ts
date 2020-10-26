import { connectToDB } from "../index";
import { Application } from "../Application";
import { ObjectId } from "mongodb";

async function addApplication(application: Document) {
  await connectToDB();

  return Application.create(application);
}

export async function getApplications() {
  await connectToDB();

  return Application.find().sort({ submittedAt: -1 });
}

async function getApplicationById(id: ObjectId) {
  await connectToDB();

  return Application.findById(id);
}

export default {
  addApplication,
  getApplications,
  getApplicationById,
};
