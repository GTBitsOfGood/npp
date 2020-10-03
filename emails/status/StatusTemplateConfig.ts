import { TemplateConfig } from "../TemplateConfig";

export class StatusTemplateConfig
  implements TemplateConfig<StatusTemplateLocals> {
  readonly templateName = "status";
  constructor(public readonly locals: StatusTemplateLocals) {}
}

export interface StatusTemplateLocals {
  name: string;
  status: number;
}
