const urls = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  pages: {
    index: "/",
    ssr: "/ssr",
    login: "/login",
    app: {
      index: "/app",
      apply: "/app/apply",
      project: "/app/project",
      scheduled: "/app/scheduled",
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

export const landingUrls = [urls.pages.app.project, urls.pages.app.scheduled];

export default urls;
