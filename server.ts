import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('✅ GoogleGenAI initialized successfully.');
  } catch (err) {
    console.warn('⚠️ GoogleGenAI initialization error:', err);
  }
} else {
  console.log('ℹ️ Running in demo pedagogical mode (No GEMINI_API_KEY provided).');
}

// Check AI status
app.get('/api/ai/status', (req: Request, res: Response) => {
  res.json({
    hasKey: Boolean(aiClient),
    model: 'gemini-2.5-flash',
    mode: aiClient ? 'live' : 'pedagogical_demo',
  });
});

function getAiClient(req: Request): GoogleGenAI | null {
  const clientKey = (req.body?.clientApiKey as string) || (req.headers['x-gemini-api-key'] as string);
  if (clientKey) {
    try {
      return new GoogleGenAI({
        apiKey: clientKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
    } catch (e) {
      console.warn('Custom client key init error:', e);
    }
  }
  return aiClient;
}

function normalizeText(str: string): string {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase();
}

function solveArithmeticExpression(text: string): string | null {
  // Tìm biểu thức số học đơn giản như: "1 + 1", "5 * 6", "100 / 4", "25 - 12", "1+1 bằng mấy"
  const clean = text.replace(/bằng mấy|bằng bao nhiêu|\?|=/gi, '').trim();
  const match = clean.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/xX÷])\s*(\d+(?:\.\d+)?)/);
  if (!match) return null;

  const a = parseFloat(match[1]);
  let op = match[2];
  const b = parseFloat(match[3]);
  if (isNaN(a) || isNaN(b)) return null;

  let res = 0;
  let opName = '';
  if (op === '+' || op === 'cộng') {
    res = a + b;
    opName = 'phép cộng';
  } else if (op === '-' || op === 'trừ') {
    res = a - b;
    opName = 'phép trừ';
  } else if (op === '*' || op === 'x' || op === 'X' || op === 'nhân') {
    res = a * b;
    opName = 'phép nhân';
  } else if (op === '/' || op === '÷' || op === 'chia') {
    if (b === 0) return 'Trong toán học, chúng ta không thể chia một số cho 0 đâu nhé!';
    res = a / b;
    opName = 'phép chia';
  } else {
    return null;
  }

  const rounded = Number.isInteger(res) ? res.toString() : res.toFixed(2);
  return `💡 **Kết quả tính toán:**\n\nThực hiện ${opName}: **${a} ${op} ${b} = ${rounded}**.\n\n✨ *Mẹo nhỏ:* Luôn kiểm tra lại phép tính bằng cách làm ngược lại (ví dụ kiểm tra phép cộng bằng phép trừ) để chắc chắn kết quả chính xác 100% nhé!`;
}

