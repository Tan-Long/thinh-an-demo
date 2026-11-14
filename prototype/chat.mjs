import {products,available,shippingFee,recommendTea} from './state.mjs';
const normalize=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
// shortcut: deterministic local conversation; replace with reviewed knowledge/API only when live chat is scoped.
export function chatReply(state,message,context={}){
 const text=String(message).trim();if(!text||text.length>500)throw Error('Nhập câu hỏi từ 1 đến 500 ký tự.');
 const q=normalize(text),reply=(text,extra={})=>({text,...extra});
 if(/chua benh|tri benh|tieu duong|huyet ap|giam can|mang thai|thuoc/.test(q))return reply('Tôi không thể khẳng định trà có tác dụng chữa bệnh hay phù hợp với tình trạng sức khỏe của bạn. Bạn nên hỏi chuyên gia y tế; tôi có thể giúp xem thành phần và quy cách sản phẩm.',{link:'/catalog',label:'Xem sản phẩm'});
 if(/don hang|ma don|tra cuu|ta\d{4}|don cua/.test(q))return reply('Bạn có thể tra cứu bằng mã đơn và số điện thoại đặt hàng tại trang theo dõi đơn.',{link:'/tracking',label:'Tra cứu đơn hàng'});
 if(/nhan vien|nguoi that|lien he|tu van rieng/.test(q))return reply('Bạn có thể để lại yêu cầu trên biểu mẫu tư vấn của Thịnh An. Điền nhu cầu để thuận tiện trao đổi tiếp.',{handoff:true});
 if(/doanh nghiep|doi tac|qua si|so luong lon|\d+\s*(hop|phan|bo)\s*qua/.test(q))return reply('Với quà doanh nghiệp, bạn có thể chọn phương án theo ngân sách và số lượng. Xem các bộ quà rồi gửi nhu cầu để trao đổi báo giá riêng.',{link:'/gifts',label:'Chọn quà doanh nghiệp'});
 if(/thanh toan|chuyen khoan|\bcod\b|\bqr\b|ngan hang/.test(q))return reply('Ở bước đặt hàng có COD, chuyển khoản QR và mở ứng dụng ngân hàng. COD là trả khi nhận hàng. Việc mở ứng dụng không đồng nghĩa thanh toán đã được ghi nhận.');
 if(/giao hang|phi ship|van chuyen|bao lau|\bship\b/.test(q))return reply(`Phí giao hàng đang hiển thị là ${shippingFee.toLocaleString('vi-VN')} ₫/đơn. Tổng tiền được tính trước khi đặt. Thời gian giao cụ thể cần Thịnh An xác nhận theo địa chỉ nhận hàng.`);
 if(/bao quan|han su dung/.test(q))return reply('Giữ trà nơi khô ráo, tránh nắng và đóng kín sau mỗi lần dùng. Xem hạn sử dụng và hướng dẫn cụ thể trên bao bì.');
 const purpose=/qua|bieu|tang/.test(q)?'gift':/van phong|lam viec/.test(q)?'office':/hang ngay|moi ngay|uong tra/.test(q)?'daily':null;
 if(purpose)context.purpose=purpose;
 const price=q.match(/(\d+(?:[.,]\d+)?)\s*(k|nghin|ngan|trieu|tr)(?![a-z])/);
 const plain=q.match(/\b(\d{3})[.,]000\b/);
 const budget=price?Number(price[1].replace(',','.'))*(/tr/.test(price[2])?1000000:1000):plain?Number(plain[1])*1000:null;
 if(budget!==null)context.max=budget;
 const named=products.find(p=>q.includes(normalize(p.name))||q.includes(p.id.replaceAll('-',' '))||p.id==='dinh-tra'&&q.includes('dinh tra'));
 if(named){const stock=available(state,named.id)>(state.cart[named.id]||0);return reply(stock?`${named.name}: ${named.pack}, giá ${named.price.toLocaleString('vi-VN')} ₫. Bạn có thể xem chi tiết hoặc thêm vào giỏ.`:`${named.name} hiện không còn đủ số lượng khả dụng để thêm vào giỏ. Bạn có thể chọn một dòng trà khác.`,{ids:stock?[named.id]:[]});}
 if(purpose||budget!==null||/goi y|chon tra|loai nao|san pham|gia bao nhieu/.test(q)){
  const selected=context.purpose||'daily';
  const list=context.max!==undefined?['low','mid','high'].flatMap(b=>recommendTea(state,selected,b)).filter(p=>p.price<=context.max).sort((a,b)=>b.price-a.price).slice(0,2):recommendTea(state,selected);
  return reply(list.length?`Bạn có thể bắt đầu với ${list.map(p=>p.name).join(' hoặc ')}${context.max!==undefined?' trong mức '+context.max.toLocaleString('vi-VN')+' ₫ mỗi sản phẩm':''}. Giá chưa gồm phí giao hàng.`:'Chưa có sản phẩm phù hợp mức này. Bạn thử tăng ngân sách hoặc trao đổi với Thịnh An nhé.',{ids:list.map(p=>p.id)});
 }
 if(/xin chao|\bchao\b|\bhello\b|^hi$/.test(q))return reply('Chào bạn! Bạn muốn chọn trà uống mỗi ngày, biếu tặng hay dùng tại văn phòng? Có thể cho tôi biết ngân sách dự kiến nhé.');
 return reply('Tôi chưa có thông tin phù hợp cho câu hỏi này. Tôi có thể giúp chọn trà, xem phí giao hàng, cách thanh toán hoặc hướng dẫn tra cứu đơn.',{handoff:true});
}
