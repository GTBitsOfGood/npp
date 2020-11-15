import { ProductType } from "&server/models/ProductType";
import { DateTime } from "luxon";
import { Contact } from "&server/models/Contact";
import { StageType } from "&server/models/StageType";

export interface Application {
  id?: string;
  users?: string[];
  primaryContact: Contact;
  productType: ProductType[];
  description: string;
  meeting?: string;
  stage?: StageType;
  decision?: boolean;
  createdAt?: DateTime;
  updatedAt?: DateTime;
}
