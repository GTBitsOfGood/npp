import { ProductType } from "&server/models/ProductType";
import { DateTime } from "luxon";

export interface Application {
  id?: string;
  users: string[];
  organization: Organization;
  primaryContact: Contact;
  productType: ProductType[];
  submittedAt?: DateTime;
  meeting?: string;
  decision?: boolean;
}

export interface Contact {
  name: string;
  email: string;
  phone?: string;
}

export interface Organization {
  organizationName: string;
  mission: string;
  address: Address;
  website?: string;
  phone?: string;
}

export interface Address {
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
}
