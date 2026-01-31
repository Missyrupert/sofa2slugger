#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys
from http import HTTPStatus

class RangeHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        ctype = self.guess_type(path)
        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(HTTPStatus.NOT_FOUND, "File not found")
            return None
        fs = os.fstat(f.fileno())
        size = fs.st_size
        range_header = self.headers.get('Range')
        if range_header:
            start, end = 0, size - 1
            import re
            m = re.match(r'bytes=(\d+)-(\d*)', range_header)
            if m:
                start = int(m.group(1))
                if m.group(2):
                    end = int(m.group(2))
            if start >= size:
                self.send_error(HTTPStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
                return None
            if end >= size:
                end = size - 1
            self.send_response(HTTPStatus.PARTIAL_CONTENT)
            self.send_header('Content-type', ctype)
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
            self.send_header('Content-Length', str(end - start + 1))
            self.send_header('Last-Modified', self.date_time_string(fs.st_mtime))
            self.end_headers()
            f.seek(start)
            self.copy_chunk(f, end - start + 1)
            f.close()
            return None
        else:
            self.send_response(HTTPStatus.OK)
            self.send_header('Content-type', ctype)
            self.send_header('Content-Length', str(size))
            self.send_header('Last-Modified', self.date_time_string(fs.st_mtime))
            self.send_header('Accept-Ranges', 'bytes')
            self.end_headers()
            return f

    def copy_chunk(self, fileobj, length, chunk_size=64*1024):
        while length > 0:
            toread = min(chunk_size, length)
            data = fileobj.read(toread)
            if not data:
                break
            self.wfile.write(data)
            length -= len(data)

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    webdir = sys.argv[2] if len(sys.argv) > 2 else 'public'
    os.chdir(webdir)
    with socketserver.ThreadingTCPServer(('', port), RangeHTTPRequestHandler) as httpd:
        print(f"Serving {os.getcwd()} on port {port}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('Server stopped')
