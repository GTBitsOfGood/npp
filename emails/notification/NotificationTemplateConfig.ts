import { TemplateConfig } from "../TemplateConfig";

export class NotificationTemplateConfig
  implements TemplateConfig<NotificationTemplateLocals> {
  readonly templateName = "status";
  constructor(public readonly locals: NotificationTemplateLocals) {}
}

export interface NotificationTemplateLocals {
  name: string;
}
