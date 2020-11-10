import { Contact } from "&server/models/Contact";
import { IssueStatus } from "&server/models/IssueStatus";

export interface Issue {
  id: string;
  issueType: string[];
  description: string;
  images: string[];
  contact: Contact;
  status: IssueStatus;
}
