import errno
import os
import sys

DEFAULT_PORT = int(os.environ.get("PORT", "8000"))

if sys.version_info < (3, 0):
    import SimpleHTTPServer
    import SocketServer

    class Handler(SimpleHTTPServer.SimpleHTTPRequestHandler):
        pass

    Handler.extensions_map = {
        '.manifest': 'text/cache-manifest',
        '.html': 'text/html',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.svg': 'image/svg+xml',
        '.css': 'text/css',
        '.js':  'application/x-javascript',
        '.mp3': 'audio/mpeg',
        '': 'application/octet-stream', # Default
    }
    
    httpd = SocketServer.TCPServer(("", DEFAULT_PORT), Handler)

    print("serving at port", DEFAULT_PORT)
    httpd.serve_forever()


else:
    import http.server
    import socketserver

    class GameEmbedHeadersHandler(http.server.SimpleHTTPRequestHandler):
        """Match Vercel headers for game.html so iframe / portfolio embed behaves the same locally."""

        def end_headers(self):
            path = self.path.split("?", 1)[0].rstrip("/") or "/"
            base = path.split("/")[-1]
            if base == "game.html":
                self.send_header(
                    "Content-Security-Policy",
                    "frame-ancestors *",
                )
                self.send_header(
                    "Permissions-Policy",
                    "accelerometer=*, gyroscope=*, encrypted-media=*, fullscreen=(self)",
                )
            super().end_headers()

    Handler = GameEmbedHeadersHandler

    Handler.extensions_map={
        '.manifest': 'text/cache-manifest',
        '.html': 'text/html',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.svg': 'image/svg+xml',
        '.css': 'text/css',
        '.js':  'application/x-javascript',
        '.mp3': 'audio/mpeg',
        '': 'application/octet-stream', # Default
    }

    class ReusableTCPServer(socketserver.TCPServer):
        allow_reuse_address = True

    port = DEFAULT_PORT
    httpd = None
    for _ in range(32):
        try:
            httpd = ReusableTCPServer(("", port), Handler)
            break
        except OSError as e:
            if e.errno != errno.EADDRINUSE:
                raise
            port += 1
    if httpd is None:
        raise RuntimeError("no free TCP port in range %s–%s" % (DEFAULT_PORT, port - 1))

    print("serving at port", port)
    httpd.serve_forever()