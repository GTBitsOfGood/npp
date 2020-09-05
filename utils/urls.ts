const urls = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  pages: {
    index: "/",
    ssr: "/ssr",
    login: "/login",
    app: {
      index: "/app",
    },
  },
  api: {
    example: "/api/example",
  },
};

export default urls;