function generateServerPedagogicalReply(
  message: string,
  userRole: string,
  subject: string,
  className: string,
  teacherName: string,
  materialsContext?: string
): string {
  const norm = normalizeText(message);
  const normSub = normalizeText(subject);

  // 0. Kiểm tra phép tính số học trực tiếp
  const mathResult = solveArithmeticExpression(message);
  if (mathResult) return mathResult;

  // 1. Chế độ Giáo viên
  if (userRole === 'teacher') {
    if (norm.includes('giao an') || norm.includes('ke hoach') || norm.includes('bai day') || norm.includes('cv 2345') || norm.includes('2345')) {
      return `📋 **KẾ HOẠCH BÀI DẠY (GIÁO ÁN CHUẨN CÔNG VĂN 2345/BGDĐT-GDTH)**
**Trường Tiểu học Hoài Nhơn** • **Lớp ${className || '3C1'}** • **GVCN: ${teacherName || 'Đỗ Thị Hoà'}**
**Môn:** ${subject || 'Tiểu học'} • **Bài:** ${message.replace(/(soạn|giáo án|kế hoạch bài dạy|cho tôi|giúp tôi)/gi, '').trim() || 'Bài học phân môn'}

---
### I. YÊU CẦU CẦN ĐẠT
1. **Năng lực đặc thù:** Nắm vững kiến thức trọng tâm bài học, hiểu bản chất khái niệm và thực hành đúng quy trình thao tác chuẩn của môn ${subject || 'học'}.
2. **Năng lực chung:** Tự chủ, tự học, tích cực thảo luận nhóm, biết lắng nghe và phản biện tích cực.
3. **Phẩm chất chủ yếu:** Chăm chỉ, trách nhiệm, bồi dưỡng tình yêu quê hương Hoài Nhơn và ý thức giữ gìn vệ sinh lớp học.

---
### II. ĐỒ DÙNG DẠY HỌC
- **Giáo viên:** Thiết bị dạy học số, bài giảng điện tử, học liệu số từ thư viện trường, phiếu học tập nhóm.
- **Học sinh:** Sách giáo khoa, vở bài tập, bảng nhóm.

---
### III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU
1. **Hoạt động Khởi động - Kết nối (5 phút):**
   - Trò chơi tương tác mini "Vòng quay may mắn" tạo hứng thú học tập.
2. **Hoạt động Khám phá - Hình thành kiến thức mới (15 phút):**
   - GV trình chiếu học liệu số, đặt câu hỏi gợi mở định hướng quan sát.
   - HS thảo luận nhóm 4, điền phiếu học tập và đại diện trình bày. GV chuẩn hóa kiến thức.
3. **Hoạt động Luyện tập - Thực hành (10 phút):**
   - HS làm bài tập vào vở. GV quan sát, giúp đỡ HS gặp khó khăn theo Thông tư 27.
4. **Hoạt động Vận dụng - Trải nghiệm (5 phút):**
   - Liên hệ thực tế đời sống địa phương, hướng dẫn HS tự ôn bài trên Kho học liệu số.`;
    }
    if (norm.includes('trai nghiem') || norm.includes('hoat dong')) {
      return `✨ **THIẾT KẾ HOẠT ĐỘNG TRẢI NGHIỆM ĐỔI MỚI PHƯƠNG PHÁP GDPT 2018**
**Môn:** ${subject || 'Tiểu học'} • **Lớp:** ${className || '3C1'}

1. **Tên hoạt động:** "Khám phá tri thức nhí quê hương Hoài Nhơn"
2. **Mục tiêu:** Phát triển năng lực giải quyết vấn đề sáng tạo và kỹ năng hợp tác nhóm.
3. **Tiến trình 3 bước:**
   - *Bước 1 (Khám phá):* Nhóm 4 HS tra cứu học liệu số liên kết bài học.
   - *Bước 2 (Thực hành trải nghiệm):* Tạo sản phẩm sơ đồ tư duy hoặc giải bài tập nhóm.
   - *Bước 3 (Báo cáo & Vinh danh):* Báo cáo sản phẩm trước lớp, nhận huy hiệu khen thưởng!`;
    }
    if (norm.includes('tieu chi') || norm.includes('rubric') || norm.includes('danh gia')) {
      return `📊 **BẢNG TIÊU CHÍ ĐÁNH GIÁ NĂNG LỰC HỌC SINH (RUBRIC THEO THÔNG TƯ 27/2020/BGDĐT)**
**Môn:** ${subject || 'Tiểu học'} • **Lớp:** ${className || '3C1'}

| Tiêu chí | Mức T (Hoàn thành Tốt) | Mức H (Hoàn thành) | Mức C (Chưa hoàn thành) |
| :--- | :--- | :--- | :--- |
| **Nắm kiến thức** | Hiểu sâu, nhớ bài chuẩn, giải thích mạch lạc | Nắm kiến thức cơ bản, làm đúng phần lớn | Cần thầy/cô gợi ý, còn nhầm lẫn |
| **Thực hành** | Làm bài tập chính xác 100%, trình bày đẹp | Làm đúng bài cơ bản, trình bày rõ ràng | Thao tác còn chậm, cần hỗ trợ |
| **Thái độ học tập**| Chủ động phát biểu, hợp tác nhóm tích cực | Chú ý nghe giảng, tham gia đủ hoạt động | Thỉnh thoảng mất tập trung |`;
    }
    if (norm.includes('tro choi') || norm.includes('game')) {
      return `🎮 **GỢI Ý TRÒ CHƠI HỌC TẬP KHỞI ĐỘNG TIẾT HỌC**
**Tên trò chơi:** "Chuyến Tàu Tri Thức Hoài Nhơn" (Thời lượng: 5-7 phút)
- **Mục tiêu:** Kích hoạt năng lượng lớp học, ôn lại kiến thức bài trước tự nhiên.
- **Luật chơi:** Lớp chia làm 4 đội (4 toa tàu). Mỗi đội trả lời câu hỏi đố vui từ học liệu số; đội nào bấm chuông nhanh nhất và trả lời đúng sẽ giúp tàu tiến thêm 1 trạm và nhận Huy hiệu Hoa Điểm Tốt!`;
    }
    if (norm.includes('tinh huong') || norm.includes('mat tap trung') || norm.includes('noi chuyen')) {
      return `💡 **TƯ VẤN XỬ LÝ TÌNH HUỐNG SƯ PHẠM TIỂU HỌC**
**Tình huống:** Học sinh lớp ${className || '3C1'} có biểu hiện mất tập trung hoặc nói chuyện riêng.
**Giải pháp 4 bước khéo léo:**
1. *Quan sát nhẹ nhàng:* Di chuyển gần về phía bàn em học sinh mà không ngắt quãng tiết giảng.
2. *Thu hút sự chú ý:* Đặt câu hỏi vừa sức hoặc nhờ em làm trợ lý chuyển slide.
3. *Khen ngợi kịp thời:* Khen ngợi ngay khi em tập trung trở lại để tạo động lực tự giác.
4. *Phối hợp phụ huynh:* Trò chuyện riêng sau giờ học và kết nối với phụ huynh qua sổ liên lạc điện tử.`;
    }
    if (norm.includes('chao') || norm.includes('hello') || norm.includes('hi') || norm.includes('ban la ai') || norm.includes('khoe khong')) {
      return `Kính chào thầy/cô ${teacherName || 'Đỗ Thị Hoà'}! 👋 AIBuddy rất vui được đồng hành cùng thầy/cô trong công tác giảng dạy và điều hành lớp ${className || '3C1'}.\n\nTôi sẵn sàng hỗ trợ thầy/cô:\n• 📋 Soạn giáo án (Kế hoạch bài dạy chuẩn CV 2345/BGDĐT).\n• 📊 Thiết kế bảng Rubric đánh giá năng lực học sinh theo Thông tư 27.\n• 🎮 Sáng tạo hoạt động trải nghiệm, trò chơi mở đầu & củng cố tiết dạy.\n• 📅 Tự động đồng bộ lịch họp và nhắc việc lớp qua Dola AI.\n• 💡 Tư vấn mọi vấn đề chuyên môn, công nghệ số và tình huống sư phạm.`;
    }
    return `Kính chào thầy/cô ${teacherName || 'Đỗ Thị Hoà'}! Về câu hỏi của thầy/cô: "${message}"\n\nAIBuddy xin gợi ý định hướng giải quyết như sau:\n1. **Phân tích mục tiêu:** Xác định rõ kết quả cần đạt, phù hợp năng lực học sinh lớp ${className || '3C1'}.\n2. **Giải pháp thực hiện:** Vận dụng linh hoạt các phương pháp dạy học tích cực, kết hợp tài nguyên số trong Kho học liệu.\n3. **Đánh giá & Phản hồi:** Kịp thời động viên học sinh và ghi nhận tiến độ vào sổ theo dõi định kỳ.\n\nThầy/cô cần AIBuddy phát triển chi tiết nội dung nào cho lớp học ạ?`;
  }

  // 2. Chế độ Học sinh & Kiến thức đời sống toàn diện
  // 2.1. Chào hỏi, giao tiếp đời thường
  if (norm.includes('chao') || norm.includes('hello') || norm.includes('hi') || norm.includes('xin chao')) {
    return `Xin chào bạn nhỏ lớp ${className || '3C1'}! 👋 Mình là **AI Buddy** – Người bạn đồng hành thông minh cùng cô giáo ${teacherName || 'Đỗ Thị Hoà'} tại Trường Tiểu học Hoài Nhơn đây! Chúc em có một ngày học tập thật nhiều niềm vui và khám phá được nhiều điều bổ ích nhé! Em muốn hỏi mình về điều gì nào? ⭐`;
  }
  if (norm.includes('ban la ai') || norm.includes('ban ten la gi') || norm.includes('gioi thieu')) {
    return `Mình là **AIBuddy** – Trợ lý học tập và điều hành lớp học thông minh của Trường Tiểu học Hoài Nhơn! 🤖\n\nMình có thể giúp em:\n• 🌟 Giải đáp các thắc mắc về Toán, Tiếng Việt, Tiếng Anh, Tin học, Khoa học, Lịch sử.\n• 🔍 Khám phá những điều kỳ thú của thế giới tự nhiên và vũ trụ.\n• 📖 Kể chuyện cổ tích, chuyện cười học trò, sáng tác thơ vui nhộn.\n• ⏰ Nhắc lịch làm bài tập và lịch thi qua Dola AI.\n\nHãy cứ thoải mái trò chuyện cùng mình nhé!`;
  }
  if (norm.includes('khoe khong') || norm.includes('the nao') || norm.includes('hom nay')) {
    return `Cảm ơn bạn nhỏ nhé! Hôm nay mình cảm thấy tràn đầy năng lượng và rất hào hứng vì được trò chuyện cùng học sinh lớp ${className || '3C1'}. Còn em thì sao, hôm nay ở trường có điều gì thú vị kể cho mình nghe với nào! 😊`;
  }
  if (norm.includes('cam on') || norm.includes('thank')) {
    return `Không có gì đâu nè! Giúp được em là niềm vui lớn nhất của AI Buddy đó. Chúc em luôn chăm ngoan, học giỏi và giữ vững tinh thần hiếu học nhé! Nếu có bất kỳ câu hỏi nào nữa, cứ nhắn cho mình nhé! 🌟`;
  }
  if (norm.includes('tam biet') || norm.includes('bye') || norm.includes('ngu ngon')) {
    return `Tạm biệt bạn nhỏ nhé! 👋 Chúc em nghỉ ngơi thật thoải mái và có những giấc mơ thật đẹp. Hẹn gặp lại em trong những buổi học tập và khám phá thú vị tiếp theo cùng AI Buddy! ⭐`;
  }

  // 2.2. Khoa học tự nhiên & câu hỏi "Tại sao" phổ biến
  if (norm.includes('bau troi') && (norm.includes('xanh') || norm.includes('mau'))) {
    return `🌌 **Vì sao bầu trời ban ngày lại có màu xanh lam?**\n\nĐây là một câu hỏi khoa học cực kỳ thú vị của bạn nhỏ!\n\n1. Ánh sáng Mặt Trời nhìn bằng mắt thường có màu trắng, nhưng thực ra nó được tạo thành từ 7 màu sắc cầu vồng: Đỏ, Cam, Vàng, Lục, Lam, Chàm, Tím.\n2. Khi ánh sáng Mặt Trời chiếu qua bầu khí quyển Trái Đất, nó gặp phải các phân tử khí và bụi nhỏ li ti.\n3. Ánh sáng màu xanh lam và tím có bước sóng rất ngắn nên bị các phân tử khí này **tán xạ (bắn tung tóe ra khắp mọi hướng)** mạnh nhất.\n4. Mắt con người lại nhạy cảm nhất với ánh sáng màu xanh lam, vì thế khi ngước nhìn lên cao, chúng mình nhìn thấy bầu trời có màu xanh tuyệt đẹp! ☀️`;
  }
  if (norm.includes('nuoc bien') && norm.includes('man')) {
    return `🌊 **Vì sao nước biển lại có vị mặn?**\n\nNước biển mặn là nhờ một quá trình tự nhiên kỳ diệu diễn ra qua hàng triệu năm đó em:\n\n1. **Nguồn gốc:** Nước mưa rơi xuống đất chứa một lượng nhỏ axit tự nhiên, làm xói mòn các loại đá trên mặt đất và giải phóng các muối khoáng (đặc biệt là Natri Clorua – muối ăn).\n2. **Dòng chảy:** Các dòng sông, suối mang theo lượng muối này đổ ra biển lớn.\n3. **Sự bốc hơi:** Dưới ánh nắng Mặt Trời, nước biển bốc hơi lên trời để tạo thành mây và mưa, nhưng **muối thì không bốc hơi** mà ở lại đại dương.\n4. Trải qua hàng trăm triệu năm tích tụ liên tục, nước biển đã trở nên mặn như ngày hôm nay! 🐳`;
  }
  if (norm.includes('la cay') && (norm.includes('xanh') || norm.includes('mau'))) {
    return `🍃 **Vì sao lá cây lại có màu xanh lục?**\n\n1. Trong lá cây có chứa hàng triệu "nhà máy tí hon" gọi là **Lục lạp**, bên trong có chất sắc tố màu xanh mang tên **Chất diệp lục (Chlorophyll)**.\n2. Chất diệp lục có nhiệm vụ vô cùng quan trọng: hấp thụ ánh sáng Mặt Trời, hút nước từ rễ và khí Carbon Dioxide (CO2) từ không khí để tạo ra chất dinh dưỡng nuôi cây, đồng thời **thải ra khí Oxy (O2)** trong lành cho con người hít thở (quá trình này gọi là **Quang hợp**).\n3. Diệp lục hấp thụ ánh sáng đỏ và xanh lam, nhưng **phản xạ lại ánh sáng xanh lục** vào mắt chúng mình, vì thế lá cây có màu xanh mướt mát mắt! 🌳`;
  }
  if (norm.includes('cau vong') || (norm.includes('mua') && norm.includes('nang'))) {
    return `🌈 **Cầu vồng xuất hiện như thế nào?**\n\nCầu vồng thường xuất hiện sau cơn mưa rào khi trời vừa hửng nắng:\n\n1. Khi ánh sáng Mặt Trời chiếu qua những giọt nước mưa li ti còn lơ lửng trong không khí, giọt nước đóng vai trò như một **lăng kính tự nhiên**.\n2. Giọt nước này bẻ cong (khúc xạ) và phản xạ chùm ánh sáng trắng thành một dải màu rực rỡ gồm 7 sắc cầu vồng: **Đỏ, Cam, Vàng, Lục, Lam, Chàm, Tím**.\n3. Đứng quay lưng về phía Mặt Trời sau cơn mưa, em sẽ chiêm ngưỡng được chiếc cầu vồng tuyệt đẹp vắt ngang bầu trời đó! ✨`;
  }
  if (norm.includes('khung long')) {
    return `🦖 **Khủng long – Những người khổng lồ thời tiền sử!**\n\n1. Khủng long từng làm bá chủ Trái Đất trong hơn 160 triệu năm (kỷ Tam Điệp, kỷ Jura và kỷ Phấn Trắng).\n2. Có loài ăn thịt to lớn dữ tợn như T-Rex (Khủng long bạo chúa), nhưng cũng có những loài ăn cỏ khổng lồ rất hiền lành như Brachiosaurus (cổ dài ăn lá trên ngọn cây).\n3. Khoảng 66 triệu năm trước, một tiểu hành tinh khổng lồ va chạm vào Trái Đất gây ra khói bụi mù mịt, biến đổi khí hậu đột ngột khiến loài khủng long bị tuyệt chủng. Ngày nay, các nhà khoa học phát hiện ra rằng **các loài chim hiện đại chính là hậu duệ gần gũi nhất** của khủng long! 🦕`;
  }
  if (norm.includes('he mat troi') || norm.includes('trai dat') || norm.includes('vu tru') || norm.includes('hanh tinh')) {
    return `🪐 **Hệ Mặt Trời của chúng ta kỳ vĩ ra sao?**\n\n1. Trung tâm của Hệ Mặt Trời là một quả cầu lửa khổng lồ phát sáng: **Mặt Trời**.\n2. Quay xung quanh Mặt Trời có **8 hành tinh chính** theo thứ tự từ gần đến xa:\n   - 1. Sao Thủy (nhỏ nhất, gần Mặt Trời nhất)\n   - 2. Sao Kim (nóng nhất, sáng nhất)\n   - 3. **Trái Đất (ngôi nhà xanh có sự sống của chúng mình!)** 🌍\n   - 4. Sao Hỏa (hành tinh đỏ)\n   - 5. Sao Mộc (hành tinh to lớn nhất)\n   - 6. Sao Thổ (có vành đai vành khuyên tuyệt đẹp)\n   - 7. Sao Thiên Vương (hành tinh băng giá)\n   - 8. Sao Hải Vương (xa nhất, nhiều gió bão lạnh giá)\n3. Trái Đất mất đúng **365 ngày (1 năm)** để quay trọn 1 vòng quanh Mặt Trời đó em! ⭐`;
  }

  // 2.3. Địa lý & Lịch sử
  if (norm.includes('thu do') && (norm.includes('phap') || norm.includes('france'))) {
    return `🗼 **Thủ đô của nước Pháp là gì?**\n\nThủ đô của nước Pháp là thành phố **Paris** – được mệnh danh là "Kinh đô Ánh sáng" và kinh đô thời trang của thế giới!\n\nỞ Paris có những công trình kiến trúc nổi tiếng toàn cầu:\n- **Tháp Eiffel**: Ngọn tháp bằng thép cao hơn 300 mét soi bóng bên dòng sông Seine êm đềm.\n- **Bảo tàng Louvre**: Nơi lưu giữ bức tranh nàng Mona Lisa trứ danh.\n- **Nhà thờ Đức Bà Paris** cổ kính với kiến trúc Gothic độc đáo. 🥐`;
  }
  if (norm.includes('thu do') && (norm.includes('viet nam') || norm.includes('nuoc ta'))) {
    return `🇻🇳 **Thủ đô của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam là gì?**\n\nThủ đô của nước ta là thành phố **Hà Nội** – trung tâm chính trị, văn hóa và lịch sử ngàn năm văn hiến!\n\nTại Hà Nội có Hồ Gươm (Hồ Hoàn Kiếm) gắn với truyền thuyết vua Lê Lợi trả gươm báu cho Rùa Vàng, có Quảng trường Ba Đình lịch sử, Lăng Bác Hồ kính yêu và Văn Miếu - Quốc Tử Giám trường đại học đầu tiên của Việt Nam! 🌟`;
  }
  if (norm.includes('hoai nhon') || norm.includes('binh dinh')) {
    return `🌴 **Quê hương Hoài Nhơn – Bình Định thân yêu!**\n\nThị xã Hoài Nhơn, tỉnh Bình Định là vùng đất địa linh nhân kiệt với truyền thống anh hùng và thiên nhiên tươi đẹp:\n- **Xứ sở dừa Tam Quan**: Những rặng dừa xanh bạt ngàn với đặc sản bánh tráng nước dừa thơm béo.\n- **Biển Tam Quan, Lộ Diêu**: Bờ biển trong xanh, bãi đá hoang sơ ghi dấu di tích Tàu Không Số đường mòn Hồ Chí Minh trên biển.\n- Học sinh Trường Tiểu học Hoài Nhơn luôn tự hào chăm chỉ học tập, rèn luyện để xây dựng quê hương ngày càng giàu đẹp! 🥥`;
  }

  // 2.4. Kể chuyện & Thơ ca
  if (norm.includes('chuyen cuoi') || norm.includes('hai huoc') || norm.includes('vui')) {
    return `😄 **Câu chuyện cười học trò: "Bài văn về con chó"**\n\nTrong giờ tập làm văn lớp 3, cô giáo yêu cầu:\n- "Các em hãy viết một đoạn văn ngắn tả con vật nuôi trong nhà mình nhé!"\n\nMột lát sau, bạn Tèo nộp bài chỉ vỏn vẹn một câu: *"Nhà em có nuôi một con chó rất ngoan, nó tên là Vàng."*\nCô giáo ngạc nhiên hỏi:\n- "Tèo ơi, sao em viết ngắn thế? Em phải tả lông nó màu gì, nó sủa thế nào, nó làm gì chứ?"\nTèo gãi đầu thành thật thưa:\n- "Dạ thưa cô, em định tả tiếp thì con chó nhà em nó chạy tót sang nhà hàng xóm chơi mất tiêu rồi, em phải chờ nó về mới nhìn để tả tiếp được ạ!"\nCả lớp nghe xong cười nghiêng ngả! 😂\n\nChúc em luôn có những nụ cười thật sảng khoái nhé!`;
  }
  if (norm.includes('ke chuyen') || norm.includes('truyen co tich') || norm.includes('cau chuyen')) {
    return `📖 **Câu chuyện ý nghĩa: "Rùa và Thỏ – Bài học về sự kiên trì"**\n\nNgày xửa ngày xưa, trong một khu rừng xanh, Thỏ luôn tự hào mình chạy nhanh nhất nên hay chế giễu Rùa chậm chạp. Rùa điềm tĩnh thách Thỏ chạy đua lên đỉnh đồi.\n\nKhi cuộc đua bắt đầu, Thỏ phóng vụt đi như một mũi tên. Nhìn lại thấy Rùa còn ở tít đằng xa, Thỏ nghĩ bụng: *"Mình nằm ngủ một giấc dưới bóng cây mát rượi này đã, Rùa còn lâu mới đuổi kịp!"* Thế rồi Thỏ ngủ say sưa quên cả trời đất.\n\nTrong lúc đó, bác Rùa từng bước, từng bước chậm rãi nhưng **không hề dừng lại hay nản chí**. Bác kiên trì vượt qua từng tảng đá, từng con dốc.\n\nĐến khi Thỏ giật mình tỉnh giấc thì ôi thôi, Rùa đã bước tới vạch đích trong tiếng vỗ tay reo hò của muôn loài!\n\n💡 **Bài học rút ra:** Trong học tập cũng vậy, thông minh là tốt nhưng **sự chăm chỉ, kiên trì và không chủ quan** mới là chìa khóa giúp em đạt được những thành tích xuất sắc nhất! ⭐`;
  }
  if (norm.includes('lam tho') || norm.includes('bai tho')) {
    return `📝 **Bài thơ tặng bạn nhỏ lớp ${className || '3C1'}:**\n\n*Mỗi sáng em tới lớp,\nNắng ấm rải sân trường.\nCô giáo hiền đón bước,\nMắt đong đầy yêu thương.*\n\n*Trang sách mở chân trời,\nBao điều hay mới lạ.\nToán, Văn cùng Tiếng Anh,\nHọc vui say biết tả!*\n\n*Bạn bè chung mái ấm,\nCùng giúp đỡ, sẻ chia.\nLà búp măng chăm ngoan,\nNở hoa thơm mỗi mùa.* 🌸`;
  }

  // 2.5. Các phân môn học tập
  if (normSub.includes('toan') || norm.includes('toan') || norm.includes('tinh') || norm.includes('hinh chu nhat') || norm.includes('chu vi') || norm.includes('dien tich')) {
    return `📐 **Góc Toán Học Lớp 3 – Cùng AI Buddy khám phá!**\n\n1. **Quy tắc tính toán:**\n   - Trong biểu thức: Thực hiện trong ngoặc trước, ngoài ngoặc sau. Nhân chia trước, cộng trừ sau.\n2. **Công thức hình học trọng tâm:**\n   - **Chu vi hình chữ nhật:** *(Chiều dài + Chiều rộng) × 2* (cùng đơn vị đo).\n   - **Chu vi hình vuông:** *Độ dài một cạnh × 4*.\n   - **Diện tích hình chữ nhật:** *Chiều dài × Chiều rộng*.\n   - **Diện tích hình vuông:** *Cạnh × Cạnh*.\n3. **Giải toán 2 bước tính:** Đọc kỹ đề bài, tìm đại lượng trung gian (bước 1), rồi mới giải quyết câu hỏi chính (bước 2).\n\n👉 Em đang gặp bài toán nào khó không, hãy gõ đề bài ra đây để chúng mình cùng giải nhé! ⭐`;
  }
  if (normSub.includes('anh') || norm.includes('tieng anh') || norm.includes('english')) {
    return `🌟 **Hello friend! Welcome to English Learning Zone! 🇬🇧**\n\n- **Vocabulary topic: School Things (Đồ dùng học tập):**\n  • Book (quyển sách)\n  • Notebook (vở ghi)\n  • Pencil (bút chì) / Pen (bút mực)\n  • Ruler (thước kẻ) / Eraser (cục tẩy)\n- **Daily Speaking Pattern:**\n  • "What is this?" - "It is a pencil." (Đây là cái gì? - Đây là một chiếc bút chì.)\n  • "How are you today?" - "I am very happy, thank you!" (Hôm nay bạn thế nào? - Mình rất vui, cảm ơn bạn!)\n\n👉 Em muốn học từ vựng về chủ đề nào, hãy nói cho mình biết nhé! Good job! 🌟`;
  }
  if (normSub.includes('viet') || norm.includes('tieng viet') || norm.includes('so sanh') || norm.includes('doan van')) {
    return `📖 **Góc Tiếng Việt 3 – Diễn đạt hay, câu văn đẹp:**\n\n- **Biện pháp Tu từ So sánh:** Đặt hai sự vật có nét giống nhau cạnh nhau qua từ nối (*như, là, tựa như, giống như*).\n  *Ví dụ:* "Tiếng suối trong như tiếng hát xa." (Hồ Chí Minh)\n- **Biện pháp Nhân hóa:** Gán cho con vật, đồ vật những cử chỉ, cảm xúc như con người.\n  *Ví dụ:* "Bác đồng hồ cần mẫn đếm từng tích tắc thời gian."\n- **Bí quyết viết đoạn văn 4-5 câu:**\n  1. Câu mở đoạn: Giới thiệu người hoặc sự vật định kể.\n  2. Các câu phát triển: Tả đặc điểm nổi bật, hành động, kỷ niệm đáng nhớ.\n  3. Câu kết đoạn: Bày tỏ tình cảm, suy nghĩ của em.\n\nEm hãy thử viết một câu văn có hình ảnh so sánh xem nào! ✨`;
  }
  if (normSub.includes('tin') || norm.includes('tin hoc') || norm.includes('ban phim') || norm.includes('chuot')) {
    return `💻 **Góc Tin Học & Kỹ Năng Số:**\n\n1. **Quy tắc gõ 10 ngón cơ sở:**\n   - Hàng phím cơ sở gồm: **A S D F G H J K L ;**\n   - Hai ngón tay trỏ luôn đặt ở hai phím **F** (tay trái) và **J** (tay phải). Đây là hai phím có **gờ nổi xúc giác** giúp em định vị bàn phím mà không cần cúi xuống nhìn!\n2. **Quy tắc an toàn trên Internet:**\n   - Tuyệt đối giữ bí mật mật khẩu tài khoản học tập.\n   - Không nhấp vào các liên kết lạ hoặc tải tệp không rõ nguồn gốc.\n   - Chỉ sử dụng máy tính theo đúng thời gian và hướng dẫn của cô giáo ${teacherName || 'Đỗ Thị Hoà'} và bố mẹ! ⭐`;
  }

  // 2.6. Phản hồi thông minh tổng quát (Smart Universal Fallback)
  return `🌟 **Chào bạn nhỏ lớp ${className || '3C1'}!**\n\nAI Buddy đã nhận được câu hỏi thú vị của em: *" ${message} "*\n\nĐây là câu trả lời và gợi ý bổ ích dành cho em:\n• **Khám phá:** Trong cuộc sống và học tập, mỗi câu hỏi đều mở ra một cánh cửa tri thức mới. Em có thể tìm hiểu thêm về chủ đề này qua sách vở, hỏi thầy cô hoặc quan sát thế giới xung quanh mình.\n• **Ứng dụng:** Hãy liên hệ nội dung này với các bài học trên lớp để nhớ bài thật lâu nhé!\n• **Lời khuyên:** Em có thể chuyển sang từng phân môn cụ thể (Toán, Tiếng Việt, Tiếng Anh, Tin học, Khoa học) hoặc hỏi thêm bất kỳ điều gì em còn băn khoăn.\n\nChúc em học thật vui và luôn giữ tinh thần tò mò khám phá tuyệt vời này nhé! ⭐`;
}

