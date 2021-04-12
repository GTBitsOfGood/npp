export interface TemplatedEmail<T extends Record<string, any>> {
  templateName: string; // the name of the template subdirectory in the templates directory
  locals: T; // the variables that should be passed to pug. they will be serialized and deserialized when passed to the email microservice
}
