export interface Contact {
  name: string;
  organizationPhone?: string;
  primaryPhone?: string;
}

export function contactFromJsonResponse(object: Record<string, any>): Contact {
  return {
    name: object.name,
    organizationPhone: object.organizationPhone,
    primaryPhone: object.primaryPhone,
  };
}
