import { DateTime } from "luxon";
import { Availability } from "&server/models/Availability";

export interface MeetingCore {
  id?: string;
  nonprofit: string; // the user associated with the meeting. update the name of this field
  application: string;
  cancelled?: boolean;
  createdAt?: DateTime;
  updatedAt?: DateTime;
  meetingLink?: string;
  meetingName?: string;
}

export interface Meeting extends MeetingCore {
  availability: string;
}

export interface MeetingWithAvailability extends MeetingCore {
  availability: Availability;
}
