// DEMO: prices, inventory and customers are fictional; app snapshots persist only in this browser.
export const products = [
  {id:'tom-non',name:'Tôm nõn',fullName:'Chè Thịnh An Tôm Nõn',tag:'Thanh vị mỗi ngày',pack:'200 g · 20 gói × 10 g',price:280000,image:'facebook-1073743538749434.jpg',category:'Trà xanh',description:'Một hộp trà để mở đầu ngày mới, đón một người bạn, hay dành tặng người thân. Bao bì xanh của dòng Tôm nõn được ghi nhận từ trang HTX Chè Thịnh An.',source:'https://www.facebook.com/photo/?fbid=1073743538749434'},
  {id:'dinh-tra',name:'Đinh trà thượng hạng',fullName:'Chè Thịnh An Thượng Hạng',tag:'Gửi trao trân trọng',pack:'200 g · Hộp quà',price:650000,image:'facebook-1073743595416095.jpg',category:'Quà biếu',description:'Dòng trà thượng hạng được giới thiệu trong bài phỏng vấn Nhân Dân, làm từ phần búp non được tuyển chọn. Hộp đỏ mang một lời chúc ấm áp đến người nhận.',source:'https://www.facebook.com/photo/?fbid=1073743595416095'},
  {id:'dac-biet',name:'Thịnh An Đặc Biệt',fullName:'Chè Thịnh An Đặc Biệt',tag:'Hương vị thân quen',pack:'200 g · Túi trà',price:180000,image:'nhandan-05.jpg',category:'Trà xanh',description:'Một dòng trà mang tên Thịnh An Đặc Biệt, với bao bì được ghi nhận trong bài phỏng vấn trên Nhân Dân. Quy cách và giá bán thực tế sẽ được HTX xác nhận trước khi mở bán.',source:'https://nhandan.vn/special/HTX-che-Thinh-An-Thai-Nguyen/index.html'},
{"id": "trung-du", "name": "Trung du thuần chủng", "fullName": "Chè Thịnh An Trung Du Thuần Chủng", "tag": "Gìn giữ vị trà xưa", "pack": "200 g · Túi trà", "price": 240000, "image": "product-trung-du.svg", "category": "Trà xanh", "description": "Một lựa chọn dành cho người yêu trà truyền thống. Trung du thuần chủng gợi nhắc những buổi trà thân quen và câu chuyện của vùng chè Sông Cầu."},
{"id": "tui-loc", "name": "Trà xanh túi lọc", "fullName": "Trà Xanh Túi Lọc Thịnh An", "tag": "Thảnh thơi giữa ngày", "pack": "50 g · 25 túi × 2 g", "price": 95000, "image": "product-tui-loc.svg", "category": "Trà túi lọc", "description": "Một cách thưởng trà gọn nhẹ cho ngày bận rộn. Từng túi trà tiện dùng tại nhà, nơi làm việc hoặc mang theo trong những chuyến đi."},
{"id": "matcha", "name": "Bột trà xanh Matcha", "fullName": "Bột Trà Xanh Matcha Thịnh An", "tag": "Sáng tạo cùng vị trà", "pack": "100 g · Túi trà", "price": 160000, "image": "product-matcha.svg", "category": "Matcha", "description": "Thêm một sắc xanh cho góc bếp của bạn. Khám phá cách kết hợp bột trà xanh trong đồ uống, món bánh và những công thức yêu thích."},
{"id": "che-den", "name": "Chè đen", "fullName": "Chè Đen Thịnh An", "tag": "Một khoảng lặng riêng", "pack": "100 g · Túi trà", "price": 120000, "image": "product-che-den.svg", "category": "Trà đen", "description": "Một lựa chọn khác trong bộ sưu tập trà Thịnh An, dành cho những lúc muốn đổi vị. Thưởng thức theo cách bạn yêu thích, trong một buổi chiều thong thả."}
];
export const shippingFee=30000;
export const statuses={pending:'Chờ xác nhận',confirmed:'Đã xác nhận',shipping:'Đang giao',delivered:'Đã giao',cancelled:'Đã hủy'};
export const payments={pending:'Chưa thanh toán',paid:'Đã thanh toán',collected:'Đã thu hộ · chờ đối soát',remitted:'Đã nhận tiền COD'};
export function createStore(seed=true){
 const state={stock:{'tom-non':48,'dinh-tra':24,'dac-biet':36,'trung-du':40,'tui-loc':60,'matcha':30,'che-den':40},cart:{},orders:[],quotes:[],care:{},activity:[],affiliates:[],referral:null,affRate:10,sequence:1025};
 if(seed){
  state.affiliates.push({code:'ANNHIEN',name:'An Nhiên',phone:'0900000003',channel:'Cộng đồng yêu trà',status:'approved',visits:12});
  state.orders.push({affiliate:{code:'ANNHIEN',rate:10,amount:56000},id:'TA1024',name:'Minh Anh',phone:'0900000001',address:'Hà Nội',method:'cod',lines:[{id:'tom-non',qty:2,price:280000}],subtotal:560000,shipping:30000,total:590000,status:'pending',payment:'pending',date:'13/11/2026'});
  state.orders.push({affiliate:{code:'ANNHIEN',rate:10,amount:65000},id:'TA1023',name:'Hoàng Nam',phone:'0900000002',address:'Thái Nguyên',method:'qr',lines:[{id:'dinh-tra',qty:1,price:650000}],subtotal:650000,shipping:30000,total:680000,status:'delivered',payment:'paid',date:'13/11/2026'});
 }
 return state;
}
export function reserved(s,id){return s.orders.filter(o=>['pending','confirmed'].includes(o.status)).reduce((n,o)=>n+o.lines.filter(l=>l.id===id).reduce((n,l)=>n+l.qty,0),0);}
export function available(s,id){return s.stock[id]-reserved(s,id);}
export function setCart(s,id,qty){
 if(!products.some(p=>p.id===id)||!Number.isSafeInteger(qty)||qty<0)throw Error('Số lượng không hợp lệ.');
 if(qty>available(s,id))throw Error('Số lượng vượt quá tồn khả dụng hiện có.');
 if(qty===0)delete s.cart[id];else s.cart[id]=qty;
}
export function totals(s){const subtotal=products.reduce((sum,p)=>sum+p.price*(s.cart[p.id]||0),0);return {subtotal,shipping:subtotal?shippingFee:0,total:subtotal?subtotal+shippingFee:0};}
export function customerFields(input){
 const name=String(input.name||'').trim(),phone=String(input.phone||'').replace(/[\s.-]/g,''),address=String(input.address||'').trim();
 if(name.length<2||name.length>80)throw Error('Nhập tên người nhận từ 2 đến 80 ký tự.');
 if(!/^(0\d{9}|\+84\d{9})$/.test(phone))throw Error('Nhập số điện thoại Việt Nam gồm 10 số, bắt đầu bằng 0.');
 if(address.length<8||address.length>250)throw Error('Nhập địa chỉ nhận hàng từ 8 đến 250 ký tự.');
 return {name,phone,address};
}
export function placeOrder(s,input){
 const customer=customerFields(input);
 if(!['cod','qr','bank'].includes(input.method))throw Error('Vui lòng chọn phương thức thanh toán.');
 const entries=Object.entries(s.cart);if(!entries.length)throw Error('Giỏ hàng đang trống.');
 for(const [id,qty] of entries){if(!products.some(p=>p.id===id)||!Number.isSafeInteger(qty)||qty<1||qty>available(s,id))throw Error('Giỏ hàng đã thay đổi, vui lòng kiểm tra lại tồn kho.');}
 const o={id:'TA'+s.sequence++,...customer,method:input.method,lines:entries.map(([id,qty])=>({id,qty,price:products.find(p=>p.id===id).price})),...totals(s),status:'pending',payment:'pending',date:new Date().toLocaleString('vi-VN')};
 const partner=s.affiliates.find(a=>a.code===s.referral&&a.status==='approved');
 if(partner)o.affiliate={code:partner.code,rate:s.affRate,amount:Math.round(o.subtotal*s.affRate/100)};
 o.createdAt=new Date().toISOString();s.orders.unshift(o);s.cart={};track(s,'order',o.id,'Đã tiếp nhận đơn hàng');return o;
}
export function markPaid(s,id){const o=s.orders.find(x=>x.id===id);if(!o||o.method==='cod'||o.status==='cancelled')throw Error('Không thể xác nhận thanh toán cho đơn này.');if(o.payment==='paid')return;o.payment='paid';track(s,'order',o.id,'Đã xác nhận thanh toán');}
export function transition(s,id,next){
 const o=s.orders.find(x=>x.id===id);if(!o)throw Error('Không tìm thấy đơn.');
 const allowed={pending:['confirmed','cancelled'],confirmed:['shipping','cancelled'],shipping:['delivered'],delivered:[],cancelled:[]};
 if(!allowed[o.status].includes(next))throw Error('Chuyển trạng thái không hợp lệ.');
 if(next==='confirmed'&&o.method!=='cod'&&o.payment!=='paid')throw Error('Đơn trả trước cần xác nhận thanh toán trước khi xử lý.');
 if(next==='shipping')for(const l of o.lines)s.stock[l.id]-=l.qty;
 if(next==='delivered'&&o.method==='cod')o.payment='collected';
 o.status=next;track(s,'order',o.id,statuses[next]);
}
export function remit(s,id){const o=s.orders.find(x=>x.id===id);if(!o||o.method!=='cod'||o.status!=='delivered'||o.payment!=='collected')throw Error('Đơn chưa đủ điều kiện đối soát COD.');o.payment='remitted';track(s,'order',o.id,'Đã đối soát tiền COD');}
export function adjustStock(s,id,value){if(!(id in s.stock)||!Number.isSafeInteger(value)||value<reserved(s,id)||value>10000)throw Error('Tồn thực tế phải là số nguyên, không thấp hơn lượng đã giữ và tối đa 10.000.');const before=s.stock[id];s.stock[id]=value;track(s,'stock',id,'Điều chỉnh tồn kho',`${before} → ${value}`);}
export function addQuote(s,input){const name=String(input.name||'').trim(),company=String(input.company||'').trim(),phone=String(input.phone||'').replace(/[\s.-]/g,''),qty=input.qty==null||String(input.qty).trim()===''?null:Number(input.qty),note=String(input.note||'').trim();if(name.length<2||name.length>80||(company.length>0&&company.length<2)||company.length>120||!/^(0\d{9}|\+84\d{9})$/.test(phone)||(qty!==null&&(!Number.isSafeInteger(qty)||qty<1||qty>10000))||note.length>1000)throw Error('Kiểm tra họ tên, số điện thoại; số lượng nếu nhập phải từ 1–10.000 bộ.');const q={id:'BG'+(s.quotes.length+1).toString().padStart(3,'0'),name,company,phone,qty,note,createdAt:new Date().toISOString()};s.quotes.unshift(q);track(s,'quote',q.id,'Đã tiếp nhận yêu cầu tư vấn');return q;}

