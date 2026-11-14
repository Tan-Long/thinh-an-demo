import test from 'node:test';
import assert from 'node:assert/strict';
import {createDemoStorage,decodeDemo,demoKey} from './storage.mjs';
import {createStore,setCart,addChatLead,careTasks,addCustomerNote,lowStock,adjustStock} from './state.mjs';
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}};
test('demo roundtrip, reset and competing tabs preserve saved data',()=>{
 const storage=memory(),a=createDemoStorage(storage),s=a.load().state;setCart(s,'tom-non',2);a.save({state:s,chat:{messages:[{role:'user',text:'Xin chào'}]},checkout:{name:'Tên thử'}});
 const b=createDemoStorage(storage);assert.equal(b.load().state.cart['tom-non'],2);assert.equal(decodeDemo(storage.getItem(demoKey)).checkout.name,'Tên thử');
 const c=createDemoStorage(storage);const sc=c.load().state;setCart(sc,'tom-non',3);c.save({state:sc});assert.throws(()=>a.save({state:s}),/tab khác/);assert.equal(decodeDemo(storage.getItem(demoKey)).state.cart['tom-non'],3);
 c.reset();assert.equal(storage.getItem(demoKey),null);
});
test('invalid or unavailable storage never overwrites unreadable data',()=>{
 const storage=memory();storage.setItem(demoKey,'invalid');const a=createDemoStorage(storage);assert(a.load().error);assert.equal(a.save({state:createStore()}),false);assert.equal(storage.getItem(demoKey),'invalid');
 assert.throws(()=>decodeDemo('{"__proto__":{}}'));
 const b=createDemoStorage({getItem:()=>null,setItem:()=>{throw Error('quota')},removeItem:()=>{}});b.load();assert.throws(()=>b.save({state:createStore()}),/chưa lưu/);
});
test('chat leads deduplicate pending requests and feed care; notes and stock alerts',()=>{
 const s=createStore();const lead={name:'Khách thử',phone:'+84900000009',note:'Cần mua 30 hộp trà'};
 const q=addChatLead(s,lead);assert.equal(addChatLead(s,{...lead,phone:'0900000009'}).id,q.id);assert.equal(s.quotes.length,1);assert.equal(careTasks(s).find(t=>t.id===q.id).source,'chatbot');
 assert.throws(()=>addChatLead(s,{...lead,note:''}));addCustomerNote(s,'0900000009','Thích trà túi lọc');assert.equal(s.customerNotes['0900000009'][0].text,'Thích trà túi lọc');assert.throws(()=>addCustomerNote(s,'0900000009',''));
 adjustStock(s,'tom-non',5);assert.equal(lowStock(s).find(p=>p.id==='tom-non').available,3);assert.equal(s.activity[0].type,'stock');
 assert.equal(decodeDemo(JSON.stringify({version:1,state:s})).state.quotes[0].source,'chatbot');
});
