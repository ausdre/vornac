#!/usr/bin/env python3
"""
Local static preview of the Eleventy build.

Serves files from `dist/` with production-like extensionless URLs
(e.g. /de, /pentesting, /de/pentesting). For development you should
normally use `npm run dev`, which gives you hot reload — this script
is here for sanity-checking the built artifacts the way Vercel will
serve them, without spinning up Vercel.

Usage:
    npm run build && python3 serve_local.py
"""
from __future__ import annotations

import os
from http.server import HTTPServer, SimpleHTTPRequestHandler

ROOT = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(ROOT, "dist")


class VornacHandler(SimpleHTTPRequestHandler):
    def end_headers(self) -> None:  # noqa: N802
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_GET(self) -> None:  # noqa: N802
        raw = self.path
        parts_q = raw.split("?", 1)
        path_only = parts_q[0].split("#", 1)[0]
        query = ("?" + parts_q[1]) if len(parts_q) > 1 else ""

        # Map extensionless clean URLs to their .html files in dist/.
        new_path: str | None = None
        if path_only in ("", "/"):
            new_path = "/index.html"
        elif path_only.endswith("/"):
            candidate = os.path.join(DIST, path_only.strip("/"), "index.html")
            if os.path.isfile(candidate):
                new_path = path_only + "index.html"
        elif "." not in os.path.basename(path_only):
            candidate = os.path.join(DIST, path_only.lstrip("/") + ".html")
            if os.path.isfile(candidate):
                new_path = path_only + ".html"

        if new_path is not None:
            self.path = new_path + query

        return SimpleHTTPRequestHandler.do_GET(self)


def main() -> None:
    if not os.path.isdir(DIST):
        raise SystemExit(
            f"dist/ not found at {DIST}. Run `npm run build` first."
        )
    os.chdir(DIST)
    port = int(os.environ.get("PORT", "8080"))
    host = os.environ.get("HOST", "127.0.0.1")
    with HTTPServer((host, port), VornacHandler) as httpd:
        print(f"Serving {DIST}")
        print(f"  http://{host}:{port}/")
        print("  Clean URLs: /pentesting, /de, /de/pentesting, /de/industries-automotive, …")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
