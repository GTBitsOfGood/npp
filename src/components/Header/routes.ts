import urls from "&utils/urls";

export const homeRoutes = [
  {
    name: "Home",
    link: urls.pages.index,
  },
  {
    name: "SSR",
    link: urls.pages.ssr,
  },
];

export const authRoutes = [
  {
    name: "App",
    link: urls.pages.app.index,
  },
  {
    name: "Apply",
    link: urls.pages.app.apply,
  },
];
