import {execFileSync} from 'node:child_process';
import {mkdirSync,rmSync,copyFileSync,cpSync,writeFileSync,existsSync,readFileSync,readdirSync} from 'node:fs';
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

// Keep the alternate design and its browser data separate from the existing app.
cpSync('concept-2','dist/concept-2',{recursive:true,filter:path=>!path.endsWith('.md')});
cpSync('comparison','dist/compare',{recursive:true});
function addDesignSwitcher(file,variant){
 const nav=`<nav class="design-switcher" aria-label="Chọn hướng thiết kế"><a href="/" ${variant===1?'aria-current="page"':''}>01 · Miền trà</a><a href="/concept-2/" ${variant===2?'aria-current="page"':''}>02 · Huyền Trà Xưa</a><a class="design-all" href="/compare/">So sánh</a></nav>`;
 const html=readFileSync(file,'utf8').replace('</head>','<link rel="stylesheet" href="/compare/switcher.css"></head>').replace(/<body([^>]*)>/,`<body$1>${nav}`);
 writeFileSync(file,html);
 assert(html.includes('aria-label="Chọn hướng thiết kế"'));
}
for(const file of ['dist/index.html','dist/prototype/index.html','dist/astryx/index.html'])addDesignSwitcher(file,1);
for(const file of readdirSync('dist/concept-2').filter(file=>file.endsWith('.html')))addDesignSwitcher('dist/concept-2/'+file,2);
assert(existsSync('dist/concept-2/assets/images/hero-thu-hai.jpg'));
assert(existsSync('dist/compare/index.html'));
