import AvailabilityDocument from "../AvailabilityDocument";
import { ObjectId } from "mongodb";
import { connectToDB, EntityDoc } from "../index";
import { Document } from "mongoose";
import { DateTime } from "luxon";

async function getAvailabilitiesFromStartOfWeek(): Promise<EntityDoc[]> {
  await connectToDB();
  return AvailabilityDocument.find({
    startDatetime: {
      $gte: DateTime.local().startOf("weeks").toISODate(),
    },
  }).sort({
    startDate: -1,
  });
}

async function addAvailability(availability: {
  [key: string]: any;
}): Promise<EntityDoc> {
  await connectToDB();
  return AvailabilityDocument.create(availability) as Promise<EntityDoc>;
}

async function deleteAvailability(id: ObjectId): Promise<EntityDoc> {
  await connectToDB();
  return AvailabilityDocument.findByIdAndRemove(id);
}

async function updateAvailability(
  id: ObjectId,
  updatedFields: any
): Promise<Document | { [key: string]: string }> {
  await connectToDB();

  return AvailabilityDocument.findOneAndUpdate({ _id: id }, updatedFields, {
    upsert: false,
    new: true,
  });
}

async function getAvailability(id: ObjectId): Promise<EntityDoc> {
  await connectToDB();

  return AvailabilityDocument.findOne({ _id: id });
}

export default {
  addAvailability,
  deleteAvailability,
  updateAvailability,
  getAvailabilitiesFromStartOfWeek,
  getAvailability,
};