// shortcut: browser-saved care records send no messages; use server storage and approved channels for production.
function track(s,type,id,label,note=''){s.activity.unshift({type,id,label,note,at:new Date().toISOString()});}
export function careTasks(s){
 const tasks=[...s.quotes.map(q=>({key:'quote:'+q.id,type:'quote',id:q.id,name:q.name,phone:q.phone,label:'Khách cần tư vấn',source:q.source||'website',createdAt:q.createdAt,note:q.note})),...s.orders.filter(o=>o.status==='pending').map(o=>{const type=o.method!=='cod'&&o.payment==='pending'?'payment':'confirm';return {key:type+':'+o.id,type,id:o.id,name:o.name,phone:o.phone,label:type==='payment'?'Đơn chờ thanh toán':'Đơn chờ xác nhận',createdAt:o.createdAt,total:o.total};})];
 return tasks.map(task=>({...task,dueAt:task.createdAt||null,...s.care[task.key]})).sort((a,b)=>Number(a.done||false)-Number(b.done||false)||(Date.parse(a.dueAt)||0)-(Date.parse(b.dueAt)||0));
}
export function recordCare(s,key,action,note=''){
 const task=careTasks(s).find(t=>t.key===key);if(!task)throw Error('Yêu cầu này đã thay đổi. Vui lòng tải lại danh sách.');
 if(!['contacted','tomorrow','note'].includes(action))throw Error('Thao tác chăm sóc không hợp lệ.');
 note=String(note).trim();if(note.length>600||action==='note'&&!note)throw Error('Nhập ghi chú từ 1 đến 600 ký tự.');
 const record=s.care[key]||{};
 if(action==='contacted')record.done=true;
 if(action==='tomorrow'){record.done=false;record.dueAt=new Date(Date.now()+86400000).toISOString();}
 s.care[key]=record;
 track(s,task.type==='quote'?'quote':'order',task.id,{contacted:'Đã ghi nhận liên hệ',tomorrow:'Hẹn nhắc lại sau 1 ngày',note:'Ghi chú chăm sóc'}[action],note);
 return record;
}
export function recommendTea(s,purpose,budget='all'){
 const choices={daily:['tom-non','dac-biet','tui-loc'],gift:['dinh-tra','tom-non','trung-du'],office:['tui-loc','tom-non','dac-biet']};
 if(!choices[purpose]||!['all','low','mid','high'].includes(budget))return [];
 return choices[purpose].map(id=>products.find(p=>p.id===id)).filter(p=>available(s,p.id)>(s.cart[p.id]||0)&&(budget==='all'||budget==='low'&&p.price<300000||budget==='mid'&&p.price>=300000&&p.price<=600000||budget==='high'&&p.price>600000)).slice(0,2);
}

