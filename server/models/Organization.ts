export interface Organization {
  organizationName: string;
  ein: string;
  website?: string;
  address: Address;
  mission: string;
}

export interface Address {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}
