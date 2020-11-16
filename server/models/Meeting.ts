import { DateTime } from "luxon";

export interface Meeting {
  id?: string;
  availability: string;
  nonprofit: string;
  application: string;
  createdAt?: DateTime;
  updatedAt?: DateTime;
}
