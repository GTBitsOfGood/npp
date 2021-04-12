import { ProductType } from "&server/models/ProductType";
import { DateTime } from "luxon";
import { Contact } from "&server/models/Contact";
import { StageType } from "&server/models/StageType";

export interface Application {
  id: string;
  user: string;
  primaryContact: Contact;
  productType: ProductType[];
  description: string;
  stage: StageType;
  createdAt: DateTime;
  updatedAt: DateTime;
  decision?: boolean;
}
