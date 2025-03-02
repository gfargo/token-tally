module.exports = {
  siteUrl: process.env.SITE_URL || "https://tokentally.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
  exclude: ["/api/*"],
  generateIndexSitemap: false,
  changefreq: "weekly",
  priority: 0.7,
  transform: async (config, path) => {
    // Custom transformation for dynamic routes
    if (path.includes("/calculators/")) {
      return {
        loc: path,
        changefreq: "daily",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }
    }
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
}

