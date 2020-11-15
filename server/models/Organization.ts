export interface Organization {
  organizationName: string;
  ein: string;
  website?: string;
  address: Address;
}

export interface Address {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}
