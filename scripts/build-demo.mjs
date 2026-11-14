import {execFileSync} from 'node:child_process';
import {mkdirSync,rmSync,copyFileSync,cpSync,writeFileSync,existsSync,readFileSync} from 'node:fs';
import assert from 'node:assert/strict';

// Deploy only the public demo and its sourced assets, never planning files or browser traces.
rmSync('dist',{recursive:true,force:true});
mkdirSync('dist/prototype',{recursive:true});
for(const name of ['index.html','style.css','commerce.css','storefront.css','app.mjs','state.mjs','chat.mjs','storage.mjs','analytics.mjs','chart.mjs','demo-history.mjs'])copyFileSync('prototype/'+name,'dist/prototype/'+name);
copyFileSync('thinh-an.svg','dist/thinh-an.svg');
cpSync('assets/reference','dist/assets/reference',{recursive:true,filter:source=>!source.endsWith('-sheet.jpg')});
copyFileSync('prototype/index.html','dist/index.html');
writeFileSync('dist/robots.txt','User-agent: *\nDisallow: /\n');
const source=readFileSync('prototype/app.mjs','utf8')+readFileSync('prototype/state.mjs','utf8');
for(const match of source.matchAll(/['"]([\w-]+\.(?:jpg|png|svg))['"]/g))assert(existsSync('dist/assets/reference/'+match[1]),'Missing asset '+match[1]);
assert(!existsSync('dist/.scratch'));
assert(!existsSync('dist/prototype/qa'));
console.log('Static demo built; referenced assets and deployment boundaries checked.');

execFileSync(process.execPath,['prototype/astryx/build.mjs'],{stdio:'inherit'});

// Ship one storefront; the retired designs remain only in source history.
assert(!existsSync('dist/compare'));
assert(!existsSync('dist/concept-2'));
assert(!readFileSync('dist/index.html','utf8').includes('design-switcher'));