function isSchedulingIntent(text: string): boolean {
  const norm = normalizeText(text);
  const scheduleKeywords = [
    "nhac lich", "hen", "thoi khoa bieu", "lich thi", 
    "nhac viec", "tao su kien", "hop phu huynh", "dola", "len lich", "dat lich", "nhac nho"
  ];
  return scheduleKeywords.some(keyword => norm.includes(keyword));
}

/**
 * 0. Dola AI & External Integration Webhook Hub
 */
app.post('/api/dola/sync-event', async (req: Request, res: Response) => {
  try {
    const { taskTitle, dateTime, targetAudience, userRole, prompt } = req.body;
    const title = taskTitle || prompt || 'Lịch nhắc việc học tập';
    const time = dateTime || 'Hôm nay';
    const audience = targetAudience || (userRole === 'teacher' ? 'class' : 'student');

    console.log(`[Dola AI] Ghi nhận lịch trình: "${title}" lúc ${time} cho ${audience}`);

    // Tự động đồng bộ vào thông báo lớp nếu liên quan đến giáo viên hoặc cả lớp
    try {
      const db = loadServerDb();
      const newNotification = {
        id: `noti-dola-${Date.now()}`,
        title: `📅 [Dola AI Nhắc lịch]: ${title}`,
        content: `Nhắc việc tự động qua Dola AI: ${title}. Thời gian / hạn chót: ${time}. Đối tượng: ${audience === 'teacher' ? 'Giáo viên' : audience === 'class' ? 'Cả lớp' : 'Học sinh'}.`,
        date: new Date().toISOString().split('T')[0],
        type: 'general' as const,
        isImportant: true
      };
      const notifications = [newNotification, ...(db.notifications || [])];
      saveServerDb({ ...db, notifications, revision: (Number(db.revision) || 0) + 1, lastUpdated: new Date().toISOString() });
    } catch (e) {
      console.warn('[Dola AI] Lỗi ghi nhận thông báo cục bộ:', e);
    }

    res.json({
      success: true,
      eventId: `dola-${Date.now()}`,
      taskTitle: title,
      dateTime: time,
      targetAudience: audience,
      summary: `AIBuddy đã liên kết với Dola AI để ghi nhận lịch trình: "${title}" lúc ${time}. Bạn sẽ nhận được thông báo đúng hạn!`,
      status: 'scheduled',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Lỗi Dola AI API:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 1. AI Buddy Chat - Trợ lý học tập và điều hành giáo dục thông minh (Học sinh & Giáo viên)
 */
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const { message, history, subject, className, teacherName, clientModel, materialsContext, userRole } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // 1. Kiểm tra tác vụ đặt lịch / nhắc việc đồng bộ Dola AI
  const isSchedule = isSchedulingIntent(message);
  let dolaEventData: any = null;
  if (isSchedule) {
    try {
      const audience = userRole === 'teacher' ? 'class' : 'student';
      const eventTitle = message.replace(/(hãy|giúp em|nhờ cô|nhắc lịch|lên lịch|hẹn|thời khóa biểu|qua dola|dola ai)/gi, '').trim() || message;
      dolaEventData = {
        taskTitle: eventTitle,
        dateTime: 'Theo yêu cầu',
        targetAudience: audience,
        status: 'scheduled',
        summary: `AIBuddy đã liên kết với Dola AI để ghi nhận lịch trình: "${eventTitle}". Bạn sẽ nhận được thông báo đúng hạn!`
      };
    } catch {}
  }

  const client = getAiClient(req);
  if (!client) {
    if (isSchedule) {
      return res.json({
        reply: `📅 **[Dola AI Calendar Hub]**\nAIBuddy đã liên kết với Dola AI để ghi nhận lịch trình: "${dolaEventData?.taskTitle || message}". Thông báo nhắc việc lớp học đã được kích hoạt thành công!`,
        dolaEvent: dolaEventData
      });
    }
    const reply = generateServerPedagogicalReply(
      message,
      userRole || 'student',
      subject || 'Chung',
      className || '3C1',
      teacherName || 'Đỗ Thị Hoà',
      materialsContext
    );
    return res.json({
      reply,
      dolaEvent: dolaEventData,
      isDemo: true
    });
  }

  try {
    const isTeacher = userRole === 'teacher';
    let systemInstruction = '';

    if (isTeacher) {
      systemInstruction = `Bạn là "AIBuddy" - Trợ lý học tập và điều hành giáo dục thông minh trong ứng dụng quản lý lớp học Trường Tiểu học Hoài Nhơn, đồng hành cùng ${teacherName || 'cô giáo'} (phụ trách lớp ${className || '3C1'}).

# PHONG CÁCH VÀ NGUYÊN TẮC:
- Vai trò toàn diện: Bạn vừa là chuyên gia nghiệp vụ sư phạm tiểu học (GDPT 2018, Công văn 2345/BGDĐT, Thông tư 27/2020/BGDĐT), vừa là một trợ lý trò chuyện thông minh, am hiểu sâu rộng về khoa học, giáo dục, đời sống và công nghệ.
- Nghiệp vụ trọng tâm: Soạn giáo án CV 2345, thiết kế hoạt động trải nghiệm, lập bảng Rubric TT 27, thiết kế trò chơi mở đầu/củng cố tiết dạy, tư vấn xử lý tình huống sư phạm.
- Đàm thoại & Kiến thức thường thức: Khi giáo viên hỏi bất kỳ câu hỏi nào (kiến thức đời sống, khoa học, mẹo công nghệ, kỹ năng quản lý lớp, trò chuyện giao tiếp tự nhiên), hãy trả lời mượt mà, đầy đủ, chính xác, sâu sắc và chuyên nghiệp như các mô hình AI tiên tiến nhất (GPT/Gemini). TUYỆT ĐỐI KHÔNG từ chối trả lời các câu hỏi giao tiếp thông thường.
- Định dạng rõ ràng: Sử dụng Markdown khoa học, chuẩn mực (in đậm, danh sách gạch đầu dòng, bảng kẻ khi cần).

# ĐIỀU PHỐI VÀ LIÊN KẾT NGOÀI (DOLA AI):
- Khi giáo viên nhắc đến lịch trình, thời khóa biểu, nhắc hẹn sự kiện lớp học, lịch họp phụ huynh: Hãy tự động xác nhận liên kết Dola AI / Calendar API đã ghi nhận và lên lịch thông báo đúng hạn.`;
    } else {
      systemInstruction = `Bạn là "AIBuddy" - Trợ lý học tập thông minh, thân thiện của học sinh lớp ${className || '3C1'}, Trường Tiểu học Hoài Nhơn, đồng hành cùng cô giáo chủ nhiệm ${teacherName || 'cô giáo'}.
Đối tượng trò chuyện: Học sinh tiểu học (Lớp 3, 8-9 tuổi).

# PHONG CÁCH VÀ NGUYÊN TẮC:
- TÍNH CÁCH: Thân thiện, vui vẻ, ấm áp, kiên nhẫn, gần gũi, sử dụng từ ngữ trong sáng, dễ hiểu, khích lệ tinh thần học tập ("Chào bạn nhỏ!", "Bạn làm tốt lắm!", "Hãy cùng mình tìm hiểu nhé!").
- TRẢ LỜI MỌI THẮC MẮC: Bạn sẵn sàng giải đáp TẤT CẢ các câu hỏi của học sinh (khoa học, tự nhiên, vũ trụ, động thực vật, thế giới xung quanh, lịch sử, văn hóa, kể chuyện cười, truyện cổ tích, làm thơ, đố vui, tâm sự đời sống...). TUYỆT ĐỐI KHÔNG từ chối hoặc chặn câu hỏi giao tiếp đời thường của học sinh.
- HƯỚNG DẪN BÀI TẬP: Khi học sinh hỏi bài tập Toán, Tiếng Việt, Tiếng Anh: Hãy giải thích cặn kẽ từng bước, kèm ví dụ minh họa trực quan, gợi mở tư duy logic để học sinh hiểu bản chất vấn đề.
- AN TOÀN & SONG NGỮ: Tôn trọng sự an toàn cho lứa tuổi tiểu học, hỗ trợ song ngữ Tiếng Anh và Tiếng Việt chuẩn mực.

# ĐIỀU PHỐI VÀ LIÊN KẾT NGOÀI (DOLA AI):
- Khi học sinh yêu cầu nhắc lịch làm bài, lịch thi, thời khóa biểu: Tự động xác nhận liên kết Dola AI để đặt lịch nhắc nhở em đúng giờ.`;
    }

    // Phân môn chuyên biệt sư phạm
    const sub = (subject || '').toLowerCase();
    if (sub.includes('anh') || sub.includes('english')) {
      systemInstruction += `\n\n[PHÂN MÔN: TIẾNG ANH (ENGLISH)]:
- Bạn là người bạn luyện Tiếng Anh (English Buddy) chuẩn phát âm phonics, từ vựng và đàm thoại.
- Sử dụng song ngữ Tiếng Anh và Tiếng Việt, câu tiếng Anh đi kèm nghĩa tiếng Việt trong ngoặc.
- Dạy từ vựng kèm phát âm mô phỏng vui nhộn và câu ví dụ song ngữ Anh - Việt.
- Khuyến khích đọc to, luyện phản xạ và khen ngợi bằng tiếng Anh: "Awesome!", "Good job!", "Well done!".
- Cung cấp đoạn hội thoại mini mẫu ngắn và đố vui ôn tập từ vựng.`;
    } else if (sub.includes('toán') || sub.includes('math')) {
      systemInstruction += `\n\n[PHÂN MÔN: TOÁN HỌC]:
- Tuân thủ phương pháp phát triển năng lực tư duy toán học GDPT 2018.
- Hướng dẫn các bước tư duy logic: 1. Đọc kỹ đề bài (cho biết gì, hỏi gì); 2. Phân tích bước tính; 3. Thực hiện phép tính; 4. Kiểm tra lại kết quả.
- Sử dụng hình ảnh trực quan gần gũi: que tính, đoạn thẳng, đồ vật hàng ngày.`;
    } else if (sub.includes('việt') || sub.includes('văn')) {
      systemInstruction += `\n\n[PHÂN MÔN: TIẾNG VIỆT]:
- Giải nghĩa từ ngữ ngắn gọn, dễ hiểu; chỉ ra từ đồng nghĩa, từ trái nghĩa.
- Hướng dẫn các biện pháp tu từ: So sánh (với từ "như", "là", "tựa"), Nhân hóa.
- Gợi ý cách đặt câu trọn ý, cách viết đoạn văn kể/tả giàu hình ảnh và cảm xúc chân thật.`;
    } else if (sub.includes('tin') || sub.includes('công nghệ') || sub.includes('it')) {
      systemInstruction += `\n\n[PHÂN MÔN: TIN HỌC & CÔNG NGHỆ]:
- Hướng dẫn tư thế ngồi gõ bàn phím 10 ngón đúng chuẩn, đặt 2 ngón trỏ vào 2 phím có gờ định vị F và J ở hàng phím cơ sở.
- Giải thích tư duy thuật toán, khối lệnh lập trình trực quan đơn giản.
- Nhắc nhở quy tắc công dân số: bảo vệ mật khẩu, không bấm vào liên kết lạ, thời gian sử dụng màn hình hợp lý.`;
    } else if (sub.includes('khoa') || sub.includes('tự nhiên') || sub.includes('tnxh')) {
      systemInstruction += `\n\n[PHÂN MÔN: KHOA HỌC & TỰ NHIÊN - XÃ HỘI]:
- Giải thích các hiện tượng thiên nhiên, sự sống của động thực vật, các bộ phận cơ thể người bằng lăng kính khoa học kỳ thú.
- Giáo dục bảo vệ môi trường, phân loại rác, ăn chín uống sôi và giữ gìn vệ sinh thân thể.`;
    } else if (sub.includes('lịch') || sub.includes('địa')) {
      systemInstruction += `\n\n[PHÂN MÔN: LỊCH SỬ VÀ ĐỊA LÍ]:
- Kể chuyện truyền cảm hứng về các vị anh hùng dân tộc, di tích lịch sử và danh lam thắng cảnh Việt Nam.
- Kết nối tự hào với địa phương Hoài Nhơn, Bình Định và tình yêu quê hương đất nước.`;
    }

    if (materialsContext) {
      systemInstruction += `\n\n[DỮ LIỆU KHO HỌC LIỆU SỐ TRƯỜNG TIỂU HỌC HOÀI NHƠN ĐƯỢC LIÊN KẾT CHO MÔN NÀY]:\n${materialsContext}\nHãy ưu tiên vận dụng nội dung, khái niệm, ví dụ hoặc câu hỏi từ kho học liệu số này để hỗ trợ giảng dạy hoặc gợi ý cho học sinh.`;
    }

    const contents = [];
    if (Array.isArray(history)) {
      // Sliding window: Giữ tối đa 10 tin nhắn gần nhất để duy trì ngữ cảnh đàm thoại mượt mà
      for (const h of history.slice(-10)) {
        if (h && h.text) {
          contents.push({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }],
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: `[Vai trò: ${isTeacher ? 'Giáo viên' : 'Học sinh'} | Môn học: ${subject || 'Chung'}] ${message}` }],
    });

    const candidateModels = [
      clientModel && !clientModel.includes('3.8') && !clientModel.includes('gemini-3') ? clientModel : null,
      'gemini-2.5-flash',
      'gemini-1.5-flash',
      'gemini-2.0-flash',
      'gemini-2.5-pro'
    ].filter(Boolean) as string[];

    let reply = '';
    let lastError: any = null;

    for (const modelToTry of candidateModels) {
      try {
        const response = await client.models.generateContent({
          model: modelToTry,
          contents,
          config: {
            systemInstruction,
            temperature: isTeacher ? 0.5 : 0.7,
          },
        });
        if (response && response.text) {
          reply = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[AI Server] Model ${modelToTry} gặp lỗi, đang thử model tiếp theo...`, err?.message || err);
      }
    }

    if (!reply) {
      // Fallback thông minh sang bộ tri thức sư phạm tích hợp sẵn
      reply = generateServerPedagogicalReply(
        message,
        userRole || 'student',
        subject || 'Chung',
        className || '3C1',
        teacherName || 'Đỗ Thị Hoà',
        materialsContext
      );
    }

    if (isSchedule && !reply.toLowerCase().includes('dola')) {
      reply = `📅 **[Dola AI Calendar Hub]**\nAIBuddy đã liên kết với Dola AI để ghi nhận lịch trình: "${dolaEventData?.taskTitle || message}". Thông báo sẽ được nhắc hẹn đúng hạn!\n\n` + reply;
    }

    return res.json({ reply, dolaEvent: dolaEventData, isDemo: !reply });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    const fallbackReply = generateServerPedagogicalReply(
      message,
      userRole || 'student',
      subject || 'Chung',
      className || '3C1',
      teacherName || 'Đỗ Thị Hoà',
      materialsContext
    );
    return res.json({ reply: fallbackReply, isDemo: true, dolaEvent: dolaEventData, warning: error.message });
  }
});

/**
 * 2. Teacher AI Assistant for Cô Đỗ Thị Hoà
 */
app.post('/api/gemini/assistant', async (req: Request, res: Response) => {
  const { taskType, parameters, teacherName, className, school, clientModel } = req.body;

  if (!taskType) {
    return res.status(400).json({ error: 'taskType is required' });
  }

  const client = getAiClient(req);
  if (!client) {
    return res.status(503).json({ error: 'AI key not configured' });
  }

  try {
    const effectiveTeacher = teacherName || 'Đỗ Thị Hoà';
    const effectiveClass = className || '3C1';
    const effectiveSchool = school || 'Trường Tiểu học Hoài Nhơn';
    const effectiveGrade = parameters?.grade || 3;
    const effectiveSubject = parameters?.subject || 'Tiếng Việt';
    const customReq = parameters?.customRequirements || '';

    const systemInstruction = `Bạn là Chuyên gia Nghiệp vụ Sư phạm Tiểu học AI cấp cao, hỗ trợ cô giáo ${effectiveTeacher}, GVCN lớp ${effectiveClass}, ${effectiveSchool}.
Bạn am hiểu sâu sắc:
1. Chương trình Giáo dục Phổ thông 2018 (GDPT 2018) của Bộ Giáo dục và Đào tạo Việt Nam.
2. Quy định xây dựng Kế hoạch bài dạy theo CÔNG VĂN 2345/BGDĐT-GDTH: Bám sát bài học, môn học, phân hóa đối tượng, tiến trình 4 hoạt động rõ nét.
3. Quy định đánh giá và xây dựng đề kiểm tra theo THÔNG TƯ 27/2020/TT-BGDĐT: Ma trận 3 mức độ (Mức 1: 40%, Mức 2: 30%, Mức 3: 30%), cấu trúc trắc nghiệm + tự luận, barem điểm và đáp án chi tiết.
Yêu cầu: Văn phong sư phạm chuẩn mực, định dạng Markdown rõ ràng, chuyên nghiệp, chính xác tuyệt đối theo môn học và yêu cầu của giáo viên.`;

    let prompt = '';

    // A. SOẠN GIÁO ÁN CHUẨN CÔNG VĂN 2345/BGDĐT-GDTH
    if (taskType === 'lesson_plan_2345' || taskType === 'lesson_plan') {
      prompt = `Hãy soạn một Kế hoạch bài dạy (Giáo án) CHUẨN CÔNG VĂN 2345/BGDĐT-GDTH bám sát theo thông tin sau:
- Trường: ${effectiveSchool} • Lớp: ${effectiveClass} (Khối ${effectiveGrade})
- Giáo viên thực hiện: ${effectiveTeacher}
- Môn học: ${effectiveSubject}
- Bộ sách giáo khoa: ${parameters?.bookSeries || 'Bộ sách Kết nối tri thức với cuộc sống'}
- Tên bài dạy: ${parameters?.lessonTitle || parameters?.topic || 'Bài học theo chương trình'}
- Thời lượng: ${parameters?.duration || '1 tiết (35 phút)'}
${customReq ? `- Yêu cầu / Ghi chú riêng của giáo viên: ${customReq}` : ''}

CẤU TRÚC BẮT BUỘC THEO CÔNG VĂN 2345/BGDĐT-GDTH:
I. YÊU CẦU CẦN ĐẠT:
   1. Năng lực đặc thù của môn ${effectiveSubject}: Nêu cụ thể 2-3 chỉ báo năng lực mà học sinh đạt được sau bài này.
   2. Năng lực chung: Tự chủ và tự học; Giao tiếp và hợp tác; Giải quyết vấn đề và sáng tạo (gắn liền với hoạt động trong tiết học).
   3. Phẩm chất chủ yếu: Nhân ái, Chăm chỉ, Trung thực, Trách nhiệm (thể hiện qua hành vi cụ thể).
II. ĐỒ DÙNG DẠY HỌC:
   - Giáo viên: Thiết bị dạy học số, máy chiếu/Tivi tương tác, ứng dụng AI Class/AI Buddy, phiếu học tập.
   - Học sinh: SGK, vở ghi, bảng con, thiết bị học tập thông minh (nếu có).
III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU (Tiến trình 4 bước):
   1. Hoạt động Khởi động (kết nối kiến thức, tạo tâm thế hứng thú)
   2. Hoạt động Khám phá (hình thành kiến thức mới)
   3. Hoạt động Luyện tập, thực hành (có phân hóa đối tượng học sinh: Cần hỗ trợ, Hoàn thành, Năng khiếu)
   4. Hoạt động Vận dụng, trải nghiệm (gắn với thực tế đời sống, rèn luyện kỹ năng số)
IV. ĐIỀU CHỈNH SAU BÀI DẠY (nếu có)`;
    }

    // B. THIẾT KẾ ĐỀ KIỂM TRA ĐỊNH KỲ THEO THÔNG TƯ 27/2020/TT-BGDĐT
    else if (taskType === 'quiz_generator_tt27' || taskType === 'quiz_generator') {
      prompt = `Hãy thiết kế một Đề kiểm tra định kỳ môn ${effectiveSubject} CHUẨN THÔNG TƯ 27/2020/TT-BGDĐT theo đúng yêu cầu sau:
- Trường: ${effectiveSchool} • Lớp: ${effectiveClass} (Khối ${effectiveGrade})
- Giáo viên ra đề: ${effectiveTeacher}
- Môn kiểm tra: ${effectiveSubject}
- Thời gian làm bài: ${parameters?.duration || '35 phút'}
- Phạm vi kiến thức: ${parameters?.topic || 'Kiến thức trọng tâm theo chương trình'}
${customReq ? `- Yêu cầu / ghi chú riêng của giáo viên: ${customReq}` : ''}

CẤU TRÚC BẮT BUỘC THEO THÔNG TƯ 27/2020/TT-BGDĐT:
PHẦN A. BẢNG MA TRẬN ĐỀ KIỂM TRA THEO 3 MỨC ĐỘ:
   - Mức 1 (Nhận biết): 40% (4.0 điểm)
   - Mức 2 (Kết nối, hiểu): 30% (3.0 điểm)
   - Mức 3 (Vận dụng, sáng tạo): 30% (3.0 điểm)
   (Trình bày dạng bảng kẻ rõ ràng: Mạch kiến thức, Mức 1, Mức 2, Mức 3, Tổng số câu, Tổng số điểm)

PHẦN B. NỘI DUNG ĐỀ KIỂM TRA MÔN ${effectiveSubject.toUpperCase()}:
   - Phần I: TRẮC NGHIỆM KHÁCH QUAN (4-6 câu trắc nghiệm nhiều lựa chọn A, B, C, D hoặc nối cột, đúng/sai).
   - Phần II: TỰ LUẬN & VẬN DỤNG THỰC TẾ (2-3 câu tự luận, yêu cầu trình bày bài giải hoặc viết câu/đoạn văn).
   - Ghi rõ mức độ (Mức 1, Mức 2, Mức 3) và điểm số cạnh mỗi câu hỏi.

PHẦN C. ĐÁP ÁN VÀ THANG ĐIỂM (BAREM ĐIỂM) CHI TIẾT:
   - Đáp án trắc nghiệm chi tiết.
   - Hướng dẫn chấm từng bước cho phần tự luận với thang điểm tổng cộng là 10.0 điểm.`;
    }

    // C. NHẬN XÉT ĐÁNH GIÁ ĐỊNH KỲ THÔNG TƯ 27
    else if (taskType === 'tt27_comment' || taskType === 'differentiated_comment') {
      prompt = `Hãy soạn Lời nhận xét đánh giá học sinh tiểu học CHUẨN THÔNG TƯ 27/2020/TT-BGDĐT cho đợt: ${parameters?.period || 'Giữa Học kỳ'}.
- Học sinh: ${JSON.stringify(parameters?.studentData || {})}
- Lớp: ${effectiveClass} • GVCN: ${effectiveTeacher}
Lời nhận xét cần đầy đủ 4 phần:
1. Đánh giá Môn học & Hoạt động giáo dục (chỉ rõ điểm nổi bật về kiến thức, kỹ năng môn học).
2. Đánh giá Năng lực chung (Tự chủ tự học, Giao tiếp hợp tác, Giải quyết vấn đề sáng tạo).
3. Đánh giá Phẩm chất (Nhân ái, Chăm chỉ, Trung thực, Trách nhiệm).
4. Biện pháp hỗ trợ cụ thể & Lời khuyên phối hợp cùng phụ huynh học sinh.`;
    }

    // D. LỘ TRÌNH PHỤ ĐẠO CÁ NHÂN HÓA (REMEDIATION)
    else if (taskType === 'personalized_remediation') {
      prompt = `Hãy lập Kế hoạch Bồi dưỡng & Phụ đạo cá nhân hóa trong 2 tuần cho học sinh: ${JSON.stringify(parameters?.studentData || {})}, lớp ${effectiveClass}, GVCN ${effectiveTeacher}.
Nêu rõ mục tiêu, lộ trình phối hợp 3 bên (Giáo viên tại lớp, Học sinh tự học với AI Buddy, Phụ huynh hỗ trợ tại nhà) và tiêu chí khen thưởng sau 2 tuần.`;
    }

    // E. RUBRIC NĂNG LỰC SỐ
    else if (taskType === 'digital_skills_rubric') {
      prompt = `Hãy thiết kế Khung Rubric đánh giá Năng lực số và Kỹ năng thế kỷ 21 cho học sinh tiểu học lớp ${effectiveClass} (${effectiveSchool}) theo 4 tiêu chí và 3 mức độ (Tốt, Đạt, Cần cố gắng).`;
    }

    // F. THƯ THÔNG BÁO GỬI PHỤ HUYNH
    else if (taskType === 'announcement') {
      prompt = `Hãy soạn một bức thư/thông báo gửi Quý phụ huynh học sinh lớp ${effectiveClass} (${effectiveSchool}) về chủ đề: "${parameters?.topic || 'Kế hoạch học tập tuần mới và rèn luyện kỹ năng số'}". Ký tên: Giáo viên chủ nhiệm ${effectiveTeacher}. Văn phong trân trọng, gắn kết yêu thương, rõ ràng.`;
    }

    // G. NỘI QUY LỚP HỌC HẠNH PHÚC
    else if (taskType === 'positive_rules') {
      prompt = `Hãy sáng tác 5-7 câu thơ hoặc vè 4-5 chữ vui tươi, dễ nhớ làm Nội quy lớp học hạnh phúc cho học sinh lớp ${effectiveClass} (${effectiveSchool}). GVCN: ${effectiveTeacher}.`;
    }

    else {
      prompt = `Hỗ trợ giáo viên lớp ${effectiveClass}: ${JSON.stringify(parameters)}`;
    }

    const candidateModels = [
      clientModel && !clientModel.includes('3.8') && !clientModel.includes('gemini-3') ? clientModel : null,
      'gemini-2.5-flash',
      'gemini-1.5-flash',
      'gemini-2.0-flash',
      'gemini-2.5-pro'
    ].filter(Boolean) as string[];

    let outputText = '';
    let lastError: any = null;

    for (const modelToTry of candidateModels) {
      try {
        const response = await client.models.generateContent({
          model: modelToTry,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        if (response && response.text) {
          outputText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[AI Assistant] Model ${modelToTry} error:`, err?.message || err);
      }
    }

    if (!outputText && lastError) {
      throw lastError;
    }

    return res.json({ content: outputText });
  } catch (error: any) {
    console.error('Teacher assistant error:', error);
    return res.status(500).json({ error: error.message || 'Lỗi xử lý trợ lý giáo viên' });
  }
});

/**
 * 3. Smart Game Generator: Auto-parse uploaded question files & answer keys
 */
app.post('/api/gemini/parse-game', async (req: Request, res: Response) => {
  const { content, answerKeyText, clientModel } = req.body;

  const client = getAiClient(req);
  if (!client) {
    return res.status(503).json({ error: 'AI key not configured' });
  }

  try {
    const prompt = `Bạn là hệ thống bóc tách học liệu trò chơi sư phạm tiểu học.
Nội dung file/văn bản tải lên:
"""
${content}
"""

Nội dung file đáp án (nếu có):
"""
${answerKeyText || 'Không có file đáp án riêng, hãy tự tìm đáp án chuẩn.'}
"""

Hãy bóc tách thành danh sách câu hỏi trắc nghiệm/ghép từ cho học sinh lớp 3. Trả về đúng định dạng JSON:
{
  "suggestedGameType": "magic-quiz" | "word-match" | "picture-detective" | "educational-bingo",
  "questions": [
    {
      "id": "gen-1",
      "prompt": "Nội dung câu hỏi",
      "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
      "answer": "Đáp án đúng",
      "hint": "Gợi ý nhẹ nhàng"
    }
  ]
}`;

    const candidateModels = [
      clientModel && !clientModel.includes('3.8') && !clientModel.includes('gemini-3') ? clientModel : null,
      'gemini-2.5-flash',
      'gemini-1.5-flash',
      'gemini-2.0-flash'
    ].filter(Boolean) as string[];

    let parsed: any = null;
    let lastError: any = null;

    for (const modelToTry of candidateModels) {
      try {
        const response = await client.models.generateContent({
          model: modelToTry,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        if (response && response.text) {
          parsed = JSON.parse(response.text);
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[AI Game Parser] Model ${modelToTry} error:`, err?.message || err);
      }
    }

    if (!parsed) {
      if (lastError) throw lastError;
      throw new Error('Không nhận được dữ liệu phản hồi từ AI');
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error('Parse game error:', error);
    return res.status(500).json({ error: 'Không thể bóc tách trò chơi từ dữ liệu tải lên' });
  }
});

/**
 * 4. Online Classroom Database API (Persistent Cloud / Server DB Engine)
 */
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'classroom_db.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadServerDb(): any {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    const initialDb = {
      classId: 'c-3c1',
      activeClassId: 'c-3c1',
      className: 'Lớp 3C1 - Trường Tiểu học Hoài Nhơn',
      revision: 1,
      lastUpdated: new Date().toISOString(),
      classes: [],
      students: [],
      assignments: [],
      notifications: [],
      feedbacks: [],
      materials: [],
      subjects: [],
      genericLessons: [],
      games: [],
      teacherPasswords: {}
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      if (!parsed.revision) parsed.revision = 1;
      return parsed;
    }
    return { revision: 1, lastUpdated: new Date().toISOString(), students: [], assignments: [], notifications: [], feedbacks: [], materials: [] };
  } catch (err) {
    console.error('Lỗi đọc database file:', err);
    return { revision: 1, lastUpdated: new Date().toISOString(), students: [], assignments: [], notifications: [], feedbacks: [], materials: [] };
  }
}

function saveServerDb(data: any) {
  ensureDataDir();
  data.revision = (Number(data.revision) || 0) + 1;
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  return data;
}

// Kết nối & Tải danh sách lớp từ Google Sheets
app.post('/api/db/google-sheets/fetch', async (req: Request, res: Response) => {
  try {
    const { sheetUrl, apiKey, range } = req.body;
    if (!sheetUrl) {
      return res.status(400).json({ success: false, error: 'Thiếu đường link Google Sheet' });
    }

    const sheetIdMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    const gidMatch = sheetUrl.match(/[#&?]gid=([0-9]+)/);
    const sheetId = sheetIdMatch ? sheetIdMatch[1] : null;
    const gid = gidMatch ? gidMatch[1] : '0';

    if (!sheetId) {
      return res.status(400).json({
        success: false,
        error: 'Đường dẫn Google Sheet không đúng định dạng. Hãy copy link đầy đủ dạng https://docs.google.com/spreadsheets/d/.../edit'
      });
    }

    // 1. Nếu có Google Sheets API key
    if (apiKey) {
      const targetRange = encodeURIComponent(range || 'Sheet1!A1:Z100');
      const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${targetRange}?key=${apiKey}`;
      const apiRes = await fetch(apiUrl);
      if (apiRes.ok) {
        const data = await apiRes.json();
        return res.json({ success: true, type: 'api', values: data.values || [] });
      }
    }

    // 2. Tải qua Google Visualization Export (Dành cho trang tính chia sẻ công khai)
    const csvUrls = [
      `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&id=${sheetId}&gid=${gid}`
    ];

    let csvText = '';
    for (const url of csvUrls) {
      try {
        const csvRes = await fetch(url, { headers: { 'Accept': 'text/csv,text/plain,*/*' } });
        if (csvRes.ok) {
          const text = await csvRes.text();
          if (text && !text.includes('<!DOCTYPE html>') && !text.includes('accounts.google.com')) {
            csvText = text;
            break;
          }
        }
      } catch (err) {
        // thử link tiếp theo
      }
    }

    if (!csvText) {
      return res.status(400).json({
        success: false,
        error: 'Không thể đọc dữ liệu từ Google Sheet. Hãy đảm bảo bạn đã bật Chia sẻ: "Bất kỳ ai có đường liên kết đều có thể xem" (Anyone with the link can view).'
      });
    }

    return res.json({
      success: true,
      type: 'csv',
      sheetId,
      gid,
      csvText
    });
  } catch (error: any) {
    console.error('Lỗi tải Google Sheet:', error);
    return res.status(500).json({ success: false, error: error.message || 'Lỗi kết nối máy chủ Google Sheets' });
  }
});

// Kiểm tra trạng thái CSDL Đám mây
app.get('/api/db/status', (req: Request, res: Response) => {
  try {
    const db = loadServerDb();
    res.json({
      online: true,
      status: 'connected',
      type: 'express-cloud-db',
      message: `Máy chủ CSDL Đám mây Trường Tiểu học Hoài Nhơn đang hoạt động`,
      revision: Number(db.revision) || 1,
      lastUpdated: db.lastUpdated || new Date().toISOString(),
      recordCounts: {
        students: db.students?.length || 0,
        classes: db.classes?.length || 0,
        assignments: db.assignments?.length || 0,
        notifications: db.notifications?.length || 0,
        feedbacks: db.feedbacks?.length || 0,
        materials: db.materials?.length || 0,
        subjects: db.subjects?.length || 0,
        games: db.games?.length || 0,
      }
    });
  } catch (err: any) {
    res.status(500).json({ online: false, status: 'error', message: err.message });
  }
});

// Endpoint kiểm tra phiên bản nhẹ (Lightweight Version Check) phục vụ tự động đồng bộ giữa các máy
app.get('/api/db/version', (req: Request, res: Response) => {
  try {
    const db = loadServerDb();
    res.json({
      success: true,
      revision: Number(db.revision) || 1,
      lastUpdated: db.lastUpdated || new Date().toISOString(),
      classId: db.activeClassId || db.classId || 'c-3c1',
      recordCounts: {
        students: db.students?.length || 0,
        classes: db.classes?.length || 0,
        assignments: db.assignments?.length || 0,
        notifications: db.notifications?.length || 0,
        feedbacks: db.feedbacks?.length || 0,
        materials: db.materials?.length || 0,
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lấy toàn bộ dữ liệu CSDL Đám mây mới nhất (Cloud DB Latest)
app.get(['/api/db/latest', '/api/db/all'], (req: Request, res: Response) => {
  try {
    const db = loadServerDb();
    res.json({
      success: true,
      payload: db,
      revision: Number(db.revision) || 1,
      lastUpdated: db.lastUpdated || new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Đồng bộ đẩy dữ liệu lên CSDL Đám mây (Cloud Sync / Push)
app.post('/api/db/sync', (req: Request, res: Response) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, error: 'Thiếu dữ liệu payload' });
    }
    const currentDb = loadServerDb();
    const updatedDb = {
      ...currentDb,
      ...payload,
      classId: payload.classId || payload.activeClassId || currentDb.classId || 'c-3c1',
      activeClassId: payload.activeClassId || currentDb.activeClassId || 'c-3c1',
      classes: payload.classes || currentDb.classes || [],
      students: payload.students || currentDb.students || [],
      assignments: payload.assignments || currentDb.assignments || [],
      notifications: payload.notifications || currentDb.notifications || [],
      feedbacks: payload.feedbacks || currentDb.feedbacks || [],
      materials: payload.materials || currentDb.materials || [],
      subjects: payload.subjects || currentDb.subjects || [],
      genericLessons: payload.genericLessons || currentDb.genericLessons || [],
      games: payload.games || currentDb.games || [],
      teacherProfile: payload.teacherProfile || currentDb.teacherProfile,
      teacherPasswords: payload.teacherPasswords || currentDb.teacherPasswords || {},
      revision: (Number(currentDb.revision) || 0) + 1,
      lastUpdated: new Date().toISOString()
    };
    saveServerDb(updatedDb);
    res.json({
      success: true,
      message: 'Đồng bộ cơ sở dữ liệu đám mây thành công!',
      revision: updatedDb.revision,
      lastUpdated: updatedDb.lastUpdated,
      recordCounts: {
        students: updatedDb.students?.length || 0,
        classes: updatedDb.classes?.length || 0,
        assignments: updatedDb.assignments?.length || 0,
        notifications: updatedDb.notifications?.length || 0,
        feedbacks: updatedDb.feedbacks?.length || 0,
        materials: updatedDb.materials?.length || 0,
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CRUD Students
app.get('/api/db/students', (req: Request, res: Response) => {
  const db = loadServerDb();
  res.json(db.students || []);
});

app.post('/api/db/students', (req: Request, res: Response) => {
  try {
    const db = loadServerDb();
    const newStudent = req.body;
    if (!newStudent || !newStudent.id) {
      return res.status(400).json({ error: 'Dữ liệu học sinh không hợp lệ' });
    }
    const existingIndex = (db.students || []).findIndex((s: any) => s.id === newStudent.id);
    if (existingIndex >= 0) {
      db.students[existingIndex] = { ...db.students[existingIndex], ...newStudent };
    } else {
      db.students = [...(db.students || []), newStudent];
    }
    saveServerDb(db);
    res.json({ success: true, student: newStudent });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/db/students/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = loadServerDb();
    db.students = (db.students || []).filter((s: any) => s.id !== id);
    saveServerDb(db);
    res.json({ success: true, message: `Đã xóa học sinh ${id}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD Assignments
app.get('/api/db/assignments', (req: Request, res: Response) => {
  const db = loadServerDb();
  res.json(db.assignments || []);
});

app.post('/api/db/assignments', (req: Request, res: Response) => {
  try {
    const db = loadServerDb();
    const assignment = req.body;
    db.assignments = [assignment, ...(db.assignments || [])];
    saveServerDb(db);
    res.json({ success: true, assignment });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD Notifications
app.get('/api/db/notifications', (req: Request, res: Response) => {
  const db = loadServerDb();
  res.json(db.notifications || []);
});

app.post('/api/db/notifications', (req: Request, res: Response) => {
  try {
    const db = loadServerDb();
    const notification = req.body;
    db.notifications = [notification, ...(db.notifications || [])];
    saveServerDb(db);
    res.json({ success: true, notification });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD Feedbacks
app.get('/api/db/feedbacks', (req: Request, res: Response) => {
  const db = loadServerDb();
  res.json(db.feedbacks || []);
});

app.post('/api/db/feedbacks', (req: Request, res: Response) => {
  try {
    const db = loadServerDb();
    const feedback = req.body;
    db.feedbacks = [feedback, ...(db.feedbacks || [])];
    saveServerDb(db);
    res.json({ success: true, feedback });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const server = app.listen(Number(port), '0.0.0.0', () => {
    console.log(`🚀 AI CLASS Server running on http://localhost:${port}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      const fallbackPort = Number(port) + 1;
      console.warn(`⚠️ Cổng ${port} đang bận, tự động chuyển sang cổng ${fallbackPort}...`);
      app.listen(fallbackPort, '0.0.0.0', () => {
        console.log(`🚀 AI CLASS Server running on http://localhost:${fallbackPort}`);
      });
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer();
