import { Organization } from "&server/models/Organization";

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  familyName: string;
  roles: string[];
  organization?: Organization;
}
