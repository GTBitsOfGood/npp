const urls = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  pages: {
    index: "/",
    ssr: "/ssr",
    login: "/login",
    app: {
      index: "/app",
      apply: "/app/apply",
      scheduled: "/app/scheduled",
      submitted: "/app/submitted",
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
  urls.pages.app.scheduled,
  urls.pages.app.submitted,
];

export default urls;
