import { TemplatedEmail } from "./TemplatedEmail";
import urls from "&utils/urls";

export class VerifiedEmail implements TemplatedEmail<VerifiedTemplateLocals> {
  readonly templateName = "verified";
  readonly locals: VerifiedTemplateLocals;

  constructor(locals: { name: string }) {
    this.locals = {
      ...locals,
      urlString: urls.pages.app.index,
    };
  }
}

export interface VerifiedTemplateLocals {
  name: string;
  urlString: string;
}