// shortcut: referral attribution lasts only in this tab's memory; use server-side attribution before launch.
export function registerAffiliate(s,input){
 const name=String(input.name||'').trim(),phone=String(input.phone||'').replace(/[\s.-]/g,''),channel=String(input.channel||'').trim();
 if(name.length<2||name.length>80||! /^(0\d{9}|\+84\d{9})$/.test(phone)||channel.length<2||channel.length>200)throw Error('Nhập tên, số điện thoại hợp lệ và kênh giới thiệu từ 2 đến 200 ký tự.');
 const normalized=phone.replace(/^\+84/,'0');
 if(s.affiliates.some(a=>a.phone.replace(/^\+84/,'0')===normalized))throw Error('Số điện thoại này đã đăng ký cộng tác viên.');
 const a={code:'CTV'+String(s.affiliates.length+1).padStart(3,'0'),name,phone,channel,status:'pending',visits:0};
 s.affiliates.push(a);track(s,'affiliate',a.code,'Đăng ký cộng tác viên');return a;
}
export function approveAffiliate(s,code){const a=s.affiliates.find(a=>a.code===code);if(!a||a.status!=='pending')throw Error('Cộng tác viên không ở trạng thái chờ duyệt.');a.status='approved';track(s,'affiliate',code,'Duyệt cộng tác viên');}
export function captureReferral(s,code){
 const a=s.affiliates.find(a=>a.code===String(code||'').trim().toUpperCase()&&a.status==='approved');
 if(!a)return false;
 if(s.referral!==a.code)a.visits++;
 s.referral=a.code;return true;
}
export function setAffiliateRate(s,value){const rate=Number(value);if(String(value).trim()===''||!Number.isFinite(rate)||rate<0||rate>100||!/^(?:\d+)(?:\.\d{1,2})?$/.test(String(value).trim()))throw Error('Hoa hồng từ 0 đến 100%, tối đa hai số thập phân.');s.affRate=rate;}
export function commissionStatus(o){
 if(!o.affiliate)return 'none';
 if(o.affiliate.voidReason||o.status==='cancelled')return o.affiliate.paidAt?'recovery':'void';
 if(o.affiliate.paidAt)return 'paid';
 return o.status==='delivered'&&['paid','remitted'].includes(o.payment)?'eligible':'pending';
}
export function payCommission(s,id){const o=s.orders.find(o=>o.id===id);if(!o||commissionStatus(o)!=='eligible')throw Error('Chỉ đối soát hoa hồng khi đơn đã giao và đã nhận tiền.');o.affiliate.paidAt=new Date().toISOString();track(s,'affiliate',o.affiliate.code,'Ghi nhận chi hoa hồng '+id);}
export function voidCommission(s,id,reason){const o=s.orders.find(o=>o.id===id);reason=String(reason||'').trim();if(!o?.affiliate||['void','recovery'].includes(commissionStatus(o))||reason.length<3||reason.length>300)throw Error('Nhập lý do điều chỉnh từ 3 đến 300 ký tự cho hoa hồng chưa bị loại.');o.affiliate.voidReason=reason;track(s,'affiliate',o.affiliate.code,'Điều chỉnh hoa hồng '+id,reason);}

