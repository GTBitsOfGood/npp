const urls = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  pages: {
    index: "/",
    ssr: "/ssr",
    login: "/login",
    app: {
      index: "/app",
      project: "/app/project",
      apply: "/app/apply",
      scheduled: "/app/scheduled",
    },
  },
  api: {
    example: "/api/example",
    availability: "/api/availability",
    meeting: "/api/meeting",
    user: "/api/user",
  },
};

export default urls;
