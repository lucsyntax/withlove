module.exports = {
  siteUrl: "https://with-lov.com",
  generateRobotsTxt: true,
  exclude: ["/server-sitemap-index.xml"],
  robotsTxtOptions: {
    additionalSitemaps: ["https://with-lov.com/server-sitemap-index.xml"],
  },
};