// shortcut: this is a local demo lookup, not authentication; require server-side OTP before using real customer data.
export function lookupOrder(s,code,phone){
 code=String(code||'').trim().toUpperCase();phone=String(phone||'').replace(/[\s.-]/g,'').replace(/^\+84/,'0');
 if(!/^TA\d{4,}$/.test(code)||!/^0\d{9}$/.test(phone))return null;
 return s.orders.find(o=>o.id===code&&o.phone.replace(/[\s.-]/g,'').replace(/^\+84/,'0')===phone)||null;
}

export const customerKey=phone=>String(phone).replace(/[\s.-]/g,'').replace(/^\+84/,'0');
export function addCustomerNote(s,phone,text){
 const key=customerKey(phone);text=String(text||'').trim();
 if(![...s.orders,...s.quotes].some(x=>customerKey(x.phone)===key)||!text||text.length>600)throw Error('Nhập ghi chú từ 1 đến 600 ký tự cho khách hàng có trong danh sách.');
 s.customerNotes??={};s.customerNotes[key]??=[];s.customerNotes[key].unshift({text,at:new Date().toISOString()});
 track(s,'customer',key,'Đã thêm ghi chú khách hàng',text);
}
export function addChatLead(s,input){
 const note=String(input.note||'').trim();if(note.length<5)throw Error('Chia sẻ nhu cầu tư vấn từ 5 ký tự.');
 const phone=customerKey(input.phone),name=String(input.name||'').trim();
 if(name.length<2||name.length>80||!/^0\d{9}$/.test(phone)||note.length>1000)throw Error('Kiểm tra họ tên, số điện thoại và nhu cầu tối đa 1.000 ký tự.');
 const duplicate=s.quotes.find(q=>q.source==='chatbot'&&customerKey(q.phone)===phone&&q.note===note&&!s.care['quote:'+q.id]?.done);
 if(duplicate)return duplicate;
 const q=addQuote(s,{...input,note});q.source='chatbot';return q;
}
export function lowStock(s,threshold=5){return products.filter(p=>available(s,p.id)<=threshold).map(p=>({...p,available:available(s,p.id)}));}
