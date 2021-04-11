import { TemplatedEmail } from "./TemplatedEmail";

export class NotificationEmail
  implements TemplatedEmail<NotificationTemplateLocals> {
  readonly templateName = "notification";
  constructor(public readonly locals: NotificationTemplateLocals) {}
}

export interface NotificationTemplateLocals {
  name: string;
}
