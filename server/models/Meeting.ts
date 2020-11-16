import { DateTime } from "luxon";

export interface Meeting {
  id?: string;
  availability: string;
  nonprofit: string;
  application: string;
  cancelled?: boolean;
  createdAt?: DateTime;
  updatedAt?: DateTime;
}
