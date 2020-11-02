import { DateTime } from "luxon";

export interface Meeting {
  id: string;
  interviewer: string;
  startDatetime: DateTime;
  nonprofit: string;
  application: string;
  contactName: string;
  contactPhone: string;
}
