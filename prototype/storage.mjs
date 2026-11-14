import {createStore,products} from './state.mjs';
export const demoKey='thinh-an.demo.v1';
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const str=x=>typeof x==='string';
const num=x=>Number.isFinite(x)&&x>=0;
const id=x=>products.some(p=>p.id===x);
export function decodeDemo(raw){
 const d=JSON.parse(raw,(k,v)=>{if(['__proto__','prototype','constructor'].includes(k))throw Error('Invalid key');return v;});
 const s=d?.state;
 if(d?.version!==1||!obj(s)||!obj(s.stock)||!products.every(p=>Number.isSafeInteger(s.stock[p.id])&&s.stock[p.id]>=0)||!obj(s.cart)||!Object.entries(s.cart).every(([k,v])=>id(k)&&Number.isSafeInteger(v)&&v>=0)||!Array.isArray(s.orders)||!s.orders.every(o=>obj(o)&&str(o.id)&&str(o.name)&&str(o.phone)&&str(o.address)&&str(o.date)&&['cod','qr','bank'].includes(o.method)&&['pending','confirmed','shipping','delivered','cancelled'].includes(o.status)&&['pending','paid','collected','remitted'].includes(o.payment)&&['total','subtotal','shipping'].every(k=>num(o[k]))&&Array.isArray(o.lines)&&o.lines.every(l=>id(l.id)&&Number.isSafeInteger(l.qty)&&l.qty>0&&num(l.price))&&(!o.affiliate||str(o.affiliate.code)&&num(o.affiliate.amount)&&num(o.affiliate.rate)))||!Array.isArray(s.quotes)||!s.quotes.every(q=>['id','name','phone','note','createdAt'].every(k=>str(q[k])))||!Array.isArray(s.affiliates)||!s.affiliates.every(a=>['code','name','phone','channel'].every(k=>str(a[k]))&&['pending','approved'].includes(a.status)&&num(a.visits))||!Array.isArray(s.activity)||!s.activity.every(a=>['id','type','label','note','at'].every(k=>str(a[k])))||!obj(s.care)||!Object.values(s.care).every(obj)||!Number.isSafeInteger(s.sequence)||s.sequence<1025||!num(s.affRate)||s.affRate>100)throw Error('Invalid saved demo');
 const chat=d.chat||{};
 if(!obj(chat)||chat.messages&&(!Array.isArray(chat.messages)||!chat.messages.every(m=>['user','bot'].includes(m.role)&&str(m.text)&&(!m.ids||Array.isArray(m.ids)&&m.ids.every(id))&&(!m.link||['/catalog','/gifts','/tracking'].includes(m.link)))))throw Error('Invalid saved chat');
 if(s.customerNotes&&(!obj(s.customerNotes)||!Object.values(s.customerNotes).every(a=>Array.isArray(a)&&a.every(n=>str(n.text)&&str(n.at)))))throw Error('Invalid notes');
 s.customerNotes??={};
 return {...d,chat:{messages:chat.messages||[],context:obj(chat.context)?chat.context:{},draft:str(chat.draft)?chat.draft:''},checkout:obj(d.checkout)?Object.fromEntries(Object.entries(d.checkout).filter(([k,v])=>['name','phone','address','method'].includes(k)&&str(v))):{}};
}
export function createDemoStorage(storage){
 let previous=null,blocked=false;
 return {
 load(){try{previous=storage.getItem(demoKey);return previous?decodeDemo(previous):{state:createStore(),chat:{},checkout:{}};}catch{blocked=true;return {state:createStore(),chat:{},checkout:{},error:'Không đọc được dữ liệu đã lưu. Bạn có thể đặt lại dữ liệu trong quản trị.'};}},
 save(data){if(blocked)return false;try{if(storage.getItem(demoKey)!==previous){blocked=true;throw Error('Dữ liệu đã thay đổi ở tab khác. Tải lại trang trước khi tiếp tục.');}const raw=JSON.stringify({version:1,...data});if(raw===previous)return true;storage.setItem(demoKey,raw);previous=raw;return true;}catch(e){blocked=true;throw Error(e.message?.includes('tab khác')?e.message:'Trình duyệt chưa lưu được thay đổi. Giữ trang này mở và kiểm tra dung lượng hoặc quyền lưu trữ.');}},
 reset(){storage.removeItem(demoKey);previous=null;blocked=false;}
 };
}
