import AvailabilityDocument from "../AvailabilityDocument";
import { ObjectId } from "mongodb";
import { connectToDB, EntityDoc } from "../index";
import { Document } from "mongoose";
import { DateTime } from "luxon";

export async function getAvailabilitiesFromStartOfMonth(
  date: string
): Promise<EntityDoc[]> {
  await connectToDB();

  return AvailabilityDocument.find({
    isBooked: false,
    startDatetime: {
      $gte: DateTime.fromISO(date).startOf("month").toISODate(),
    },
  }).sort({
    startDate: -1,
  });
}

export async function addAvailability(availability: {
  [key: string]: any;
}): Promise<EntityDoc> {
  await connectToDB();
  return AvailabilityDocument.create(availability) as Promise<EntityDoc>;
}

export async function deleteAvailability(id: ObjectId): Promise<EntityDoc> {
  await connectToDB();
  return AvailabilityDocument.findByIdAndRemove(id);
}

export async function updateAvailability(
  id: ObjectId,
  updatedFields: any
): Promise<Document | { [key: string]: string }> {
  await connectToDB();

  return AvailabilityDocument.findOneAndUpdate({ _id: id }, updatedFields, {
    upsert: false,
    new: true,
  });
}

export async function getAvailabilityById(id: ObjectId): Promise<EntityDoc> {
  await connectToDB();

  return AvailabilityDocument.findOne({ _id: id });
}
