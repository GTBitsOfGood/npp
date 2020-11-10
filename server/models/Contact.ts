export interface Contact {
  name: string;
  email: string;
  phone?: string;
}

export function contactFromJsonResponse(object: Record<string, any>): Contact {
  return {
    name: object.name,
    email: object.email,
    phone: object.phone,
  };
}
