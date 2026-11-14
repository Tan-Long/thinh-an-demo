import test from 'node:test';
import assert from 'node:assert/strict';
import {createStore,setCart,placeOrder,totals,available,transition,markPaid,remit,adjustStock,addQuote,careTasks,recordCare,recommendTea,registerAffiliate,approveAffiliate,captureReferral,setAffiliateRate,commissionStatus,payCommission,voidCommission,lookupOrder} from './state.mjs';
const customer={name:'Khách thử nghiệm',phone:'0900000000',address:'Địa chỉ mẫu Hà Nội',method:'cod'};
test('COD reserves stock, releases on cancel and never auto-marks paid',()=>{const s=createStore(false);setCart(s,'tom-non',2);assert.equal(totals(s).total,590000);const o=placeOrder(s,customer);assert.equal(o.payment,'pending');assert.equal(available(s,'tom-non'),46);assert.throws(()=>adjustStock(s,'tom-non',1));transition(s,o.id,'cancelled');assert.equal(available(s,'tom-non'),48);assert.throws(()=>transition(s,o.id,'cancelled'));});
test('Fulfilment decrements once and distinguishes collection from remittance',()=>{const s=createStore(false);setCart(s,'tom-non',1);const o=placeOrder(s,customer);transition(s,o.id,'confirmed');transition(s,o.id,'shipping');assert.equal(s.stock['tom-non'],47);assert.equal(available(s,'tom-non'),47);assert.throws(()=>transition(s,o.id,'shipping'));transition(s,o.id,'delivered');assert.equal(o.payment,'collected');remit(s,o.id);assert.equal(o.payment,'remitted');});
test('Prepaid orders need payment, reject overselling and duplicate submission',()=>{const s=createStore(false);assert.throws(()=>setCart(s,'tom-non',49));setCart(s,'dinh-tra',1);const o=placeOrder(s,{...customer,method:'qr'});assert.throws(()=>transition(s,o.id,'confirmed'));markPaid(s,o.id);markPaid(s,o.id);transition(s,o.id,'confirmed');assert.throws(()=>placeOrder(s,customer));});
test('Invalid customer, cart and quote data cannot create records',()=>{const s=createStore(false);setCart(s,'tom-non',1);assert.throws(()=>placeOrder(s,{...customer,phone:'123'}));assert.equal(s.orders.length,0);s.cart.unknown=1;assert.throws(()=>placeOrder(s,customer));assert.throws(()=>addQuote(s,{name:'X',qty:-1}));assert.equal(s.quotes.length,0);});
test('New catalogue products can be ordered and fulfilled with finite inventory',()=>{for(const id of ['trung-du','tui-loc','matcha','che-den']){const s=createStore(false);const before=available(s,id);assert.ok(Number.isFinite(before)&&before>0);setCart(s,id,2);const o=placeOrder(s,customer);assert.equal(o.lines[0].id,id);assert.ok(Number.isFinite(o.total)&&o.total>30000);assert.equal(available(s,id),before-2);transition(s,o.id,'confirmed');transition(s,o.id,'shipping');assert.equal(s.stock[id],before-2);}});

test('Gift enquiries need only contact details and validate optional quantity',()=>{const s=createStore(false);const contact={name:'Người nhận',phone:'0900000000'};const q=addQuote(s,contact);assert.equal(q.qty,null);assert.equal(q.company,'');assert.equal(addQuote(s,{...contact,qty:'',note:'Quà Tết'}).qty,null);assert.equal(addQuote(s,{...contact,qty:'30'}).qty,30);for(const qty of ['0','-1','1.5','abc','10001'])assert.throws(()=>addQuote(s,{...contact,qty}));assert.throws(()=>addQuote(s,{...contact,phone:'123'}));assert.equal(s.quotes.length,3);});

