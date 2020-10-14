import Availability from "./Availability";
import { ObjectId } from "mongodb";
import { connectToDB, EntityDoc } from "./index";
import { Document } from "mongoose";
import { DateTime } from "luxon";

export async function getAvailabilitiesFromStartOfWeek(): Promise<EntityDoc[]> {
  await connectToDB();
  return Availability.find({
    startDatetime: {
      $gte: DateTime.local().startOf("weeks").toISODate(),
    },
  }).sort({
    startDate: -1,
  });
}

export async function addAvailability(availability: {
  [key: string]: any;
}): Promise<EntityDoc> {
  await connectToDB();
  return Availability.create(availability) as Promise<EntityDoc>;
}

export async function deleteAvailability(id: ObjectId): Promise<EntityDoc> {
  await connectToDB();
  return Availability.findByIdAndRemove(id);
}

export async function updateAvailability(
  id: ObjectId,
  updatedFields: any
): Promise<Document | { [key: string]: string }> {
  await connectToDB();

  return Availability.findOneAndUpdate({ _id: id }, updatedFields, {
    upsert: false,
    new: true,
  });
}

export async function getAvailability(id: ObjectId): Promise<EntityDoc> {
  await connectToDB();

  return Availability.findOne({ _id: id });
}
