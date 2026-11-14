import test from 'node:test';
import assert from 'node:assert/strict';
import {createStore,products,available,placeOrder} from './state.mjs';
import {addDemoHistory} from './demo-history.mjs';
import {salesSummary,periodRange,orderDay} from './analytics.mjs';
import {decodeDemo} from './storage.mjs';
const now=new Date('2026-11-14T05:30:00Z');
test('30-day history has consistent totals, dates, states and repeat customers',()=>{
 const s=createStore();const count=addDemoHistory(s,now);assert(count>100);const sample=s.orders.filter(o=>o.demoSample);
 assert.equal(new Set(sample.map(orderDay)).size,30);assert.equal(new Set(s.orders.map(o=>o.id)).size,s.orders.length);
 assert.deepEqual(new Set(sample.map(o=>o.status)),new Set(['pending','confirmed','shipping','delivered','cancelled']));
 assert(sample.every(o=>new Date(o.createdAt)<=now&&o.subtotal===o.lines.reduce((n,l)=>n+l.qty*l.price,0)&&o.total===o.subtotal+o.shipping));
 assert(sample.filter(o=>o.method==='cod'&&['pending','confirmed','shipping'].includes(o.status)).every(o=>o.payment==='pending'));
 assert(products.every(p=>available(s,p.id)>=0));
 const range=periodRange('30','2026-11-14'),d=salesSummary(s.orders,range.from,range.to);assert(d.series.every(b=>b.value>0));assert(d.customers<d.orders.length);assert.equal(d.ranking.length,7);
 const roundtrip=decodeDemo(JSON.stringify({version:1,state:s})).state;assert.equal(addDemoHistory(roundtrip,new Date('2026-11-15T05:30:00Z')),0);assert.equal(roundtrip.orders.length,s.orders.length);
});
test('migration preserves existing orders, stock, cart, notes, sequence and avoids reserved-stock conflicts',()=>{
 const s=createStore(false);s.cart={'tom-non':1};const existing=placeOrder(s,{name:'Khách đã có',phone:'0900000088',address:'Địa chỉ thử Hà Nội',method:'cod'});s.cart={'matcha':2};s.customerNotes={example:[{text:'Giữ nguyên',at:now.toISOString()}]};
 for(const p of products)s.stock[p.id]=p.id==='tom-non'?1:p.id==='matcha'?2:0;
 const before=structuredClone({existing,stock:s.stock,cart:s.cart,notes:s.customerNotes,sequence:s.sequence});
 addDemoHistory(s,now);assert.deepEqual(s.orders.find(o=>o.id===existing.id),before.existing);assert.deepEqual(s.stock,before.stock);assert.deepEqual(s.cart,before.cart);assert.deepEqual(s.customerNotes,before.notes);assert.equal(s.sequence,before.sequence);
 assert(products.every(p=>available(s,p.id)>=(s.cart[p.id]||0)));const size=s.orders.length;assert.equal(addDemoHistory(s,now),0);assert.equal(s.orders.length,size);
});

test('affiliate samples preserve attribution and edits, cover lifecycle and survive reload',async()=>{
 const {addAffiliateDemo}=await import('./demo-history.mjs');const {affiliateSummary}=await import('./analytics.mjs');const {commissionStatus,payCommission}=await import('./state.mjs');
 const s=createStore();addDemoHistory(s,now);const attributed=structuredClone(s.orders.filter(o=>o.affiliate));const originalTotals=s.orders.reduce((n,o)=>n+o.total,0);
 assert(addAffiliateDemo(s,now)>0);assert.equal(s.affiliates.length,6);assert(s.affiliates.some(a=>a.status==='pending'));
 for(const o of attributed)assert.deepEqual(s.orders.find(x=>x.id===o.id),o);
 assert.equal(s.orders.reduce((n,o)=>n+o.total,0),originalTotals);
 assert.deepEqual(new Set(s.orders.filter(o=>o.affiliate).map(commissionStatus)),new Set(['pending','eligible','paid','void','recovery']));
 const d=affiliateSummary(s.orders,'2026-10-16','2026-11-14');assert.equal(d.ranking.length,5);
 assert.equal(d.series.reduce((n,b)=>n+b.value,0),d.sums.pending+d.sums.eligible+d.sums.paid);
 assert.equal(d.ranking.reduce((n,r)=>n+r.commission,0),d.series.reduce((n,b)=>n+b.value,0));
 const eligible=s.orders.find(o=>commissionStatus(o)==='eligible');payCommission(s,eligible.id);assert.throws(()=>payCommission(s,eligible.id));
 const saved=decodeDemo(JSON.stringify({version:1,state:s})).state;const before=structuredClone(saved);assert.equal(addAffiliateDemo(saved,now),0);assert.deepEqual(saved,before);
 assert.equal(affiliateSummary(s.orders,'2020-01-01','2020-01-07').orders.length,0);
});
