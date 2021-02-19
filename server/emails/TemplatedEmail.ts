export interface TemplatedEmail<T extends Record<string, any>> {
  templateName: string;
  locals: T;
}
