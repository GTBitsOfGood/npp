import { Types } from "mongoose";
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
      report: {
        landing: "/app/report",
        create: (id: string) => `/app/report/${id}`,
      },
      application: {
        apply: "/app/application/apply",
        submitted: (id: string) => `/app/application/${id}/submitted`,
        schedule: (id: string) => `/app/application/${id}/schedule`,
        scheduled: (id: string) => `/app/application/${id}/scheduled`,
        review: (id: string) => `/app/application/${id}/review`,
        decision: (id: string) => `/app/application/${id}/decision`,
      },
    },
    admin: {
      verification: {
        index: "/admin/verification",
        verify: "/admin/verification/verify",
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

export const getApplicationUrl = (
  application: Application & { _id?: Types.ObjectId }
) => {
  const appId =
    application != null ? application.id ?? application?._id?.toString() : null;
  if (appId == null) {
    return urls.pages.app.application.apply;
  }

  switch (application.stage) {
    case StageType.SUBMITTED: {
      return urls.pages.app.application.submitted(appId);
    }
    case StageType.AWAITING_SCHEDULE: {
      return urls.pages.app.application.schedule(appId);
    }
    case StageType.SCHEDULED: {
      return urls.pages.app.application.scheduled(appId);
    }
    case StageType.REVIEW: {
      return urls.pages.app.application.review(appId);
    }
    case StageType.DECISION: {
      return urls.pages.app.application.decision(appId);
    }
    default: {
      return urls.pages.app.application.apply;
    }
  }
};

export default urls;
