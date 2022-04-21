import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function disableHistoryFallback() {
  const path = require("path");
  const fs = require("fs");

  const ALLOWLIST = [
    // internal requests
    /^\/__vite_ping/,
    /^\/@vite\/client/,
    /^\/@id/,
    /^\/__open-in-editor/,

    // no check needed
    /^\/$/,
    /^\/index.html/,
  ];
  return {
    name: "disable-history-fallback",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // remove query params from url (e.g., cache busts)
        const url = req.url.split("?")[0];

        if (ALLOWLIST.some((pattern) => pattern.test(url))) {
          return next();
        }

        if (!fs.existsSync(path.join(__dirname, url))) {
          console.warn("URL not found:", url);
          res.statusCode = 404;
          res.end();
        } else {
          next();
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), disableHistoryFallback()],
});
