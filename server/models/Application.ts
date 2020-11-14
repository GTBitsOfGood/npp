import { ProductType } from "&server/models/ProductType";
import { DateTime } from "luxon";
import { Contact } from "&server/models/Contact";

export interface Application {
  id?: string;
  users?: string[];
  primaryContact: Contact;
  productType: ProductType[];
  description: string;
  submittedAt?: DateTime;
  meeting?: string;
  decision?: boolean;
}
