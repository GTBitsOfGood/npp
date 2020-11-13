import { IssueType } from "&server/models/IssueType";
import { Contact } from "&server/models/Contact";
import { IssueStatus } from "&server/models/IssueStatus";

export interface Issue {
  id: string;
  issueType: IssueType[];
  description: string;
  images: string[];
  contact: Contact;
  status: IssueStatus;
}
