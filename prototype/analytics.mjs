import {customerKey,commissionStatus} from './state.mjs';
const DAY=86400000;
export function vietnamDay(date=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);}
function epoch(day){const n=Date.parse(day+'T00:00:00Z');if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!Number.isFinite(n)||new Date(n).toISOString().slice(0,10)!==day)throw Error('Ngày không hợp lệ.');return n;}
export function periodRange(period,today=vietnamDay()) {const end=epoch(today);return {from:period==='month'?today.slice(0,8)+'01':new Date(end-(period==='today'?0:period==='7'?6:29)*DAY).toISOString().slice(0,10),to:today};}
export function orderDay(order){if(order.createdAt){const d=new Date(order.createdAt);return Number.isFinite(+d)?vietnamDay(d):null;}const m=String(order.date).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);if(!m)return null;const day=`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;try{epoch(day);return day;}catch{return null;}}
export function salesSummary(orders,from,to){
 const start=epoch(from),end=epoch(to),days=(end-start)/DAY+1;
 if(days<1||days>366)throw Error('Chọn khoảng từ 1 đến 366 ngày, ngày bắt đầu không sau ngày kết thúc.');
 const series=Array.from({length:days},(_,i)=>({day:new Date(start+i*DAY).toISOString().slice(0,10),value:0,count:0}));
 const selected=orders.filter(o=>{const d=orderDay(o);return d&&d>=from&&d<=to;});
 const active=selected.filter(o=>o.status!=='cancelled');const ranking=new Map();
 for(const o of selected){const bucket=series[(epoch(orderDay(o))-start)/DAY];bucket.count++;if(o.status==='cancelled')continue;bucket.value+=o.subtotal;for(const l of o.lines){const p=ranking.get(l.id)||{id:l.id,qty:0,value:0};p.qty+=l.qty;p.value+=l.qty*l.price;ranking.set(l.id,p);}}
 return {orders:selected,series,value:active.reduce((n,o)=>n+o.subtotal,0),received:active.filter(o=>['paid','remitted'].includes(o.payment)).reduce((n,o)=>n+o.total,0),customers:new Set(active.map(o=>customerKey(o.phone))).size,ranking:[...ranking.values()].sort((a,b)=>b.value-a.value)};
}

export function affiliateSummary(orders,from,to){
 const d=salesSummary(orders.filter(o=>o.affiliate),from,to),rank=new Map();
 const sums={pending:0,eligible:0,paid:0,void:0,recovery:0};
 const series=d.series.map(b=>({day:b.day,value:0,count:0})),buckets=new Map(series.map(b=>[b.day,b]));
 for(const o of d.orders){const status=commissionStatus(o),amount=o.affiliate.amount;sums[status]+=amount;
  const r=rank.get(o.affiliate.code)||{code:o.affiliate.code,orders:0,sales:0,commission:0,eligible:0};r.orders++;
  if(o.status!=='cancelled')r.sales+=o.subtotal;
  if(['pending','eligible','paid'].includes(status)){r.commission+=amount;buckets.get(orderDay(o)).value+=amount;}
  if(status==='eligible')r.eligible+=amount;buckets.get(orderDay(o)).count++;rank.set(r.code,r);
 }
 return {orders:d.orders,series,sums,ranking:[...rank.values()].sort((a,b)=>b.commission-a.commission)};
}

export function previousRange(from,to){
 const start=epoch(from),days=(epoch(to)-start)/DAY+1;
 if(days<1||days>366)throw Error('Khoảng ngày không hợp lệ.');
 return {from:new Date(start-days*DAY).toISOString().slice(0,10),to:new Date(start-DAY).toISOString().slice(0,10)};
}
export function dailyStats(series){
 if(!series.length)return {mean:0,min:null,max:null};
 return {mean:series.reduce((sum,b)=>sum+b.value,0)/series.length,min:series.reduce((a,b)=>b.value<a.value?b:a),max:series.reduce((a,b)=>b.value>a.value?b:a)};
}
export function percentChange(current,previous){return previous===0?null:(current-previous)/previous*100;}
