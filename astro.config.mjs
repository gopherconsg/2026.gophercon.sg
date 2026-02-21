import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import { ViteToml as toml } from "vite-plugin-toml";

export default defineConfig({
  site: "https://2026.gophercon.sg",
  integrations: [
    icon(),
    sitemap({
      filter: (page) => !page.includes("/404"),
    }),
  ],
  vite: {
    plugins: [tailwindcss(), toml()],
  },
});