test('Care queue follows payment and confirmation without marking orders paid',()=>{const s=createStore(false);setCart(s,'tom-non',1);const o=placeOrder(s,{...customer,method:'qr'});assert.equal(careTasks(s)[0].type,'payment');recordCare(s,'payment:'+o.id,'contacted','Khách sẽ chuyển sau');assert.equal(o.payment,'pending');assert.equal(careTasks(s)[0].done,true);markPaid(s,o.id);assert.equal(careTasks(s)[0].type,'confirm');assert.equal(careTasks(s)[0].done,undefined);transition(s,o.id,'confirmed');assert.equal(careTasks(s).length,0);assert.ok(s.activity.some(e=>e.label==='Đã xác nhận thanh toán'));});
test('Quote care records support reminders and notes without duplicates',()=>{const s=createStore(false);const q=addQuote(s,{name:'Khách tư vấn',phone:'0900000000'});assert.equal(careTasks(s).length,1);recordCare(s,'quote:'+q.id,'tomorrow','Gọi ngày mai');assert.ok(Date.parse(careTasks(s)[0].dueAt)>Date.now());recordCare(s,'quote:'+q.id,'note','Ngân sách 300 nghìn');assert.equal(careTasks(s).length,1);assert.throws(()=>recordCare(s,'missing','contacted'));assert.throws(()=>recordCare(s,'quote:'+q.id,'note',''));assert.equal(s.activity.length,3);});
test('Tea suggestions respect purpose, budget and stock',()=>{const s=createStore(false);assert.ok(recommendTea(s,'gift','high').every(p=>p.price>600000));assert.equal(recommendTea(s,'daily','high').length,0);setCart(s,'dinh-tra',s.stock['dinh-tra']);assert.equal(recommendTea(s,'gift','high').length,0);assert.equal(recommendTea(s,'unknown').length,0);assert.ok(recommendTea(s,'office','low').every(p=>p.price<300000));});

test('AFF registration validates contacts; only approved codes attribute new orders',()=>{
 const s=createStore(false);const a=registerAffiliate(s,{name:'Cộng tác viên',phone:'0900000000',channel:'Facebook'});
 assert.equal(captureReferral(s,a.code),false);assert.throws(()=>registerAffiliate(s,{name:'Trùng',phone:'+84900000000',channel:'TikTok'}));
 approveAffiliate(s,a.code);assert.equal(captureReferral(s,a.code.toLowerCase()),true);captureReferral(s,a.code);assert.equal(a.visits,1);
 assert.equal(captureReferral(s,'bad'),false);assert.equal(s.referral,a.code);
 setCart(s,'tom-non',1);const o=placeOrder(s,customer);assert.equal(o.affiliate.amount,28000);assert.equal(o.affiliate.code,a.code);
 setAffiliateRate(s,15);assert.equal(o.affiliate.rate,10);setCart(s,'tom-non',1);assert.equal(placeOrder(s,customer).affiliate.amount,42000);
 setAffiliateRate(s,'0.29');assert.equal(s.affRate,0.29);
 for(const rate of ['',-1,101,'bad',0.001])assert.throws(()=>setAffiliateRate(s,rate));
});
test('AFF COD requires received funds; payouts cannot duplicate; refunds preserve recovery',()=>{
 const s=createStore();captureReferral(s,'ANNHIEN');setCart(s,'tom-non',1);const o=placeOrder(s,customer);
 assert.throws(()=>payCommission(s,o.id));transition(s,o.id,'confirmed');transition(s,o.id,'shipping');transition(s,o.id,'delivered');
 assert.equal(commissionStatus(o),'pending');assert.throws(()=>payCommission(s,o.id));remit(s,o.id);assert.equal(commissionStatus(o),'eligible');
 payCommission(s,o.id);assert.equal(commissionStatus(o),'paid');assert.throws(()=>payCommission(s,o.id));voidCommission(s,o.id,'Hoàn toàn bộ đơn');
 assert.equal(commissionStatus(o),'recovery');assert.ok(o.affiliate.paidAt);assert.throws(()=>voidCommission(s,o.id,'Lặp lại'));
});
test('AFF cancellation and pre-payout adjustments exclude commission; unrelated orders have none',()=>{
 const s=createStore();setCart(s,'tom-non',1);assert.equal(placeOrder(s,customer).affiliate,undefined);
 captureReferral(s,'ANNHIEN');setCart(s,'tom-non',1);const o=placeOrder(s,customer);transition(s,o.id,'cancelled');assert.equal(commissionStatus(o),'void');assert.throws(()=>payCommission(s,o.id));
 assert.throws(()=>voidCommission(s,'TA1023',''));voidCommission(s,'TA1023','Đơn được hoàn trả');assert.equal(commissionStatus(s.orders.find(o=>o.id==='TA1023')),'void');assert.throws(()=>payCommission(s,'TA1023'));
});


test('Order lookup requires matching normalized code and phone and reflects current state',()=>{
 const s=createStore();assert.equal(lookupOrder(s,' ta1024 ','+84 900 000 001').id,'TA1024');
 for(const [code,phone] of [['TA1024','0900000002'],['TA9999','0900000001'],['','0900000001'],['TA1024','123']])assert.equal(lookupOrder(s,code,phone),null);
 transition(s,'TA1024','confirmed');assert.equal(lookupOrder(s,'TA1024','0900000001').status,'confirmed');
});
