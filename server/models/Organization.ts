import { DateTime } from "luxon";

export interface Organization {
  organizationName: string;
  ein: string;
  website?: string;
  address: Address;
  mission: string;
  dateSubmitted: DateTime;
}

export interface Address {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}
