import {build} from 'esbuild';
import {mkdirSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=new URL('../../dist/astryx/',import.meta.url);
mkdirSync(root,{recursive:true});
await build({absWorkingDir:fileURLToPath(new URL('.',import.meta.url)),entryPoints:['main.jsx'],bundle:true,minify:true,jsx:'automatic',outfile:fileURLToPath(new URL('app.js',root)),define:{'process.env.NODE_ENV':'"production"'},legalComments:'linked'});
writeFileSync(new URL('index.html',root),'<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Góc cộng tác viên — Thịnh An</title><link rel="icon" href="/thinh-an.svg"><link rel="stylesheet" href="/astryx/app.css"></head><body><div id="root"></div><script type="module" src="/astryx/app.js"></script></body></html>');

await build({absWorkingDir:fileURLToPath(new URL('.',import.meta.url)),entryPoints:['site.css'],bundle:true,minify:true,outfile:fileURLToPath(new URL('site.css',root))});
