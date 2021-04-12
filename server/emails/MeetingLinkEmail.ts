import { TemplatedEmail } from "&server/emails/TemplatedEmail";
import { DateTime } from "luxon";

export class MeetingLinkEmail
  implements TemplatedEmail<MeetingLinkEmailLocals> {
  readonly locals: MeetingLinkEmailLocals;
  readonly templateName = "meeting-link";

  constructor({
    name,
    meetingLink,
    meetingDateTime,
  }: {
    name: string;
    meetingLink: string;
    meetingDateTime: DateTime;
  }) {
    this.locals = {
      name,
      meetingLink,
      startDate: meetingDateTime.toLocaleString(DateTime.DATE_FULL),
      startTime: meetingDateTime.toFormat("t ZZZZ"),
    };
  }
}

export interface MeetingLinkEmailLocals {
  name: string;
  meetingLink: string;
  startDate: string;
  startTime: string;
}
