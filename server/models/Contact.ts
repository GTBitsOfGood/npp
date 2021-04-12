export interface Contact {
  name: string;
  email?: string;
  organizationPhone?: string;
  primaryPhone?: string;
}

export function docToContact(object: Record<string, any>): Contact {
  return {
    name: object.name,
    email: object.email,
    organizationPhone: object.organizationPhone,
    primaryPhone: object.primaryPhone,
  };
}

export function contactFromJsonResponse(object: {
  [key: string]: any;
}): Contact {
  return object as Contact;
}
