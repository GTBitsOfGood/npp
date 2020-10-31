const urls = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  pages: {
    index: "/",
    ssr: "/ssr",
    login: "/login",
    app: {
      index: "/app",
      apply: "/app/apply",
    },
  },
  api: {
    example: "/api/example",
    availability: "/api/availability",
    application: "/api/application",
    meeting: "/api/meeting",
    user: "/api/user",
  },
};

export default urls;
