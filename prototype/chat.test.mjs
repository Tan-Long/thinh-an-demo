import test from 'node:test';
import assert from 'node:assert/strict';
import {chatReply} from './chat.mjs';
import {createStore,products} from './state.mjs';
test('chat recommendations respect price and cart stock; no mutation of orders',()=>{
 const s=createStore(),c={};const r=chatReply(s,'trà biếu dưới 300k',c);assert(r.ids.length);assert(r.ids.every(id=>products.find(p=>p.id===id).price<=300000));
 for(const p of products)s.stock[p.id]=0;
 assert.equal(chatReply(s,'gợi ý',c).ids.length,0);assert.equal(s.orders.length,2);
});
test('chat routes tracking, corporate, handoff and honest unsupported answers',()=>{
 const s=createStore();assert.equal(chatReply(s,'đơn hàng TA1024').link,'/tracking');assert.equal(chatReply(s,'30 hộp quà').link,'/gifts');assert.equal(chatReply(s,'gặp nhân viên').handoff,true);assert.match(chatReply(s,'trà chữa bệnh không').text,/không thể/);assert.match(chatReply(s,'thời tiết').text,/chưa có thông tin/);assert.throws(()=>chatReply(s,'x'.repeat(501)));assert.match(chatReply(s,'ship bao lâu').text,/xác nhận/);
});
