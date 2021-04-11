import AvailabilityDocument from "../AvailabilityDocument";
import { ObjectId } from "mongodb";
import { connectToDB, EntityDoc } from "../index";
import { DateTime } from "luxon";
import { Availability } from "&server/models/Availability";

export async function getAvailabilitiesFromStartOfMonth(
  date: string
): Promise<Availability[]> {
  await connectToDB();

  return (
    await AvailabilityDocument.find({
      isBooked: false,
      startDatetime: {
        $gte: DateTime.fromISO(date).startOf("month").toISODate(),
      },
    })
      .sort({
        startDate: -1,
      })
      .lean()
  ).map(docToAvailability);
}

export async function addAvailability(availability: {
  [key: string]: any;
}): Promise<Availability> {
  await connectToDB();
  return docToAvailability(await AvailabilityDocument.create(availability));
}

export async function deleteAvailability(id: ObjectId): Promise<EntityDoc> {
  await connectToDB();
  return AvailabilityDocument.findByIdAndRemove(id);
}

export async function updateAvailability(
  id: ObjectId,
  updatedFields: any
): Promise<Availability> {
  await connectToDB();

  return docToAvailability(
    await AvailabilityDocument.findOneAndUpdate({ _id: id }, updatedFields, {
      upsert: false,
      new: true,
    })
  );
}

export async function getAvailabilityById(id: ObjectId): Promise<Availability> {
  await connectToDB();

  return docToAvailability(await AvailabilityDocument.findOne({ _id: id }));
}

export function docToAvailability(object: {
  [key: string]: any;
}): Availability {
  return {
    id: object._id.toString(),
    interviewer: object.interviewer.toString(),
    startDatetime: DateTime.fromISO(object.startDatetime.toISOString()),
    endDatetime: DateTime.fromISO(object.endDatetime.toISOString()),
    isBooked: object.isBooked,
  };
}
