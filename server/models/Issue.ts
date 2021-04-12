import { IssueType } from "&server/models/IssueType";
import { Contact } from "&server/models/Contact";
import { IssueStatus } from "&server/models/IssueStatus";
import { DateTime } from "luxon";

export interface Issue {
  id?: string;
  product?: string;
  issueType: IssueType[];
  description: string;
  images: string[];
  contact: Contact;
  status?: IssueStatus;
  user: string;
  createdAt?: DateTime;
  updatedAt?: DateTime;
  dateSubmitted?: DateTime;
  dateCompleted?: DateTime;
}
