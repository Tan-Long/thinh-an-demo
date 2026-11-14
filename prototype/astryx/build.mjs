import {build} from 'esbuild';
import {mkdirSync,writeFileSync} from 'node:fs';
const root=new URL('../../dist/astryx/',import.meta.url);
mkdirSync(root,{recursive:true});
await build({absWorkingDir:new URL('.',import.meta.url).pathname,entryPoints:['main.jsx'],bundle:true,minify:true,jsx:'automatic',outfile:new URL('app.js',root).pathname,define:{'process.env.NODE_ENV':'"production"'},legalComments:'linked'});
writeFileSync(new URL('index.html',root),'<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Góc cộng tác viên — Thịnh An</title><link rel="icon" href="/thinh-an.svg"><link rel="stylesheet" href="/astryx/app.css"></head><body><div id="root"></div><script type="module" src="/astryx/app.js"></script></body></html>');

await build({absWorkingDir:new URL('.',import.meta.url).pathname,entryPoints:['site.css'],bundle:true,minify:true,outfile:new URL('site.css',root).pathname});
