import test from 'node:test';
import assert from 'node:assert/strict';
import {periodRange,salesSummary,orderDay} from './analytics.mjs';
const order=(patch={})=>({date:'13/11/2026',phone:'0900000001',subtotal:100,total:130,status:'pending',payment:'pending',lines:[{id:'tea',qty:1,price:100}],...patch});
test('period boundaries, leap dates and Vietnamese timezone',()=>{
 assert.deepEqual(periodRange('7','2026-01-03'),{from:'2025-12-28',to:'2026-01-03'});
 assert.equal(periodRange('month','2024-02-29').from,'2024-02-01');
 assert.equal(orderDay(order({createdAt:'2026-11-13T18:00:00Z'})),'2026-11-14');
 assert.equal(orderDay(order({date:'31/02/2026'})),null);
 assert.throws(()=>salesSummary([],'2026-02-30','2026-03-01'));
 assert.throws(()=>salesSummary([],'2026-11-14','2026-11-13'));
 assert.throws(()=>salesSummary([],'2020-01-01','2026-01-01'));
});
test('excludes cancellations, unremitted COD and out-of-range orders; normalizes customers',()=>{
 const result=salesSummary([order(),order({payment:'collected',phone:'+84900000001'}),order({payment:'paid'}),order({payment:'remitted'}),order({status:'cancelled',payment:'paid'}),order({date:'12/11/2026',payment:'paid'})],'2026-11-13','2026-11-14');
 assert.equal(result.orders.length,5);assert.equal(result.value,400);assert.equal(result.received,260);assert.equal(result.customers,1);assert.equal(result.ranking[0].qty,4);assert.deepEqual(result.series.map(b=>b.value),[400,0]);
 const empty=salesSummary([],'2026-11-13','2026-11-14');assert.equal(empty.value,0);assert.equal(empty.customers,0);assert.equal(empty.ranking.length,0);
});

test('daily mean includes zero days; extrema choose first tie; previous period has equal days',async()=>{
 const {dailyStats,previousRange,percentChange}=await import('./analytics.mjs');
 const series=[{day:'2024-02-28',value:0},{day:'2024-02-29',value:120},{day:'2024-03-01',value:120}];
 assert.deepEqual(dailyStats(series),{mean:80,min:series[0],max:series[1]});
 assert.deepEqual(previousRange('2024-03-01','2024-03-03'),{from:'2024-02-27',to:'2024-02-29'});
 assert.deepEqual(previousRange('2026-01-01','2026-01-01'),{from:'2025-12-31',to:'2025-12-31'});
 assert.equal(percentChange(150,100),50);assert.equal(percentChange(0,100),-100);assert.equal(percentChange(100,0),null);
 assert.deepEqual(dailyStats([]),{mean:0,min:null,max:null});assert.throws(()=>previousRange('2026-11-14','2026-11-13'));
});
