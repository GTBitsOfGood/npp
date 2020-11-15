import { Application } from "&server/models/Application";
import { StageType } from "&server/models/StageType";

const urls = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  pages: {
    index: "/",
    ssr: "/ssr",
    login: "/login",
    app: {
      index: "/app",
      verification: "/app/verification",
      report: "/app/report",
      application: {
        apply: "/app/application/apply",
        submitted: (id: string) => `/app/application/${id}/submitted`,
        schedule: (id: string) => `/app/application/${id}/schedule`,
        scheduled: (id: string) => `/app/application/${id}/scheduled`,
        review: (id: string) => `/app/application/${id}/review`,
        decision: (id: string) => `/app/application/${id}/decision`,
      },
    },
  },
  api: {
    example: "/api/example",
    availability: "/api/availability",
    application: "/api/application",
    issue: "/api/issue",
    meeting: "/api/meeting",
    user: "/api/user",
  },
};

export const landingUrls = [
  urls.pages.app.index,
  urls.pages.app.index,
  urls.pages.app.index,
];

export const getApplicationUrl = (application: Application) => {
  if (application == null || application.id == null) {
    return urls.pages.app.application.apply;
  }

  switch (application.stage) {
    case StageType.SUBMITTED: {
      return urls.pages.app.application.submitted(application.id);
    }
    case StageType.AWAITING_SCHEDULE: {
      return urls.pages.app.application.schedule(application.id);
    }
    case StageType.SCHEDULED: {
      return urls.pages.app.application.scheduled(application.id);
    }
    case StageType.REVIEW: {
      return urls.pages.app.application.review(application.id);
    }
    case StageType.DECISION: {
      return urls.pages.app.application.decision(application.id);
    }
    default: {
      return urls.pages.app.application.apply;
    }
  }
};

export default urls;
