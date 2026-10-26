"""Local-only HTTP interface; no uploaded plaintext or password is saved."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse, unquote
import io, json, os, re, zipfile
from storage import encrypt, LIMIT

ROOT = Path(__file__).resolve().parent
STORE = Path(os.environ.get('CLOUDBLOCK_DATA', ROOT/'data'))
STORE.mkdir(exist_ok=True)

class Handler(BaseHTTPRequestHandler):
    def send(self, code, data, kind='application/json', disposition=None):
        self.send_response(code)
        self.send_header('Content-Type', kind)
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; frame-ancestors 'none'")
        if disposition: self.send_header('Content-Disposition', disposition)
        self.end_headers(); self.wfile.write(data)

    def do_GET(self):
        p = urlparse(self.path).path
        if p == '/api/files':
            rows=[]
            for f in sorted(STORE.glob('*.cblock'), key=lambda x:x.stat().st_mtime, reverse=True):
                with zipfile.ZipFile(f) as z: m=json.loads(z.read('manifest.json'))
                rows.append(dict(id=f.stem, name=m['name'], size=m['size'], count=m['count'], sha256=m['sha256']))
            return self.send(200,json.dumps(rows).encode())
        if re.fullmatch(r'/api/download/[a-f0-9]{32}',p):
            f=STORE/(p.rsplit('/',1)[1]+'.cblock')
            if f.exists(): return self.send(200,f.read_bytes(),'application/zip',f'attachment; filename="{f.name}"')
        files={'/':'static/index.html','/style.css':'static/style.css','/app.js':'static/app.js','/portfolio/':'portfolio/index.html'}
        if p in files:
            f=ROOT/files[p]
            kind={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript'}[f.suffix]
            return self.send(200,f.read_bytes(),kind)
        self.send(404,b'{"error":"Not found"}')

    def do_POST(self):
        if self.path != '/api/upload': return self.send(404,b'{}')
        # Reject cross-origin form requests and DNS rebinding to this local service.
        host=self.headers.get('Host','')
        origin=self.headers.get('Origin')
        if host not in ('127.0.0.1:8765','localhost:8765') or (origin and origin not in ('http://127.0.0.1:8765','http://localhost:8765')):
            return self.send(403,b'{"error":"Origin rejected"}')
        try:
            n=int(self.headers.get('Content-Length','0'))
            if not 0 <= n <= LIMIT: raise ValueError('File exceeds the 10 MiB limit.')
            name=unquote(self.headers.get('X-Filename','file.bin')).replace('\\','/').rsplit('/',1)[-1][:150]
            password=unquote(self.headers.get('X-Password',''))
            archive,m=encrypt(self.rfile.read(n),name,password)
            ident=os.urandom(16).hex()
            (STORE/(ident+'.cblock')).write_bytes(archive)
            self.send(201,json.dumps(dict(id=ident,**m)).encode())
        except (ValueError, UnicodeError) as e:
            self.send(400,json.dumps({'error':str(e)}).encode())

if __name__ == '__main__':
    print('CloudBlock running at http://127.0.0.1:8765',flush=True)
    ThreadingHTTPServer(('127.0.0.1',8765), Handler).serve_forever()
