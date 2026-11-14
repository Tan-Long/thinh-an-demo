from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit
ROOT=Path(__file__).resolve().parents[1] / 'dist'
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):
  super().__init__(*args,directory=str(ROOT),**kwargs)
 def do_GET(self):
  path=urlsplit(self.path).path
  if path=='/affiliate/dashboard' and 'variant=astryx' in self.path:
   self.path='/astryx/index.html'
  elif path.split('/')[1] in ['home','catalog','product','story','journal','gifts','checkout','order','tracking','affiliate','admin']:
   self.path='/index.html'
  super().do_GET()
ThreadingHTTPServer(('127.0.0.1',4186),Handler).serve_forever()
