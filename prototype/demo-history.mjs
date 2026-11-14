import {products,shippingFee,available} from './state.mjs';
import {vietnamDay,orderDay} from './analytics.mjs';

// Historical orders are snapshots against the current closing stock, not new fulfilment events.
export function addDemoHistory(state,now=new Date()){
 if(state.demoHistory30?.version===1)return 0;
 const today=vietnamDay(now),midnight=Date.parse(today+'T00:00:00+07:00');
 const names=['An Nhiên','Minh Châu','Thanh Hà','Quang Minh','Thu Hương','Hoài An','Ngọc Lan','Đức Anh','Mai Phương','Gia Hân','Tuấn Anh','Khánh Linh','Bảo Ngọc','Thanh Tâm','Hải Yến','Hữu Phúc','Trà My','Minh Khang','Phương Thảo','Hồng Nhung','Quốc Bảo','Diệu Linh','Anh Thư','Việt Hoàng'];
 const places=['Hà Nội','Thái Nguyên','Hải Phòng','Đà Nẵng','TP. Hồ Chí Minh','Bắc Ninh'];
 const known=new Set(state.orders.map(o=>o.id)),partner=state.affiliates.find(a=>a.code==='ANNHIEN'&&a.status==='approved');
 let added=0,index=0;
 for(let age=29;age>=0;age--){
  const count=2+(age*7+3)%5+(age<7?1:0);
  for(let j=0;j<count;j++){
   const id='TA'+(900001+index++);if(known.has(id))continue;
   const customer=(age*3+j*7)%names.length;
   const first=products[(age+j*2)%products.length];
   const lines=[{id:first.id,qty:1+(age+j)%3,price:first.price}];
   if((age+j)%4===0){const second=products[(age+j*2+1)%products.length];lines.push({id:second.id,qty:1,price:second.price});}
   const subtotal=lines.reduce((n,l)=>n+l.price*l.qty,0),method=['cod','qr','bank'][(age+j)%3];
   let status=age===0?(j%2===0?'pending':'confirmed'):age<=2?'shipping':(age+j)%13===0?'cancelled':'delivered';
   // Preserve the user's cart and low-stock adjustments when adding open sample orders.
   if(['pending','confirmed'].includes(status)&&lines.some(l=>available(state,l.id)-(state.cart[l.id]||0)<l.qty))status='cancelled';
   const payment=status==='cancelled'?'pending':method==='cod'?(status==='delivered'?(age<=5?'collected':'remitted'):'pending'):status==='pending'?'pending':'paid';
   const createdAt=new Date(Math.min(+now,midnight-age*86400000+(8+j*2)*3600000)).toISOString();
   const order={id,name:'Khách mẫu · '+names[customer],phone:'090001'+String(customer+1).padStart(4,'0'),address:'Địa chỉ mẫu, '+places[customer%places.length],lines,subtotal,shipping:shippingFee,total:subtotal+shippingFee,method,status,payment,createdAt,date:new Date(createdAt).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'}),demoSample:true};
   if(partner&&(age+j)%4===0){order.affiliate={code:partner.code,rate:10,amount:Math.round(subtotal*.1)};if(status==='delivered'&&['paid','remitted'].includes(payment)&&age>12)order.affiliate.paidAt=new Date(Date.parse(createdAt)+3*86400000).toISOString();}
   state.orders.push(order);known.add(id);added++;
  }
 }
 state.orders.sort((a,b)=>(orderDay(b)||'').localeCompare(orderDay(a)||'')||String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
 state.demoHistory30={version:1,through:today};return added;
}

export function addAffiliateDemo(state,now=new Date()){
 if(state.affiliateDemo30?.version===1)return 0;
 const samples=[['TRAMY','Trà My','Facebook · Góc trà mỗi ngày',286],['MINHCHAU','Minh Châu','TikTok · Chuyện trà',412],['QUANGMINH','Quang Minh','Zalo · Bạn trà Thái Nguyên',193],['THUHUONG','Thu Hương','Instagram · Trà và quà',245],['BAOAN','Bảo An','Facebook · Quà Việt',0]];
 for(const [i,[code,name,channel,visits]] of samples.entries())if(!state.affiliates.some(a=>a.code===code))state.affiliates.push({code,name,channel,visits,phone:'090002000'+i,status:code==='BAOAN'?'pending':'approved',demoSample:true});
 const partners=samples.slice(0,4).map(([code])=>state.affiliates.find(a=>a.code===code)).filter(a=>a.status==='approved');
 let added=0;
 for(const o of state.orders.filter(o=>o.demoSample&&!o.affiliate)){
  if(!partners.length)break;
  const i=added++,partner=partners[i%partners.length],rate=[8,10,12,10][i%4];
  o.affiliate={code:partner.code,rate,amount:Math.round(o.subtotal*rate/100)};
  const settled=o.status==='delivered'&&['paid','remitted'].includes(o.payment),old=+now-Date.parse(o.createdAt)>7*86400000;
  if(settled&&old&&i%3!==0){o.affiliate.paidAt=new Date(Date.parse(o.createdAt)+5*86400000).toISOString();state.activity.push({id:partner.code,type:'affiliate',label:'Ghi nhận chi hoa hồng mẫu '+o.id,note:'Kỳ đối soát minh họa',at:o.affiliate.paidAt});}
  if(settled&&old&&i%11===0){o.affiliate.paidAt=new Date(Date.parse(o.createdAt)+5*86400000).toISOString();o.affiliate.voidReason='Mẫu: phát hiện giới thiệu không hợp lệ sau khi chi';state.activity.push({id:partner.code,type:'affiliate',label:'Điều chỉnh hoa hồng mẫu '+o.id,note:o.affiliate.voidReason,at:new Date(Math.min(+now,Date.parse(o.createdAt)+6*86400000)).toISOString()});}
  else if(settled&&i%9===0&&!o.affiliate.paidAt)o.affiliate.voidReason='Mẫu: đơn giới thiệu không hợp lệ';
 }
 state.activity.sort((a,b)=>b.at.localeCompare(a.at));state.affiliateDemo30={version:1,through:vietnamDay(now)};return added;
}
