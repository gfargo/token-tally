const fs = require("fs")
const path = require("path")
const prettier = require("prettier")

const siteUrl = process.env.SITE_URL || "https://tokentally.com"

const getCalculatorPages = () => {
  const calculatorsDir = path.join(process.cwd(), "app/calculators")
  return fs
    .readdirSync(calculatorsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => `/calculators/${dirent.name}`)
}
;(async () => {
  const prettierConfig = await prettier.resolveConfig("./.prettierrc")

  const calculatorPages = getCalculatorPages()

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${siteUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${siteUrl}/models</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
      ${calculatorPages
        .map(
          (page) => `
        <url>
          <loc>${siteUrl}${page}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
        </url>
      `,
        )
        .join("")}
    </urlset>
  `

  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: "html",
  })

  fs.writeFileSync("public/sitemap.xml", formatted)

  console.log("Sitemap generated!")
})()

