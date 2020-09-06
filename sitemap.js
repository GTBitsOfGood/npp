const fs = require("fs");
const globby = require("globby");

if (process.env.NODE_ENV || "development" === "development") {
  require("dotenv").config({ path: ".env.local" });
}

void (async () => {
  // Ignore Next.js specific files (e.g., _app.js) and API routes.
  const pages = await globby([
    "src/pages/**/*{.js,.jsx,.ts,.tsx,.mdx}",
    "!src/pages/_*{.js,.jsx,.ts,.tsx}",
    "!src/pages/api",
  ]);

  const formattedPages = pages
    .map((page) => {
      const path = page
        .replace("src/pages", "")
        .replace(".jsx", "")
        .replace(".tsx", "")
        .replace(".mdx", "")
        .replace(".js", "")
        .replace(".ts", "");

      const route = path === "/index" ? "" : path;

      return (
        "  <url>\n" +
        `    <loc>${`${process.env.NEXT_PUBLIC_BASE_URL}${route}`}</loc>\n` +
        "  </url>\n"
      );
    })
    .join("");

  const sitemap =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    formattedPages +
    "</urlset>";

  fs.writeFileSync("public/sitemap.xml", sitemap);
})();
