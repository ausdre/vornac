#!/usr/bin/env python3
"""
Local static preview with production-like paths (/de, /pentesting, …).
Plain `python -m http.server` cannot serve extensionless URLs.
"""
from __future__ import annotations

import os
from http.server import HTTPServer, SimpleHTTPRequestHandler

ROOT = os.path.dirname(os.path.abspath(__file__))


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

        new_path: str | None = None
        if path_only in ("/de", "/de/"):
            new_path = "/index_de.html"
        elif path_only.startswith("/") and path_only not in ("/", ""):
            seg = path_only.strip("/")
            if seg and "/" not in seg and "." not in seg:
                candidate = os.path.join(ROOT, seg + ".html")
                if os.path.isfile(candidate):
                    new_path = "/" + seg + ".html"

        if new_path is not None:
            self.path = new_path + query

        return SimpleHTTPRequestHandler.do_GET(self)


def main() -> None:
    os.chdir(ROOT)
    port = int(os.environ.get("PORT", "8080"))
    host = os.environ.get("HOST", "127.0.0.1")
    with HTTPServer((host, port), VornacHandler) as httpd:
        print(f"Serving {ROOT}")
        print(f"  http://{host}:{port}/")
        print("  /de → index_de.html; /pentesting_de → pentesting_de.html; /industries_de → industries_de.html")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
