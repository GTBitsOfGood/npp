import { TemplatedEmail } from "../TemplatedEmail";
import urls from "&utils/urls";

export class StatusEmail implements TemplatedEmail<StatusTemplateLocals> {
  readonly templateName = "status";
  readonly locals: StatusTemplateLocals;

  constructor(locals: { name: string; status: number }) {
    this.locals = {
      ...locals,
      urlString: urls.pages.app.index,
    };
  }
}

export interface StatusTemplateLocals {
  name: string;
  status: number;
  urlString: string;
}
