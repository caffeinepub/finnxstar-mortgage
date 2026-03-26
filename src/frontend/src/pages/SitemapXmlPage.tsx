import { useEffect } from "react";
import { useGetAllPosts } from "../hooks/useQueries";

const BASE_URLS = [
  { loc: "https://finnxstar.com/", changefreq: "weekly", priority: "1.0" },
  { loc: "https://finnxstar.com/blog", changefreq: "daily", priority: "0.8" },
  {
    loc: "https://mortgage-broker-dubai-kqq.caffeine.xyz/",
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    loc: "https://mortgage-broker-dubai-kqq.caffeine.xyz/blog",
    changefreq: "daily",
    priority: "0.8",
  },
];

export default function SitemapXmlPage() {
  const { data: posts, isLoading } = useGetAllPosts();

  useEffect(() => {
    if (isLoading) return;

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const u of BASE_URLS) {
      xml += "  <url>\n";
      xml += `    <loc>${u.loc}</loc>\n`;
      xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
      xml += `    <priority>${u.priority}</priority>\n`;
      xml += "  </url>\n";
    }

    for (const post of posts ?? []) {
      const slug = (post as any).slug;
      if (!slug) continue;
      const urls = [
        `https://finnxstar.com/blog/${slug}`,
        `https://mortgage-broker-dubai-kqq.caffeine.xyz/blog/${slug}`,
      ];
      for (const loc of urls) {
        xml += "  <url>\n";
        xml += `    <loc>${loc}</loc>\n`;
        xml += "    <changefreq>weekly</changefreq>\n";
        xml += "    <priority>0.7</priority>\n";
        xml += "  </url>\n";
      }
    }

    xml += "</urlset>";

    document.open("application/xml");
    document.write(xml);
    document.close();
  }, [posts, isLoading]);

  return null;
}
