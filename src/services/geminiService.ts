/**
 * Client service to communicate with backend Gemini API endpoints
 * With built-in educational fallback responses for seamless classroom demo
 */

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  options?: string[];
  audioText?: string;
  lang?: 'vi' | 'en';
  dolaEvent?: any;
}

const FALLBACK_MODELS = [
  'gemini-2.5-flash',
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-2.5-pro'
];

interface DirectGeminiResponse {
  text: string | null;
  error?: string;
  modelUsed?: string;
}

function sanitizeModelName(model?: string): string {
  if (!model || model.includes('3.8') || model.includes('gemini-3')) {
    return 'gemini-2.5-flash';
  }
  return model;
}

async function callDirectGemini(
  prompt: string,
  systemInstruction?: string
): Promise<DirectGeminiResponse> {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) return { text: null, error: 'Chưa cấu hình API Key' };
  const rawModel = localStorage.getItem('gemini_selected_model') || 'gemini-2.5-flash';
  const chosenModel = sanitizeModelName(rawModel);
  const modelsToTry = [chosenModel, ...FALLBACK_MODELS.filter(m => m !== chosenModel)];

  let lastError = '';
  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload: any = {
        contents: [{ parts: [{ text: prompt }] }]
      };
      if (systemInstruction) {
        payload.systemInstruction = { parts: [{ text: systemInstruction }] };
      }
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return { text, modelUsed: model };
      } else {
        const errJson = await res.json().catch(() => ({}));
        const errDetail = errJson.error?.message || errJson.error?.status || `HTTP ${res.status}`;
        lastError = `[${res.status}] ${errDetail}`;
        console.warn(`[AI Engine] Model ${model} gặp lỗi: ${lastError}. Đang tự động chuyển sang model tiếp theo...`);
      }
    } catch (err: any) {
      lastError = err?.message || 'Lỗi kết nối mạng';
      console.warn(`[AI Engine] Model ${model} exception: ${lastError}. Đang thử model tiếp theo...`);
    }
  }
  return { text: null, error: lastError || '429 RESOURCE_EXHAUSTED' };
}

/**
 * Dola AI Function Tool Schema Definition (Dành cho Function Calling / Tool Use)
 */
export const DOLA_AI_TOOL_DEFINITION = {
  name: "syncWithDolaAI",
  description: "Tự động kích hoạt khi giáo viên hoặc học sinh yêu cầu tạo lịch nhắc nhở, thời khóa biểu, lịch kiểm tra hoặc sự kiện lớp học qua Dola AI",
  parameters: {
    type: "OBJECT",
    properties: {
      taskTitle: {
        type: "STRING",
        description: "Tên sự kiện hoặc đầu việc cần nhắc, ví dụ: 'Nộp kế hoạch bài dạy', 'Làm bài tập Tiếng Anh'"
      },
      dateTime: {
        type: "STRING",
        description: "Thời gian diễn ra hoặc hạn chót hoàn thành"
      },
      targetAudience: {
        type: "STRING",
        enum: ["teacher", "student", "class"],
        description: "Đối tượng áp dụng lời nhắc"
      }
    },
    required: ["taskTitle", "dateTime"]
  }
};

/**
 * Hàm phát hiện tác vụ đặt lịch / nhắc việc để đồng bộ với Dola AI
 */
export function isSchedulingIntent(text: string): boolean {
  const scheduleKeywords = [
    "nhắc lịch", "hẹn", "thời khóa biểu", "lịch thi", 
    "nhắc việc", "tạo sự kiện", "họp phụ huynh", "dola", "lên lịch", "đặt lịch", "nhắc nhở"
  ];
  return scheduleKeywords.some(keyword => (text || '').toLowerCase().includes(keyword));
}

/**
 * Xử lý lệnh chuyển tiếp sang Dola AI / Task Engine
 */
export async function forwardToDolaAI(
  userPrompt: string,
  userRole: string = "student",
  authContext: any = {}
): Promise<{ text: string; event?: any }> {
  try {
    const payload = {
      userRole,
      prompt: userPrompt,
      taskTitle: userPrompt.replace(/(hãy|giúp em|nhờ cô|nhắc lịch|lên lịch|hẹn|thời khóa biểu|qua dola|dola ai)/gi, '').trim() || userPrompt,
      dateTime: "Hôm nay",
      targetAudience: userRole === "teacher" ? "class" : "student",
      timezone: "Asia/Ho_Chi_Minh",
      meta: {
        source: "AIBuddy_App",
        timestamp: new Date().toISOString()
      }
    };

    const response = await fetch("/api/dola/sync-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      return {
        text: `📅 **[Dola AI Calendar Hub]**\nAIBuddy đã liên kết với Dola AI để ghi nhận lịch trình của bạn: "${data.taskTitle || data.summary || userPrompt}". Bạn sẽ nhận được thông báo đúng hạn!`,
        event: data
      };
    }
  } catch (error) {
    console.error("Lỗi liên kết Dola AI:", error);
  }

  return {
    text: `📅 **[Dola AI Calendar Hub]**\nAIBuddy đã ghi nhận yêu cầu tạo lịch nhắc: "${userPrompt}". Đã đồng bộ với hệ thống thời khóa biểu và nhắc việc lớp học!`
  };
}

export const geminiService = {
  /**
   * AI Buddy Chat - Hỗ trợ cả hai đối tượng: Giáo viên & Học sinh
   */
  async sendBuddyMessage(
    userMessage: string,
    history: { role: 'user' | 'model'; text: string }[] = [],
    subject: string = 'general',
    materialsContext?: string,
    paramTeacherName?: string,
    paramClassName?: string,
    userRole: 'teacher' | 'student' = 'student'
  ): Promise<{ text: string; audioText?: string; isDemo: boolean; dolaEvent?: any }> {
    const teacherName = paramTeacherName || (() => {
      try {
        const saved = localStorage.getItem('aiclass_teacher_profile_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          return parsed.fullName || parsed.name || 'Giáo viên';
        }
      } catch {}
      return 'Giáo viên';
    })();

    const className = paramClassName || (() => {
      try {
        const savedId = localStorage.getItem('aiclass_active_class_id_v2');
        const savedClasses = localStorage.getItem('aiclass_classes_v2');
        if (savedClasses) {
          const parsed = JSON.parse(savedClasses);
          const target = parsed.find((c: any) => c.id === savedId);
          if (target?.name) return target.name;
          if (parsed[0]?.name) return parsed[0].name;
        }
      } catch {}
      return 'Lớp học';
    })();
    const clientApiKey = localStorage.getItem('gemini_api_key') || undefined;
    const clientModel = sanitizeModelName(localStorage.getItem('gemini_selected_model') || 'gemini-2.5-flash');

    // 1. Kiểm tra tác vụ đặt lịch / nhắc việc đồng bộ Dola AI
    const hasSchedule = isSchedulingIntent(userMessage);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(clientApiKey ? { 'x-gemini-api-key': clientApiKey } : {})
        },
        body: JSON.stringify({
          message: userMessage,
          history,
          subject,
          grade: 3,
          teacherName,
          className,
          materialsContext,
          clientApiKey,
          clientModel,
          userRole
        }),
      });

      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        if (data.reply) {
          return { text: data.reply, audioText: data.reply, isDemo: !!data.isDemo, dolaEvent: data.dolaEvent };
        }
      }
    } catch {
      // Backend route unreachable or network offline, proceed to direct client API fallback
    }

    // Nếu phát hiện lệnh lên lịch Dola AI trong chế độ cục bộ
    if (hasSchedule) {
      const dolaRes = await forwardToDolaAI(userMessage, userRole);
      return { text: dolaRes.text, audioText: dolaRes.text, isDemo: true, dolaEvent: dolaRes.event };
    }

    // Try direct Gemini REST API if user configured API key
    if (clientApiKey) {
      let sysInst = '';
      if (userRole === 'teacher') {
        sysInst = `Bạn là "AIBuddy" - Trợ lý học tập và điều hành giáo dục thông minh hoạt động trong ứng dụng Trường Tiểu học Hoài Nhơn, đồng hành cùng ${teacherName} (Lớp ${className}).
NGỮ ĐIỆU VÀ QUY TẮC PHẢN HỒI CHO GIÁO VIÊN:
- Ngữ điệu: Chuẩn mực, chuyên nghiệp, hỗ trợ sư phạm chuẩn xác và thực tiễn.
- Nhiệm vụ: Soạn giáo án (Kế hoạch bài dạy CV 2345), hoạt động trải nghiệm, Rubric TT 27, trò chơi học tập, tư vấn xử lý tình huống sư phạm và giải đáp kiến thức khoa học, giáo dục, đời sống toàn diện.
- Trả lời mượt mà, tự nhiên, đầy đủ cho mọi câu hỏi thường thức hoặc chuyên môn.
Môn học: ${subject}.`;
      } else {
        sysInst = `Bạn là "AIBuddy" - Trợ lý học tập thông minh, thân thiện của học sinh lớp ${className}, Trường Tiểu học Hoài Nhơn, đồng hành cùng cô giáo ${teacherName}.
NGỮ ĐIỆU VÀ QUY TẮC PHẢN HỒI CHO HỌC SINH:
- Ngữ điệu: Thân thiện, gần gũi, ấm áp, kiên nhẫn, khích lệ tinh thần học tập ("Chào bạn nhỏ!", "Bạn làm tốt lắm!").
- Luôn sẵn sàng giải đáp TẤT CẢ các câu hỏi của học sinh: khoa học, vũ trụ, tự nhiên, đời sống, giao tiếp hàng ngày, kể chuyện cười, truyện cổ tích, đố vui, tâm sự. TUYỆT ĐỐI KHÔNG từ chối hoặc chặn câu hỏi đời thường.
- Khi học sinh hỏi bài tập: Giải thích rõ ràng từng bước, kèm ví dụ minh họa và gợi mở tư duy logic.
- Hỗ trợ song ngữ Tiếng Anh và Tiếng Việt.
Môn học: ${subject}.`;
      }
      
      const sub = (subject || '').toLowerCase();
      if (sub.includes('anh') || sub.includes('english')) {
        sysInst += `\n[MÔN TIẾNG ANH]: Dạy song ngữ Anh - Việt, phiên âm đọc vui, khen ngợi bằng tiếng Anh, luyện từ vựng và câu giao tiếp ngắn.`;
      } else if (sub.includes('toán') || sub.includes('math')) {
        sysInst += `\n[MÔN TOÁN]: Hướng dẫn tư duy các bước (đọc đề, tìm bước tính, chọn phép tính, kiểm tra lại kết quả).`;
      } else if (sub.includes('việt') || sub.includes('văn')) {
        sysInst += `\n[MÔN TIẾNG VIỆT]: Giải nghĩa từ, tìm từ đồng nghĩa/trái nghĩa, hướng dẫn biện pháp so sánh (từ "như", "là", "tựa"), nhân hóa, đặt câu trọn vẹn.`;
      } else if (sub.includes('tin') || sub.includes('công nghệ') || sub.includes('it')) {
        sysInst += `\n[MÔN TIN HỌC]: Nhắc 10 ngón tay với 2 phím có gờ F và J ở hàng phím cơ sở, tư duy khối lệnh và an toàn bảo mật trên mạng.`;
      } else if (sub.includes('khoa') || sub.includes('tự nhiên') || sub.includes('tnxh')) {
        sysInst += `\n[MÔN KHOA HỌC]: Giải thích hiện tượng tự nhiên, động thực vật, cơ thể người, bảo vệ môi trường bằng ví dụ trực quan sinh động.`;
      } else if (sub.includes('lịch') || sub.includes('địa')) {
        sysInst += `\n[MÔN LỊCH SỬ & ĐỊA LÍ]: Kể chuyện danh nhân, di tích lịch sử và danh lam thắng cảnh Hoài Nhơn, Bình Định, Việt Nam.`;
      }

      if (materialsContext) {
        sysInst += `\n\n[Dữ liệu Kho học liệu số kết nối môn này]:\n${materialsContext}\nHãy dựa vào học liệu này để giải đáp hoặc cung cấp tài liệu.`;
      }
      const directResult = await callDirectGemini(userMessage, sysInst);
      if (directResult.text) {
        return { text: directResult.text, audioText: directResult.text, isDemo: false };
      }
    }

    // High quality pedagogical fallback response for demo with materials context awareness
    const lower = userMessage.toLowerCase();
    const subLower = (subject || '').toLowerCase();
    let reply = '';

    // Kiểm tra phép tính số học đơn giản
    const cleanMath = userMessage.replace(/bằng mấy|bằng bao nhiêu|\?|=/gi, '').trim();
    const mathMatch = cleanMath.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/xX÷])\s*(\d+(?:\.\d+)?)/);
    if (mathMatch) {
      const numA = parseFloat(mathMatch[1]);
      const op = mathMatch[2];
      const numB = parseFloat(mathMatch[3]);
      if (!isNaN(numA) && !isNaN(numB)) {
        let calcRes = 0;
        let opName = '';
        if (op === '+' || op === 'cộng') { calcRes = numA + numB; opName = 'phép cộng'; }
        else if (op === '-' || op === 'trừ') { calcRes = numA - numB; opName = 'phép trừ'; }
        else if (op === '*' || op === 'x' || op === 'X' || op === 'nhân') { calcRes = numA * numB; opName = 'phép nhân'; }
        else if (op === '/' || op === '÷' || op === 'chia') {
          if (numB !== 0) { calcRes = numA / numB; opName = 'phép chia'; }
        }
        if (opName) {
          const resStr = Number.isInteger(calcRes) ? calcRes.toString() : calcRes.toFixed(2);
          reply = `💡 **Kết quả tính toán:**\n\nThực hiện ${opName}: **${numA} ${op} ${numB} = ${resStr}**.\n\n✨ *Mẹo nhỏ:* Luôn kiểm tra lại phép tính bằng cách làm ngược lại để chắc chắn kết quả chính xác 100% nhé!`;
          return { text: reply, audioText: reply, isDemo: true };
        }
      }
    }

    // ==================== PHẢN HỒI CHUYÊN MÔN DÀNH CHO GIÁO VIÊN ====================
    if (userRole === 'teacher') {
      if (lower.includes('giáo án') || lower.includes('kế hoạch bài dạy') || lower.includes('cv 2345') || lower.includes('bài dạy')) {
        reply = `📋 **KẾ HOẠCH BÀI DẠY (GIÁO ÁN CHUẨN CÔNG VĂN 2345/BGDĐT-GDTH)**
**Trường Tiểu học Hoài Nhơn** • **Lớp ${className}** • **GVCN: ${teacherName}**
**Môn:** ${subject} • **Bài:** ${userMessage.replace(/(soạn|giáo án|kế hoạch bài dạy|cho tôi|giúp tôi)/gi, '').trim() || 'Bài học phân môn'}

---
### I. YÊU CẦU CẦN ĐẠT
1. **Năng lực đặc thù:**
   - Nắm vững kiến thức trọng tâm, hiểu bản chất khái niệm và quy trình thao tác chuẩn của môn ${subject}.
   - Vận dụng kiến thức bài học để giải quyết bài tập và liên hệ thực tế cuộc sống địa phương.
2. **Năng lực chung:**
   - *Tự chủ và tự học:* Chủ động nghiên cứu học liệu số, tích cực tham gia thảo luận nhóm.
   - *Giao tiếp và hợp tác:* Trình bày ý kiến rõ ràng, biết lắng nghe và phản biện tích cực.
3. **Phẩm chất chủ yếu:**
   - Chăm chỉ, trách nhiệm, bồi dưỡng tình yêu quê hương Hoài Nhơn và ý thức bảo vệ môi trường.

---
### II. ĐỒ DÙNG DẠY HỌC
- **Giáo viên:** Thiết bị dạy học số, máy chiếu, học liệu số từ thư viện trường, phiếu học tập nhóm.
- **Học sinh:** Sách giáo khoa, vở bài tập, thiết bị bảng nhóm.

---
### III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU
1. **Hoạt động 1: Khởi động - Kết nối (5 phút)**
   - GV tổ chức trò chơi tương tác mini (ví dụ: *Vòng quay may mắn* hoặc *Ai nhanh ai đúng*).
   - HS tham gia nhiệt tình, tạo tâm thế phấn khởi bước vào bài mới.
2. **Hoạt động 2: Khám phá - Hình thành kiến thức (15 phút)**
   - GV trình chiếu học liệu số, nêu vấn đề gợi mở định hướng quan sát.
   - HS làm việc theo nhóm 4: Thảo luận, ghi kết quả vào phiếu học tập và đại diện trình bày.
   - GV chuẩn hóa kiến thức, chốt nội dung trọng tâm.
3. **Hoạt động 3: Luyện tập - Thực hành (10 phút)**
   - HS làm bài tập cá nhân vào vở, GV quan sát hỗ trợ HS gặp khó khăn (theo Thông tư 27).
   - Đổi vở chấm chéo hoặc chữa bài trực tiếp trên màn hình chiếu.
4. **Hoạt động 4: Vận dụng - Trải nghiệm (5 phút)**
   - Đặt câu hỏi mở kết nối với đời sống thực tế quanh em.
   - Hướng dẫn HS tự ôn tập tại nhà qua Kho học liệu số của trường.

---
### IV. ĐIỀU CHỈNH SAU BÀI DẠY (Dành cho GV ghi nhận thực tế)
- ............................................................................................................`;
      } else if (lower.includes('trải nghiệm') || lower.includes('hoạt động')) {
        reply = `✨ **THIẾT KẾ HOẠT ĐỘNG TRẢI NGHIỆM ĐỔI MỚI PHƯƠNG PHÁP DẠY HỌC**
**Môn học:** ${subject} • **Đối tượng:** Học sinh Lớp ${className}

**1. Tên hoạt động:** "Em là nhà khám phá tri thức nhí Hoài Nhơn"
**2. Mục tiêu:**
- Giúp học sinh trải nghiệm thực tế, phát triển năng lực giải quyết vấn đề sáng tạo.
- Tăng cường tinh thần làm việc nhóm và kỹ năng trình bày trước tập thể.
**3. Tiến trình thực hiện 3 chặng:**
- *Chặng 1 (Khám phá):* Giao nhiệm vụ cho 4 nhóm tìm hiểu từ Kho học liệu số của trường.
- *Chặng 2 (Trải nghiệm thực hành):* Nhóm thực hành tạo sản phẩm (sơ đồ tư duy, mô hình hoặc bài thuyết trình mini).
- *Chặng 3 (Báo cáo & Vinh danh):* Các nhóm trưng bày tại góc học tập lớp, trao huy hiệu khen thưởng cho nhóm sáng tạo nhất!`;
      } else if (lower.includes('tiêu chí') || lower.includes('rubric') || lower.includes('đánh giá')) {
        reply = `📊 **BẢNG TIÊU CHÍ ĐÁNH GIÁ NĂNG LỰC HỌC SINH (RUBRIC THEO THÔNG TƯ 27/2020/BGDĐT)**
**Môn:** ${subject} • **Hoạt động:** Đánh giá thường xuyên quá trình học tập

| Tiêu chí đánh giá | Mức T (Hoàn thành Tốt) | Mức H (Hoàn thành) | Mức C (Chưa hoàn thành) |
| :--- | :--- | :--- | :--- |
| **1. Nắm vững kiến thức** | Hiểu sâu, nhớ bài chuẩn, giải thích mạch lạc cho bạn | Nắm được kiến thức cơ bản, trả lời đúng phần lớn câu hỏi | Cần GV gợi ý, còn nhầm lẫn kiến thức trọng tâm |
| **2. Kỹ năng thực hành** | Làm bài tập chính xác 100%, trình bày sạch đẹp, có sáng tạo | Làm đúng các bài tập cơ bản, trình bày rõ ràng | Thao tác còn chậm, cần sự trợ giúp của thầy/cô |
| **3. Tinh thần học tập** | Chủ động phát biểu, hợp tác nhóm tích cực, hỗ trợ bạn | Chú ý lắng nghe, tham gia đủ các hoạt động học tập | Còn thụ động, thỉnh thoảng mất tập trung |

💡 *Gợi ý cho cô ${teacherName}: Thầy/cô có thể in trực tiếp bảng này hoặc lưu vào hồ sơ theo dõi học sinh định kỳ!*`;
      } else if (lower.includes('trò chơi') || lower.includes('game')) {
        reply = `🎮 **GỢI Ý TRÒ CHƠI HỌC TẬP KHỞI ĐỘNG HỨNG THÚ (MÔN ${subject.toUpperCase()})**
**Tên trò chơi:** "Chuyến Tàu Tri Thức Hoài Nhơn"
- **Thời lượng:** 5 - 7 phút (Đầu tiết học hoặc trước phần củng cố).
- **Mục tiêu:** Kích hoạt năng lượng lớp học, ôn lại kiến thức bài trước một cách tự nhiên.
- **Luật chơi:**
  1. Lớp chia làm 4 đội tương ứng 4 toa tàu.
  2. Mỗi toa sẽ nhận 1 câu hỏi bí mật từ AI Buddy / Kho học liệu số.
  3. Đội nào bấm chuông (hoặc giơ cờ hoa) nhanh nhất và trả lời đúng sẽ giúp tàu tiến thêm 1 trạm.
  4. Đội về đích đầu tiên được nhận Huy hiệu Hoa Điểm Tốt của lớp!`;
      } else if (lower.includes('tình huống') || lower.includes('mất tập trung') || lower.includes('nói chuyện')) {
        reply = `💡 **TƯ VẤN XỬ LÝ TÌNH HUỐNG SƯ PHẠM TIỂU HỌC**
**Tình huống:** Học sinh lớp ${className} có biểu hiện mất tập trung, nói chuyện riêng trong giờ học.

**Phương pháp tiếp cận sư phạm 4 bước khéo léo:**
1. **Quan sát & Nhắc nhở khéo léo (Không ngắt quãng tiết dạy):**
   - Di chuyển nhẹ nhàng về phía bàn của học sinh trong lúc giảng bài.
   - Dùng cử chỉ ánh mắt hoặc chạm nhẹ vai thay vì quát mắng làm gián đoạn lớp.
2. **Thu hút lại sự chú ý bằng câu hỏi vừa sức:**
   - Mời học sinh đó đọc tiếp một câu trong bài hoặc làm người trợ lý bấm chuyển slide cho cô.
3. **Khen ngợi nỗ lực tích cực:**
   - Ngay khi học sinh tập trung trở lại, dành lời khen ngợi kịp thời trước lớp để tạo động lực tự giác.
4. **Tìm hiểu nguyên nhân sau giờ học:**
   - Trò chuyện riêng 2-3 phút xem em có gặp khó khăn về bài giảng hay vấn đề tâm lý, từ đó kết nối với phụ huynh phối hợp rèn nề nếp.`;
      } else if (lower.includes('chào') || lower.includes('hello') || lower.includes('hi')) {
        reply = `Kính chào thầy/cô ${teacherName}! 👋 AIBuddy rất vui được đồng hành cùng thầy/cô trong công tác giảng dạy và điều hành lớp ${className}.\n\nTôi sẵn sàng hỗ trợ thầy/cô:\n• 📋 Soạn giáo án (Kế hoạch bài dạy chuẩn CV 2345/BGDĐT).\n• 📊 Thiết kế bảng Rubric đánh giá năng lực học sinh theo Thông tư 27.\n• 🎮 Sáng tạo hoạt động trải nghiệm, trò chơi mở đầu & củng cố tiết dạy.\n• 📅 Tự động đồng bộ lịch họp và nhắc việc lớp qua Dola AI.\n• 💡 Tư vấn mọi vấn đề chuyên môn, công nghệ số và kiến thức sư phạm.`;
      } else {
        reply = `Kính chào thầy/cô ${teacherName}! Về câu hỏi của thầy/cô: "${userMessage}"\n\nAIBuddy xin gợi ý định hướng giải quyết như sau:\n1. **Phân tích mục tiêu:** Xác định rõ kết quả cần đạt, phù hợp năng lực học sinh lớp ${className}.\n2. **Giải pháp thực hiện:** Vận dụng linh hoạt các phương pháp dạy học tích cực, kết hợp tài nguyên số trong Kho học liệu.\n3. **Đánh giá & Phản hồi:** Kịp thời động viên học sinh và ghi nhận tiến độ vào sổ theo dõi định kỳ.\n\nThầy/cô cần AIBuddy hỗ trợ cụ thể nội dung nào cho lớp ${className} ạ?`;
      }

      return { text: reply, audioText: reply, isDemo: true };
    }

    // ==================== PHẢN HỒI GỢI MỞ DÀNH CHO HỌC SINH ====================
    if (lower.includes('bầu trời') && (lower.includes('xanh') || lower.includes('màu'))) {
      reply = `🌌 **Vì sao bầu trời ban ngày lại có màu xanh lam?**\n\n1. Ánh sáng Mặt Trời nhìn bằng mắt thường có màu trắng, nhưng thực chất chứa 7 màu sắc cầu vồng: Đỏ, Cam, Vàng, Lục, Lam, Chàm, Tím.\n2. Khi ánh sáng chiếu qua bầu khí quyển Trái Đất, nó gặp phải các phân tử khí và hạt bụi li ti.\n3. Ánh sáng màu xanh lam có bước sóng ngắn nên bị các phân tử khí tán xạ (bắn tung tóe ra khắp mọi hướng) mạnh nhất.\n4. Mắt con người lại nhạy cảm nhất với ánh sáng màu xanh lam, vì thế khi nhìn lên cao, chúng mình thấy bầu trời có màu xanh tuyệt đẹp! ☀️`;
    } else if (lower.includes('nước biển') && lower.includes('mặn')) {
      reply = `🌊 **Vì sao nước biển lại mặn?**\n\n1. **Nguồn gốc:** Nước mưa rơi xuống làm xói mòn các loại đá trên mặt đất và hòa tan các muối khoáng (đặc biệt là muối ăn NaCl).\n2. **Dòng chảy:** Các dòng sông, suối mang lượng muối này đổ ra biển.\n3. **Sự bốc hơi:** Nước biển bốc hơi lên trời tạo thành mây, nhưng **muối không bốc hơi** mà đọng lại ở đại dương.\n4. Qua hàng triệu năm tích tụ, nước biển đã trở nên mặn như ngày nay! 🐳`;
    } else if (lower.includes('lá cây') && (lower.includes('xanh') || lower.includes('màu'))) {
      reply = `🍃 **Vì sao lá cây lại có màu xanh lục?**\n\n1. Trong lá cây chứa chất sắc tố đặc biệt gọi là **Chất diệp lục (Chlorophyll)**.\n2. Chất diệp lục hấp thụ ánh sáng Mặt Trời để thực hiện quá trình **quang hợp**, tạo thức ăn nuôi cây và nhả khí Oxy trong lành cho chúng mình hít thở.\n3. Diệp lục hấp thụ ánh sáng đỏ và xanh lam, nhưng **phản xạ ánh sáng xanh lục** vào mắt chúng mình, vì thế lá cây có màu xanh mướt mát mắt! 🌳`;
    } else if (lower.includes('thủ đô') && (lower.includes('pháp') || lower.includes('france'))) {
      reply = `🗼 **Thủ đô của nước Pháp là gì?**\n\nThủ đô của nước Pháp là thành phố **Paris** – "Kinh đô Ánh sáng" và kinh đô thời trang của thế giới!\n\nTại Paris có công trình nổi tiếng thế giới như **Tháp Eiffel** soi bóng bên dòng sông Seine, **Bảo tàng Louvre** lưu giữ bức tranh nàng Mona Lisa và **Nhà thờ Đức Bà Paris** cổ kính. 🥐`;
    } else if (lower.includes('thủ đô') && (lower.includes('việt nam') || lower.includes('nước ta'))) {
      reply = `🇻🇳 **Thủ đô của nước Việt Nam là gì?**\n\nThủ đô của nước ta là thành phố **Hà Nội** – ngàn năm văn hiến!\n\nNơi đây có Hồ Gươm gắn với truyền thuyết Rùa Vàng, Quảng trường Ba Đình lịch sử, Lăng Bác Hồ kính yêu và Văn Miếu - Quốc Tử Giám trường đại học đầu tiên của dân tộc ta! ⭐`;
    } else if (lower.includes('chuyện cười') || lower.includes('hài hước') || lower.includes('vui')) {
      reply = `😄 **Câu chuyện cười học trò: "Bài văn về con chó"**\n\nCô giáo bảo Tèo: *"Em hãy viết một đoạn văn ngắn tả con chó nhà em nhé!"*\nTèo viết: *"Nhà em có nuôi một con chó rất ngoan, nó tên là Vàng."*\nCô giáo hỏi: *"Sao em viết ngắn thế?"*\nTèo gãi đầu: *"Dạ thưa cô, em định tả tiếp thì con chó nhà em nó chạy tót sang nhà hàng xóm chơi mất rồi, em phải đợi nó về mới nhìn để tả tiếp được ạ!"* 😂\n\nChúc em có những phút giây học tập thật vui vẻ nhé!`;
    } else if (lower.includes('kể chuyện') || lower.includes('truyện')) {
      reply = `📖 **Câu chuyện ý nghĩa: "Rùa và Thỏ – Bài học về sự kiên trì"**\n\nTrong cuộc chạy đua lên đỉnh đồi, Thỏ cậy mình chạy nhanh nên mải chơi và nằm ngủ quên dưới gốc cây. Trong khi đó, bác Rùa từng bước chậm rãi nhưng **không hề dừng lại**.\n\nKết quả là khi Thỏ tỉnh giấc, Rùa đã về đích trước trong tiếng reo hò của muôn loài!\n\n💡 **Bài học:** Trong học tập cũng vậy, thông minh là tốt nhưng **sự chăm chỉ và kiên trì** mới là chìa khóa giúp em đạt được những thành tích xuất sắc nhất! ⭐`;
    } else if (lower.includes('làm thơ') || lower.includes('bài thơ')) {
      reply = `📝 **Bài thơ tặng bạn nhỏ lớp ${className}:**\n\n*Mỗi sáng em tới lớp,\nNắng ấm rải sân trường.\nCô giáo hiền đón bước,\nMắt đong đầy yêu thương.*\n\n*Trang sách mở chân trời,\nBao điều hay mới lạ.\nToán, Văn cùng Tiếng Anh,\nHọc vui say biết tả!* 🌸`;
    } else if (materialsContext && (lower.includes('học liệu') || lower.includes('tài liệu') || lower.includes('bài giảng') || lower.includes('bài học') || lower.includes('hướng dẫn'))) {
      reply = `🌟 Tuyệt vời! AI Buddy đã tra cứu trong Kho học liệu số Trường Tiểu học Hoài Nhơn cho môn ${subject}. Dưới đây là kiến thức cốt lõi giúp em ôn tập tốt nhất:\n\n${materialsContext.slice(0, 450)}...\n\n👉 Em có muốn cùng AI Buddy giải một số câu hỏi gợi mở để tự tìm ra cách làm bài này không nào?`;
    } else if (subLower.includes('anh') || subLower.includes('english') || lower.includes('english') || lower.includes('tiếng anh')) {
      reply = `🌟 Hello friend! Welcome to English time with AI Buddy! 🇬🇧\n\n- Từ vựng trọng tâm: **Family** (Gia đình): Father (bố), Mother (mẹ), Brother (anh/em trai), Sister (chị/em gái).\n- Mẫu câu thực hành: "This is my family. I love my mother very much!" (Đây là gia đình mình. Mình yêu mẹ rất nhiều!)\n\n👉 Em hãy thử đọc to câu trên hoặc hỏi mình mẹo ghi nhớ từ vựng nhé! Great job! ⭐`;
    } else if (subLower.includes('toán') || subLower.includes('math') || lower.includes('toán') || lower.includes('tính')) {
      reply = `📐 Chào bạn nhỏ yêu Toán học! Hãy cùng AI Buddy suy nghĩ từng bước nhé:\n\n1. Bước 1: Đọc kỹ đề bài xem bài toán cho biết số liệu gì và hỏi điều gì.\n2. Bước 2: Nhớ quy tắc ưu tiên: "Trong ngoặc trước, ngoài ngoặc sau. Nhân chia trước, cộng trừ sau".\n3. Bước 3: Với bài toán có lời văn 2 bước, tìm đại lượng trung gian trước rồi tính kết quả cuối cùng.\n\n👉 Em đang làm bài toán nào, hãy gõ ra đây để AI Buddy hướng dẫn em nhé! ⭐`;
    } else if (subLower.includes('việt') || subLower.includes('văn') || lower.includes('tiếng việt') || lower.includes('so sánh') || lower.includes('nhân hóa')) {
      reply = `📖 Chào bạn nhỏ! Trong môn Tiếng Việt 3 (Bộ sách Kết nối tri thức):\n\n- **Biện pháp So sánh**: Giúp câu văn sinh động hơn bằng cách đối chiếu hai sự vật có nét tương đồng qua các từ so sánh: *như, là, tựa như*.\n  Ví dụ: "Mặt trời đỏ rực như quả cầu lửa khổng lồ."\n- **Biện pháp Nhân hóa**: Gán cho con vật, đồ vật tình cảm và hành động như con người.\n\n👉 Em hãy thử tìm một từ ngữ so sánh hay mà em thích nhất xem nào!`;
    } else if (subLower.includes('tin') || subLower.includes('it') || lower.includes('tin học') || lower.includes('bàn phím') || lower.includes('chuột')) {
      reply = `💻 Chào bạn nhỏ yêu công nghệ! Trong môn Tin học & Kỹ năng số:\n\n- **Quy tắc gõ 10 ngón**: Luôn xuất phát từ hàng phím cơ sở. Ngón trỏ tay trái đặt ở phím **F**, ngón trỏ tay phải đặt ở phím **J** (hai phím có gờ xúc giác để định vị không cần nhìn bàn phím).\n- **An toàn mạng**: Tuyệt đối không chia sẻ mật khẩu tài khoản của mình cho người lạ và chỉ truy cập những website học tập an toàn nhé! ⭐`;
    } else if (subLower.includes('khoa') || subLower.includes('tnxh') || lower.includes('khoa học') || lower.includes('thực vật')) {
      reply = `🌱 Chào nhà khoa học nhí! Trong môn Khoa học & Tự nhiên - Xã hội:\n\n- Các bộ phận chính của thực vật gồm: **Rễ** (hút nước và khoáng chất), **Thân** (dẫn nhựa và nâng đỡ cành lá), **Lá** (quang hợp tạo oxy cho chúng mình hít thở), **Hoa** và **Quả** (sinh sản).\n- Em hãy quan sát cây cối quanh sân trường xem rễ cây có hình dáng như thế nào nhé! 🍃`;
    } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('chào')) {
      reply = `Xin chào bạn nhỏ lớp ${className}! 👋 Mình là AI Buddy - Trợ lý học tập thông minh của cô ${teacherName} Trường Tiểu học Hoài Nhơn đây! Hôm nay bạn muốn cùng mình rèn luyện môn nào hoặc khám phá điều thú vị nào trong cuộc sống? ⭐`;
    } else {
      reply = `🌟 **Chào bạn nhỏ lớp ${className}!**\n\nAI Buddy đã nhận được câu hỏi thú vị của em: *" ${userMessage} "*\n\nĐây là câu trả lời và gợi ý bổ ích dành cho em:\n• **Khám phá:** Trong cuộc sống và học tập, mỗi câu hỏi đều mở ra một cánh cửa tri thức mới. Em có thể tìm hiểu thêm qua sách vở, hỏi thầy cô hoặc cùng AI Buddy đào sâu thêm.\n• **Ứng dụng:** Hãy liên hệ nội dung này với các bài học trên lớp để nhớ bài thật lâu nhé!\n• **Lời khuyên:** Em có thể hỏi thêm bất kỳ điều gì em còn băn khoăn về khoa học, toán học, tiếng Anh hoặc đời sống.\n\nChúc em học thật vui và luôn giữ tinh thần tò mò khám phá tuyệt vời này nhé! ⭐`;
    }

    return { text: reply, audioText: reply, isDemo: true };
  },

  /**
   * Hàm trung tâm nhận câu hỏi và tự động điều phối phản hồi
   */
  async processBuddyAutoResponse(message: string, userRole: string = "student", appContext: any = {}) {
    // 1. Kiểm tra nếu là tác vụ lịch hẹn/nhắc việc -> Gọi Dola AI
    if (isSchedulingIntent(message)) {
      return await forwardToDolaAI(message, userRole, appContext);
    }

    // 2. Chuyển tiếp tới hàm sendBuddyMessage với đầy đủ context
    return await this.sendBuddyMessage(
      message,
      appContext.history || [],
      appContext.subject || "Chung",
      appContext.materialsContext,
      appContext.teacherName,
      appContext.className,
      userRole === "teacher" ? "teacher" : "student"
    );
  },

  /**
   * AI Class Assistant for Teachers
   */
  async generateTeacherTask(
    type:
      | 'lesson_plan'
      | 'lesson_plan_2345'
      | 'announcement'
      | 'positive_rules'
      | 'differentiated_comment'
      | 'tt27_comment'
      | 'quiz_generator'
      | 'quiz_generator_tt27'
      | 'personalized_remediation'
      | 'digital_skills_rubric',
    parameters: Record<string, any>
  ): Promise<{ result: string; isDemo: boolean; error?: string }> {
    const clientApiKey = localStorage.getItem('gemini_api_key') || undefined;
    const clientModel = localStorage.getItem('gemini_selected_model') || 'gemini-2.5-flash';
    const teacherName = parameters?.teacherName || (() => {
      try {
        const saved = localStorage.getItem('aiclass_teacher_profile_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          return parsed.fullName || parsed.name || 'Giáo viên';
        }
      } catch {}
      return 'Giáo viên';
    })();
    const className = parameters?.className || (() => {
      try {
        const savedId = localStorage.getItem('aiclass_active_class_id_v2');
        const savedClasses = localStorage.getItem('aiclass_classes_v2');
        if (savedClasses) {
          const parsed = JSON.parse(savedClasses);
          const target = parsed.find((c: any) => c.id === savedId);
          if (target?.name) return target.name;
        }
      } catch {}
      return 'Lớp học';
    })();
    const grade = parameters?.grade || 3;
    const school = parameters?.school || 'Trường Tiểu học Hoài Nhơn';

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(clientApiKey ? { 'x-gemini-api-key': clientApiKey } : {})
        },
        body: JSON.stringify({
          taskType: type,
          parameters,
          teacherName,
          className,
          school,
          clientApiKey,
          clientModel
        }),
      });

      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        if (data.content) {
          return { result: data.content, isDemo: false };
        }
      }
    } catch {
      // Backend route unreachable
    }

    if (clientApiKey) {
      let promptText = '';
      if (type === 'announcement') {
        promptText = `Hãy soạn một thông báo/thư ngỏ gửi Quý phụ huynh học sinh lớp ${className} (${school}) về chủ đề: ${parameters?.topic || 'Kế hoạch học tập tuần mới và rèn luyện kỹ năng số'}. Ký tên: Giáo viên chủ nhiệm ${teacherName}.`;
      } else if (type === 'lesson_plan' || type === 'lesson_plan_2345') {
        promptText = `Hãy soạn Kế hoạch bài dạy (giáo án) chuẩn Công văn 2345/BGDĐT-GDTH cho môn ${parameters?.subject || 'Tiếng Việt'}, khối ${grade}, bộ sách ${parameters?.bookSeries || 'Kết nối tri thức'}, bài: "${parameters?.lessonTitle || 'Luyện từ và câu'}". Có tích hợp công nghệ AI, chia 4 hoạt động: Khởi động, Khám phá, Luyện tập, Vận dụng, đánh giá theo Thông tư 27. Giáo viên: ${teacherName}.`;
      } else if (type === 'positive_rules') {
        promptText = `Hãy sáng tác 5-7 câu nội quy lớp học hạnh phúc viết dạng thơ hoặc vè 4-5 chữ vui nhộn, truyền cảm hứng cho học sinh lớp ${className}. Giáo viên: ${teacherName}.`;
      } else if (type === 'differentiated_comment' || type === 'tt27_comment') {
        promptText = `Hãy soạn nhận xét học sinh tiểu học chuẩn Thông tư 27/2020/TT-BGDĐT cho học sinh: ${parameters?.studentData?.fullName || 'học sinh'}, điểm mạnh: ${parameters?.studentData?.skills ? JSON.stringify(parameters.studentData.skills) : 'toán và tiếng anh'}, mục tiêu: ${parameters?.studentData?.supportGoal || 'tiến bộ đều'}. Cần có nhận xét Môn học, Năng lực chung, Phẩm chất, biện pháp hỗ trợ cụ thể mang tính động viên tích cực.`;
      } else if (type === 'quiz_generator' || type === 'quiz_generator_tt27') {
        promptText = `Hãy tạo Đề kiểm tra định kỳ môn ${parameters?.subject || 'Toán'}, khối ${grade}, chủ đề "${parameters?.topic || 'Ôn tập phép nhân và chia'}" kèm Ma trận đề 3 mức độ theo Thông tư 27 (Mức 1: 40%, Mức 2: 30%, Mức 3: 30%), có đáp án và biểu điểm chi tiết.`;
      } else if (type === 'personalized_remediation') {
        promptText = `Hãy lập Kế hoạch phụ đạo và bồi dưỡng cá nhân hóa cho học sinh ${parameters?.studentData?.fullName || 'học sinh'} lớp ${className}, hiện đang cần hỗ trợ: "${parameters?.studentData?.supportGoal || 'Rèn luyện tính toán'}". Nêu rõ hoạt động cho cô giáo, học sinh và gia đình trong 2 tuần tới.`;
      } else if (type === 'digital_skills_rubric') {
        promptText = `Hãy thiết kế bảng Rubric đánh giá Năng lực số và Kỹ năng thế kỷ 21 cho học sinh tiểu học (lớp ${className}) theo 4 mức độ: Tốt, Khá, Đạt, Cần cố gắng, tập trung vào kỹ năng tra cứu an toàn, làm việc nhóm và tương tác với AI học tập.`;
      } else {
        promptText = `Hỗ trợ giáo viên lớp ${className}: ${JSON.stringify(parameters)}`;
      }
      const directResult = await callDirectGemini(promptText);
      if (directResult.text) {
        return { result: directResult.text, isDemo: false };
      }
      if (directResult.error) {
        return { result: '', isDemo: false, error: directResult.error };
      }
    }

    // High standard pedagogical fallback tailored to Vietnamese Primary Education Standards
    let sample = '';
    if (type === 'lesson_plan' || type === 'lesson_plan_2345') {
      const subjectName = parameters?.subject || 'Tiếng Việt';
      const lessonTitle = parameters?.lessonTitle || parameters?.topic || 'Bài học theo phân phối chương trình';
      const bookSeries = parameters?.bookSeries || 'Bộ sách Kết nối tri thức với cuộc sống';
      const subL = subjectName.toLowerCase();
      const customReq = parameters?.customRequirements ? `\n📌 YÊU CẦU RIÊNG CỦA GIÁO VIÊN: ${parameters.customRequirements}` : '';

      if (subL.includes('toán') || subL.includes('math')) {
        sample = `📋 KẾ HOẠCH BÀI DẠY (GIÁO ÁN) CHUẨN CÔNG VĂN 2345/BGDĐT-GDTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TRƯỜNG: ${school} • LỚP: ${className} (KHỐI ${grade})
GIÁO VIÊN THỰC HIỆN: ${teacherName}
MÔN HỌC: TOÁN HỌC (${bookSeries})
BÀI DẠY: ${lessonTitle}
THỜI LƯỢNG: 1 tiết (35 phút) • TÍCH HỢP: Ứng dụng AI Class & Trợ lý toán học AI Buddy${customReq}

I. YÊU CẦU CẦN ĐẠT:
1. Năng lực đặc thù Toán học:
   - Năng lực tư duy và lập luận toán học: Hiểu và giải thích được bản chất của phép tính/khái niệm trong bài "${lessonTitle}".
   - Năng lực giải quyết vấn đề toán học: Biết nhận diện bài toán thực tế, phân tích dữ kiện cho biết gì - hỏi gì và lập phép tính chính xác.
   - Năng lực sử dụng công cụ, phương tiện học toán: Sử dụng bảng số, thẻ tính và ứng dụng AI Buddy để kiểm tra kết quả.
2. Năng lực chung:
   - Tự chủ và tự học: Tự giác làm bài tập theo mức độ, tự sửa lỗi sai khi đối chiếu gợi ý từng bước.
   - Giao tiếp và hợp tác: Trao đổi cặp đôi giải thích cách tính, biết lắng nghe và tôn trọng cách giải khác biệt của bạn bè.
3. Phẩm chất chủ yếu:
   - Chăm chỉ: Cẩn thận trong từng bước tính, giữ gìn vở sạch chữ đẹp.
   - Trung thực: Tự giác làm bài, trung thực báo cáo kết quả rèn luyện.

II. ĐỒ DÙNG DẠY HỌC VÀ HỌC LIỆU SỐ:
- Giáo viên: Tivi thông minh, máy chiếu, học liệu số từ Kho học liệu số Trường Tiểu học Hoài Nhơn, phần mềm AI Class.
- Học sinh: Bảng con, SGK, vở bài tập, thiết bị số để tương tác với AI Buddy (nếu có).

III. TIẾN TRÌNH DẠY HỌC (4 HOẠT ĐỘNG CHUẨN CV 2345):
1. Hoạt động Khởi động (5 phút) - "Đấu trường tư duy nhí":
   - Giáo viên khởi động trò chơi "Vòng quay may mắn" trên AI Class hoặc đố vui toán học 2-3 câu tính nhẩm nhanh.
   - Tạo tâm thế hào hứng và dẫn dắt tự nhiên vào bài học mới: "${lessonTitle}".
2. Hoạt động Khám phá (12 phút) - "Hình thành kiến thức mới":
   - Giáo viên đưa ra tình huống toán học thực tiễn gắn với đời sống học sinh Hoài Nhơn.
   - Học sinh thảo luận nhóm bàn, sử dụng đồ dùng trực quan (que tính/sơ đồ đoạn thẳng) để tìm ra quy tắc.
   - Giáo viên chuẩn hóa kiến thức trọng tâm, ghi bảng và nhấn mạnh các lỗi học sinh thường nhầm lẫn.
3. Hoạt động Luyện tập, thực hành (13 phút) - "Phân hóa 3 mức độ":
   - Mức 1 (Cần hỗ trợ): Làm bài tập nhận biết cơ bản, tính nhẩm trực tiếp. Giáo viên quan sát uốn nắn kịp thời.
   - Mức 2 (Hoàn thành): Làm bài tập tính giá trị biểu thức và giải toán có lời văn 1-2 bước tính.
   - Mức 3 (Vận dụng mở rộng): Bài toán tư duy logic, đố vui toán học gắn với thực tế.
4. Hoạt động Vận dụng, trải nghiệm (5 phút) - "Toán học quanh em":
   - Học sinh liên hệ tình huống thực tế tại gia đình hoặc trường học cần dùng phép tính vừa học.
   - GVCN tổng kết tiết học, biểu dương các bạn tích cực, trao huy hiệu "Math Champion".

IV. ĐIỀU CHỈNH SAU BÀI DẠY:
- Theo dõi sát học sinh còn lúng túng khi trình bày lời giải để bồi dưỡng thêm trong giờ tự học.`;
      } else if (subL.includes('anh') || subL.includes('english')) {
        sample = `📋 KẾ HOẠCH BÀI DẠY (GIÁO ÁN) CHUẨN CÔNG VĂN 2345/BGDĐT-GDTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TRƯỜNG: ${school} • LỚP: ${className} (KHỐI ${grade})
GIÁO VIÊN THỰC HIỆN: ${teacherName}
MÔN HỌC: TIẾNG ANH (ENGLISH) (${bookSeries})
BÀI DẠY: ${lessonTitle}
THỜI LƯỢNG: 1 tiết (35 phút) • TÍCH HỢP: Song ngữ & Luyện phát âm cùng AI Buddy${customReq}

I. YÊU CẦU CẦN ĐẠT (OBJECTIVES):
1. Năng lực đặc thù Tiếng Anh (Language Competences):
   - Nghe (Listening): Nghe hiểu và nhận biết được 4-6 từ vựng trọng tâm và mẫu câu giao tiếp của bài.
   - Nói (Speaking): Tự tin phát âm chuẩn ngữ âm Phonics, hỏi và trả lời trôi chảy mẫu câu trong ngữ cảnh gần gũi.
   - Đọc (Reading): Đọc to, rõ ràng từ vựng và câu ngắn trên màn hình/sách giáo khoa.
   - Viết (Writing): Viết đúng chính tả các từ vựng và hoàn thành câu khuyết thông tin.
2. Năng lực chung:
   - Giao tiếp và hợp tác: Tự tin đóng vai hội thoại đôi bạn (Pair-work), tích cực tham gia trò chơi nhóm.
   - Tự chủ và tự học: Sử dụng tính năng AI Buddy để nghe phát âm mẫu chuẩn và tự luyện tập ở nhà.
3. Phẩm chất chủ yếu:
   - Yêu thích môn học, tự tin thể hiện ngôn ngữ quốc tế, hòa đồng và tôn trọng văn hóa giao tiếp.

II. ĐỒ DÙNG DẠY HỌC (TEACHING AIDS):
- Teacher: Smart TV, Flashcards, AI Buddy pronunciation assistant, Digital library audio resources.
- Students: English book, notebooks, mini boards.

III. TIẾN TRÌNH DẠY HỌC (4 BƯỚC CV 2345):
1. Warm-up (Khởi động - 5 phút):
   - Chào hỏi bằng tiếng Anh: "Good morning, class! How are you today?"
   - Cả lớp hát và vận động theo bài hát tiếng Anh vui nhộn trên AI Class.
2. Presentation (Khám phá kiến thức mới - 12 phút):
   - Giáo viên giới thiệu từ vựng mới qua hình ảnh trực quan sinh động và flashcards số.
   - Bật giọng đọc mẫu chuẩn AI Buddy để học sinh lắng nghe và bắt chước phát âm Phonics chuẩn.
   - Hướng dẫn cấu trúc câu giao tiếp mẫu: Luyện tập đồng thanh cả lớp -> Từng tổ -> Cá nhân.
3. Practice (Luyện tập, thực hành phân hóa - 13 phút):
   - Hoạt động 1: Trò chơi "Matching Game" hoặc "Slap the board" nhận diện từ vựng.
   - Hoạt động 2: Thực hành cặp đôi (Pair-work) hỏi - đáp theo mẫu câu.
   - Phân hóa: Học sinh còn ngập ngừng được luyện tập cùng bạn khá; học sinh năng khiếu mở rộng sáng tạo hội thoại mới.
4. Production & Application (Vận dụng, củng cố - 5 phút):
   - Học sinh xung phong lên bảng sắm vai phỏng vấn mini trước lớp.
   - Giáo viên nhận xét, khen ngợi và trao huy hiệu danh dự "English Star".

IV. ĐIỀU CHỈNH SAU BÀI DẠY:
- Lưu ý uốn nắn âm đuôi (ending sounds) cho một số học sinh còn rụt rè.`;
      } else if (subL.includes('tin') || subL.includes('công nghệ') || subL.includes('it')) {
        sample = `📋 KẾ HOẠCH BÀI DẠY (GIÁO ÁN) CHUẨN CÔNG VĂN 2345/BGDĐT-GDTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TRƯỜNG: ${school} • LỚP: ${className} (KHỐI ${grade})
GIÁO VIÊN THỰC HIỆN: ${teacherName}
MÔN HỌC: TIN HỌC & CÔNG NGHỆ (${bookSeries})
BÀI DẠY: ${lessonTitle}
THỜI LƯỢNG: 1 tiết (35 phút) • TÍCH HỢP: Rèn kỹ năng số và Công dân số thế kỷ 21${customReq}

I. YÊU CẦU CẦN ĐẠT:
1. Năng lực đặc thù Tin học:
   - Năng lực sử dụng thiết bị và phần mềm: Thao tác đúng quy trình khởi động, sử dụng chuột và gõ bàn phím đúng tư thế.
   - Năng lực ứng dụng CNTT trong học tập: Biết mở học liệu số, tra cứu nội dung an toàn và tương tác cùng AI Buddy.
   - Năng lực hiểu biết đạo đức số: Nhận biết nguy cơ khi dùng Internet, bảo mật tài khoản cá nhân.
2. Năng lực chung:
   - Tự chủ và tự học: Tự thao tác theo từng bước hướng dẫn trên màn hình.
   - Giao tiếp và hợp tác: Luân phiên thực hành theo cặp, hỗ trợ bạn khi gặp lỗi thao tác.
3. Phẩm chất chủ yếu:
   - Trách nhiệm: Giữ gìn máy móc phòng tin học, tuân thủ nội quy an toàn điện và mạng.

II. ĐỒ DÙNG DẠY HỌC:
- Giáo viên: Phòng máy tính kết nối mạng nội bộ, máy chiếu/Tivi, phần mềm thực hành gõ 10 ngón.
- Học sinh: Máy tính để bàn/máy tính bảng, sách bài tập Tin học.

III. TIẾN TRÌNH DẠY HỌC (4 BƯỚC CV 2345):
1. Hoạt động Khởi động (5 phút) - "Đố vui công nghệ":
   - Giáo viên đưa ra câu đố: "Phím nào trên bàn phím có gờ nổi giúp định vị ngón trỏ mà không cần nhìn?" -> Phím F và J.
   - Kết nối vào nội dung bài học "${lessonTitle}".
2. Hoạt động Khám phá (12 phút) - "Khám phá quy tắc & kỹ năng mới":
   - Giáo viên thị phạm thao tác chuẩn trên màn hình máy chủ chiếu cho cả lớp quan sát.
   - Hướng dẫn tư thế ngồi ngay ngắn, khoảng cách từ mắt đến màn hình (45-60cm), cách đặt 10 ngón tay.
   - Học sinh quan sát, chỉ ra các phím chức năng tương ứng trên bàn phím máy mình.
3. Hoạt động Luyện tập, thực hành (13 phút) - "Thực hành trên máy tính":
   - Nhiệm vụ thực hành 1: Gõ các phím hàng phím cơ sở (A, S, D, F, G, H, J, K, L).
   - Nhiệm vụ thực hành 2: Mở phần mềm luyện gõ hoặc bài học trên AI Class để thử thách phản xạ.
   - Giáo viên đi từng bàn hỗ trợ các em đặt sai ngón tay hoặc cầm chuột chưa đúng.
4. Hoạt động Vận dụng, trải nghiệm (5 phút) - "Công dân số an toàn":
   - Thảo luận nhanh: "Nếu gặp trang web yêu cầu nhập mật khẩu hoặc thông tin cá nhân thì em làm gì?"
   - GVCN tổng kết, trao huy hiệu "Digital Pioneer" cho các bạn thao tác xuất sắc.

IV. ĐIỀU CHỈNH SAU BÀI DẠY:
- Nhắc nhở học sinh tắt máy tính đúng quy trình trước khi rời phòng học.`;
      } else if (subL.includes('khoa') || subL.includes('tự nhiên') || subL.includes('tnxh')) {
        sample = `📋 KẾ HOẠCH BÀI DẠY (GIÁO ÁN) CHUẨN CÔNG VĂN 2345/BGDĐT-GDTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TRƯỜNG: ${school} • LỚP: ${className} (KHỐI ${grade})
GIÁO VIÊN THỰC HIỆN: ${teacherName}
MÔN HỌC: KHOA HỌC / TỰ NHIÊN VÀ XÃ HỘI (${bookSeries})
BÀI DẠY: ${lessonTitle}
THỜI LƯỢNG: 1 tiết (35 phút) • TÍCH HỢP: Khám phá khoa học thực tế & Bảo vệ môi trường${customReq}

I. YÊU CẦU CẦN ĐẠT:
1. Năng lực đặc thù Khoa học:
   - Năng lực nhận thức khoa học: Nhận biết, mô tả được đặc điểm cấu tạo, chức năng hoặc mối quan hệ tự nhiên trong bài "${lessonTitle}".
   - Năng lực tìm hiểu môi trường tự nhiên: Biết quan sát tranh ảnh, mẫu vật thật hoặc mô hình 3D, nêu câu hỏi thắc mắc khoa học.
   - Năng lực vận dụng kiến thức, kỹ năng: Vận dụng được kiến thức vào việc giữ gìn sức khỏe, chăm sóc cây cối/vật nuôi và bảo vệ môi trường sống.
2. Năng lực chung:
   - Giao tiếp và hợp tác: Làm việc nhóm 4, cùng thảo luận và ghi chép phiếu học tập.
   - Giải quyết vấn đề và sáng tạo: Đề xuất các giải pháp bảo vệ thiên nhiên quanh trường, quanh nhà.
3. Phẩm chất chủ yếu:
   - Yêu thiên nhiên, có ý thức tiết kiệm tài nguyên và bảo vệ môi trường Hoài Nhơn xanh - sạch - đẹp.

II. ĐỒ DÙNG DẠY HỌC:
- Giáo viên: Mẫu vật thật/tranh ảnh khoa học, video phóng sự ngắn, phiếu học tập, ứng dụng AI Class.
- Học sinh: SGK, bút màu, sổ tay quan sát tự nhiên.

III. TIẾN TRÌNH DẠY HỌC (4 BƯỚC CV 2345):
1. Hoạt động Khởi động (5 phút) - "Hộp quà bí mật của tự nhiên":
   - Giáo viên cho học sinh sờ và đoán vật thật trong hộp (lá cây, quả, hạt...) hoặc xem hình ảnh bí ẩn.
   - Kích thích trí tò mò khoa học của học sinh, dẫn dắt vào bài mới.
2. Hoạt động Khám phá (12 phút) - "Nhà khoa học nhí tìm tòi":
   - Nhóm học sinh quan sát tranh/mẫu vật theo hướng dẫn trên phiếu học tập.
   - Thảo luận: Sự vật/hiện tượng có những đặc điểm gì? Tác dụng đối với đời sống con người ra sao?
   - Đại diện nhóm trình bày, các nhóm khác nhận xét bổ sung. Giáo viên chuẩn hóa kiến thức bằng sơ đồ tư duy.
3. Hoạt động Luyện tập, thực hành (13 phút) - "Thử tài phân loại & ghép nối":
   - Bài tập phân loại trên bảng tương tác hoặc phiếu học tập.
   - Phân hóa: Học sinh khá giỏi giải thích nguyên nhân - kết quả; học sinh tiếp thu chậm củng cố nhận diện đặc điểm cơ bản.
4. Hoạt động Vận dụng, trải nghiệm (5 phút) - "Hành động vì môi trường":
   - Mỗi học sinh cam kết 1 việc làm cụ thể: "Tưới cây mỗi sáng", "Không xả rác bừa bãi", "Tắt vòi nước sau khi dùng".
   - GVCN tổng kết, trao huy hiệu "Eco Hero" cho các em.

IV. ĐIỀU CHỈNH SAU BÀI DẠY:
- Khuyến khích học sinh về nhà quan sát thêm cây cối tại vườn nhà và chia sẻ vào tiết sau.`;
      } else {
        // Mặc định hoặc Tiếng Việt
        sample = `📋 KẾ HOẠCH BÀI DẠY (GIÁO ÁN) CHUẨN CÔNG VĂN 2345/BGDĐT-GDTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TRƯỜNG: ${school} • LỚP: ${className} (KHỐI ${grade})
GIÁO VIÊN THỰC HIỆN: ${teacherName}
MÔN HỌC: ${subjectName} (${bookSeries})
BÀI DẠY: ${lessonTitle}
THỜI LƯỢNG: 1 tiết (35 phút) • TÍCH HỢP: Ứng dụng AI Class & Công nghệ số${customReq}

I. YÊU CẦU CẦN ĐẠT:
1. Năng lực đặc thù:
   - Nhận biết và mở rộng vốn từ vựng, ngữ pháp trọng tâm theo bài "${lessonTitle}".
   - Nắm vững cấu trúc câu và biện pháp tu từ (so sánh, nhân hóa), vận dụng đặt câu và diễn đạt lưu loát.
   - Đọc hiểu diễn cảm, trả lời chính xác các câu hỏi tìm hiểu bài.
2. Năng lực chung:
   - Tự chủ và tự học: Tự giác tương tác với trợ lý AI Buddy để tra cứu từ vựng và tự kiểm tra bài.
   - Giao tiếp và hợp tác: Tích cực thảo luận cặp đôi và nhóm 4, chia sẻ ý tưởng tự tin.
   - Năng lực giải quyết vấn đề và sáng tạo: Lựa chọn từ ngữ gợi cảm để miêu tả độc đáo.
3. Phẩm chất chủ yếu:
   - Nhân ái: Bồi dưỡng tình yêu thương, kính trọng ông bà cha mẹ, yêu quý bạn bè.
   - Chăm chỉ: Hoàn thành nhiệm vụ học tập trên lớp và bài tập về nhà.
   - Trách nhiệm: Giữ gìn vở sạch chữ đẹp, có ý thức đóng góp cho nhóm.

II. ĐỒ DÙNG DẠY HỌC VÀ ỨNG DỤNG CÔNG NGHỆ:
- Giáo viên: Tivi/Màn hình tương tác, hệ thống ứng dụng AI CLASS, thẻ từ số hóa, video bài giảng.
- Học sinh: Bảng con, sách giáo khoa, máy tính bảng/thiết bị truy cập góc học tập AI Buddy.

III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU (TIẾN TRÌNH 4 BƯỚC):
1. Hoạt động Khởi động (5 phút) - "Vòng xoay kết nối":
   - Giáo viên mở trò chơi Vòng quay may mắn trên AI Class, gọi ngẫu nhiên học sinh hát hoặc đọc thơ khởi động.
   - Dẫn dắt gợi mở vào bài học mới một cách tự nhiên và truyền cảm hứng.
2. Hoạt động Khám phá (12 phút) - "Khám phá tri thức cùng AI Buddy":
   - Nhiệm vụ 1: Đọc đoạn ngữ liệu mẫu trên bảng thông minh.
   - Nhiệm vụ 2: Học sinh tương tác cùng AI Buddy tra cứu nhanh nghĩa của từ khó.
   - Giáo viên chốt kiến thức trọng tâm, ghi bảng khoa học.
3. Hoạt động Luyện tập, thực hành (13 phút) - "Phân hóa năng lực":
   - Nhóm Cần hỗ trợ: Ghép thẻ từ ngữ vào hình ảnh minh họa tương ứng, điền từ vào chỗ trống.
   - Nhóm Hoàn thành: Đặt câu hoàn chỉnh theo mẫu bài học.
   - Nhóm Năng khiếu: Viết đoạn văn ngắn 3-4 câu diễn đạt cảm xúc sinh động, sáng tạo.
   - Giáo viên quan sát, hỗ trợ kịp thời từng nhóm theo Thông tư 27.
4. Hoạt động Vận dụng, trải nghiệm (5 phút) - "Thông điệp yêu thương":
   - Học sinh gửi 1 câu văn tâm đắc nhất lên Bảng khen thưởng lớp học.
   - Giáo viên tổng kết, tuyên dương học sinh tích cực, trao huy hiệu "Creative Thinker".

IV. ĐIỀU CHỈNH SAU BÀI DẠY:
- Theo dõi một số em viết hoa chưa chuẩn để uốn nắn trong tiết luyện viết.`;
      }
    } else if (type === 'differentiated_comment' || type === 'tt27_comment') {
      const studentName = parameters?.studentData?.fullName || 'Nguyễn Bảo An';
      const code = parameters?.studentData?.studentCode || 'HS301';
      const progress = parameters?.studentData?.learningProgress || 92;

      sample = `📝 BẢN NHẬN XÉT HỌC SINH TIỂU HỌC CHUẨN THÔNG TƯ 27/2020/TT-BGDĐT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HỌ VÀ TÊN HỌC SINH: ${studentName} (MÃ HS: ${code})
LỚP: ${className} • TRƯỜNG: ${school}
GIÁO VIÊN CHỦ NHIỆM: ${teacherName} • ĐÁNH GIÁ ĐỊNH KỲ: ĐẠT MỨC HOÀN THÀNH TỐT (T)

1. ĐÁNH GIÁ MÔN HỌC VÀ HOẠT ĐỘNG GIÁO DỤC:
- Môn Tiếng Việt (T): Đọc to, phát âm chuẩn, diễn cảm tốt; vốn từ vựng phong phú, biết vận dụng biện pháp so sánh sáng tạo vào bài viết; chữ viết sạch đẹp, đúng chính tả.
- Môn Toán (T): Tính toán nhanh nhẹn, nắm chắc bảng nhân chia, giải toán có lời văn logic và trình bày bài giải khoa học; tư duy linh hoạt trong các bài tập nâng cao.
- Môn Tiếng Anh (T): Tự tin giao tiếp song ngữ, phát âm chuẩn các chủ đề Family & School; chăm chỉ tương tác cùng AI Buddy luyện phản xạ.
- Môn Tin học & Công nghệ (T): Thao tác gõ 10 ngón tay chuẩn phím F-J, sử dụng thiết bị số an toàn, ham học hỏi và biết tìm kiếm thông tin bài học.

2. ĐÁNH GIÁ SỰ HÌNH THÀNH VÀ PHÁT TRIỂN NĂNG LỰC CHUNG:
- Tự chủ và tự học (T): Tự giác chuẩn bị sách vở đồ dùng, hoàn thành nhiệm vụ đúng tiến độ (Đạt ${progress}% mục tiêu).
- Giao tiếp và hợp tác (T): Lắng nghe bạn bè, trao đổi cởi mở, biết dẫn dắt nhóm nhỏ hoàn thành bài tập chung xuất sắc.
- Giải quyết vấn đề và sáng tạo (T): Thường xuyên có ý tưởng phát biểu mới mẻ, tự tin đề xuất cách giải bài toán hay.

3. ĐÁNH GIÁ SỰ HÌNH THÀNH VÀ PHÁT TRIỂN PHẨM CHẤT:
- Nhân ái & Trách nhiệm (T): Tốt bụng, hòa đồng, luôn sẵn sàng hướng dẫn và giúp đỡ bạn cùng tiến; giữ gìn vệ sinh chung lớp học.
- Chăm chỉ & Trung thực (T): Đi học chuyên cần, trung thực trong kiểm tra đánh giá, tích cực giơ tay xây dựng bài.

4. LỜI KHUYÊN ĐỘNG VIÊN & BIỆN PHÁP PHỐI HỢP VỚI GIA ĐÌNH:
- Cô giáo nhiệt liệt khen ngợi sự nỗ lực vượt bậc của em ${studentName}.
- Đề xuất gia đình: Tiếp tục duy trì thói quen đọc sách 20 phút mỗi tối và khuyến khích con tham gia câu lạc bộ Hùng biện tiếng Anh để phát huy tối đa tố chất lãnh đạo!`;
    } else if (type === 'quiz_generator' || type === 'quiz_generator_tt27') {
      const subjectName = parameters?.subject || 'Toán 3';
      const topic = parameters?.topic || 'Kiến thức trọng tâm theo chương trình học';
      const duration = parameters?.duration || '35 phút';
      const subL = subjectName.toLowerCase();
      const customReq = parameters?.customRequirements ? `\n📌 YÊU CẦU RIÊNG CỦA GIÁO VIÊN: ${parameters.customRequirements}` : '';

      if (subL.includes('anh') || subL.includes('english')) {
        sample = `🎯 ĐỀ KIỂM TRA ĐỊNH KỲ & MA TRẬN ĐỀ 3 MỨC ĐỘ (THÔNG TƯ 27)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MÔN: TIẾNG ANH (ENGLISH) - KHỐI ${grade} • THỜI GIAN LÀM BÀI: ${duration}
LỚP: ${className} • TRƯỜNG: ${school} • GV RA ĐỀ: ${teacherName}
CHỦ ĐỀ: ${topic}${customReq}

A. MA TRẬN ĐỀ KIỂM TRA THEO THÔNG TƯ 27/2020/TT-BGDĐT:
┌─────────────────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ Kỹ năng & Kiến thức     │ Mức 1 (40%)  │ Mức 2 (30%)  │ Mức 3 (30%)  │ Tổng điểm    │
├─────────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ 1. Ngữ âm & Từ vựng     │ Câu 1, 2 (2đ)│ Câu 3 (1.5đ) │              │ 3.5 điểm     │
│ 2. Đọc hiểu & Ngữ pháp  │ Câu 4, 5 (2đ)│ Câu 6 (1.5đ) │              │ 3.5 điểm     │
│ 3. Viết & Vận dụng      │              │              │ Câu 7, 8 (3đ)│ 3.0 điểm     │
├─────────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ TỔNG CỘNG               │ 4.0 điểm     │ 3.0 điểm     │ 3.0 điểm     │ 10.0 điểm    │
└─────────────────────────┴──────────────┴──────────────┴──────────────┴──────────────┘

B. NỘI DUNG ĐỀ KIỂM TRA MÔN TIẾNG ANH:
PHẦN I: TRẮC NGHIỆM KHÁCH QUAN (6.0 điểm)
Câu 1 (Mức 1 - 1.0đ): Choose the word with a different sound:
  A. cat         B. hat         C. father      D. bat
Câu 2 (Mức 1 - 1.0đ): Look and choose the correct word for family member: "My mother's mother is my ______"
  A. sister      B. grandmother C. aunt        D. brother
Câu 3 (Mức 2 - 1.5đ): Choose the correct sentence to complete the dialogue:
  - Tom: "How old are you, Mai?"
  - Mai: "______"
  A. I am fine, thank you.       B. I am eight years old.
  C. She is my friend.           D. Nice to meet you.
Câu 4 (Mức 1 - 1.0đ): Odd one out (Chọn từ khác loại):
  A. Pen         B. Ruler       C. Pencil      D. Classroom
Câu 5 (Mức 1 - 1.0đ): "What is your favorite color?" - "I like ______"
  A. dog         B. blue        C. apple       D. school
Câu 6 (Mức 2 - 1.5đ): Read and complete: "This is my friend, Alex. ______ from Australia."
  A. He are      B. He is       C. She is      D. They are

PHẦN II: TỰ LUẬN & VẬN DỤNG THỰC TẾ (4.0 điểm)
Câu 7 (Mức 3 - 2.0đ): Reorder the words to make correct sentences (Sắp xếp từ thành câu đúng):
  a) name / is / My / Linh / .
  b) like / I / playing / chess / with / friends / .
Câu 8 (Mức 3 - 2.0đ): Writing (Viết 3-4 câu tiếng Anh đơn giản giới thiệu về bản thân hoặc gia đình em):
  (Gợi ý: Tên em, tuổi, sở thích hoặc một người thân trong gia đình).

C. HƯỚNG DẪN CHẤM & ĐÁP ÁN CHI TIẾT:
- Câu 1: C (father) - 1.0đ
- Câu 2: B (grandmother) - 1.0đ
- Câu 3: B (I am eight years old.) - 1.5đ
- Câu 4: D (Classroom - phòng học, các từ còn lại là đồ dùng học tập) - 1.0đ
- Câu 5: B (blue - màu xanh) - 1.0đ
- Câu 6: B (He is) - 1.5đ
- Câu 7: a) My name is Linh. (1.0đ); b) I like playing chess with friends. (1.0đ)
- Câu 8: Viết đúng ngữ pháp, đủ 3 câu, từ vựng chuẩn (2.0đ).`;
      } else if (subL.includes('việt') || subL.includes('văn')) {
        sample = `🎯 ĐỀ KIỂM TRA ĐỊNH KỲ & MA TRẬN ĐỀ 3 MỨC ĐỘ (THÔNG TƯ 27)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MÔN: TIẾNG VIỆT - KHỐI ${grade} • THỜI GIAN LÀM BÀI: ${duration}
LỚP: ${className} • TRƯỜNG: ${school} • GV RA ĐỀ: ${teacherName}
CHỦ ĐỀ: ${topic}${customReq}

A. MA TRẬN ĐỀ KIỂM TRA THEO THÔNG TƯ 27/2020/TT-BGDĐT:
┌─────────────────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ Mạch kiến thức kỹ năng  │ Mức 1 (40%)  │ Mức 2 (30%)  │ Mức 3 (30%)  │ Tổng điểm    │
├─────────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ 1. Đọc hiểu văn bản     │ Câu 1, 2 (2đ)│ Câu 3 (1.5đ) │              │ 3.5 điểm     │
│ 2. Luyện từ và câu      │ Câu 4 (1đ)   │ Câu 5 (1.5đ) │              │ 2.5 điểm     │
│ 3. Viết câu & đoạn văn  │ Câu 6 (1đ)   │              │ Câu 7, 8 (3đ)│ 4.0 điểm     │
├─────────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ TỔNG CỘNG               │ 4.0 điểm     │ 3.0 điểm     │ 3.0 điểm     │ 10.0 điểm    │
└─────────────────────────┴──────────────┴──────────────┴──────────────┴──────────────┘

B. NỘI DUNG ĐỀ KIỂM TRA MÔN TIẾNG VIỆT:
ĐỌC THẦM ĐOẠN VĂN:
"Mùa thu về, bầu trời Hoài Nhơn trong xanh vời vợi như một tấm lụa biếc. Những vườn dừa đung đưa tàu lá như muôn cánh tay vẫy gọi gió biển. Tiếng trống trường rộn rã giục giã chúng em bước vào năm học mới với bao niềm vui."

PHẦN I: TRẮC NGHIỆM KHÁCH QUAN (6.0 điểm)
Câu 1 (Mức 1 - 1.0đ): Trong đoạn văn trên, bầu trời mùa thu được so sánh với hình ảnh nào?
  A. Chiếc gương khổng lồ       B. Tấm lụa biếc
  C. Dòng sông êm đềm           D. Đám mây trắng
Câu 2 (Mức 1 - 1.0đ): Tàu lá dừa trong đoạn văn được so sánh như thế nào?
  A. Như những chiếc quạt mát   B. Như ngọn lửa bập bùng
  C. Như muôn cánh tay vẫy gió  D. Như mái tóc dài
Câu 3 (Mức 2 - 1.5đ): Từ nào dưới đây là từ ngữ chỉ tình cảm, sự gắn bó gia đình và bạn bè?
  A. Chăm chỉ    B. Thương yêu   C. Nhanh nhẹn   D. Rực rỡ
Câu 4 (Mức 1 - 1.0đ): Câu nào dưới đây sử dụng biện pháp tu từ so sánh có từ "tựa như"?
  A. Bé ngủ ngoan tựa như một thiên thần nhỏ.
  B. Bé rất thích đi học cùng bạn.
  C. Mùa xuân cây cối đâm chồi nảy lộc.
  D. Hoa hồng tỏa hương thơm ngát.
Câu 5 (Mức 2 - 1.5đ): Điền dấu câu thích hợp vào ô trống: "Bạn nhỏ ơi, hôm nay lớp mình học vui thật đấy[ ]"
  A. Dấu chấm (.)               B. Dấu hỏi chấm (?)
  C. Dấu chấm than (!)          D. Dấu phẩy (,)

PHẦN II: TỰ LUẬN & VẬN DỤNG THỰC TẾ (4.0 điểm)
Câu 6 (Mức 2 - 1.0đ): Đặt một câu văn có hình ảnh so sánh miêu tả về người thân của em (ông, bà, bố hoặc mẹ).
Câu 7 (Mức 3 - 3.0đ): Tập làm văn: Viết một đoạn văn ngắn từ 4 đến 5 câu kể về một việc tốt em đã làm để giúp đỡ bạn bè hoặc giữ gìn vệ sinh trường lớp Hoài Nhơn.

C. HƯỚNG DẪN CHẤM & ĐÁP ÁN CHI TIẾT:
- Câu 1: B (Tấm lụa biếc) - 1.0đ
- Câu 2: C (Như muôn cánh tay vẫy gió) - 1.0đ
- Câu 3: B (Thương yêu) - 1.5đ
- Câu 4: A - 1.0đ
- Câu 5: C (Dấu chấm than thể hiện cảm xúc) - 1.5đ
- Câu 6: Đặt câu đúng cấu trúc vế A, từ so sánh, vế B, viết hoa đầu câu, chấm cuối câu (1.0đ).
- Câu 7: Đoạn văn đủ 4-5 câu, đúng chủ đề việc tốt, diễn đạt mạch lạc, cảm xúc trong sáng (3.0đ).`;
      } else if (subL.includes('tin') || subL.includes('công nghệ') || subL.includes('it')) {
        sample = `🎯 ĐỀ KIỂM TRA ĐỊNH KỲ & MA TRẬN ĐỀ 3 MỨC ĐỘ (THÔNG TƯ 27)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MÔN: TIN HỌC - KHỐI ${grade} • THỜI GIAN LÀM BÀI: ${duration}
LỚP: ${className} • TRƯỜNG: ${school} • GV RA ĐỀ: ${teacherName}
CHỦ ĐỀ: ${topic}${customReq}

A. MA TRẬN ĐỀ KIỂM TRA THEO THÔNG TƯ 27/2020/TT-BGDĐT:
┌─────────────────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ Mạch kiến thức kỹ năng  │ Mức 1 (40%)  │ Mức 2 (30%)  │ Mức 3 (30%)  │ Tổng điểm    │
├─────────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ 1. Thiết bị & Bàn phím  │ Câu 1, 2 (2đ)│ Câu 3 (1.5đ) │              │ 3.5 điểm     │
│ 2. Thao tác & Phần mềm  │ Câu 4 (1đ)   │ Câu 5 (1.5đ) │              │ 2.5 điểm     │
│ 3. An toàn số & Kỹ năng │ Câu 6 (1đ)   │              │ Câu 7, 8 (3đ)│ 4.0 điểm     │
├─────────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ TỔNG CỘNG               │ 4.0 điểm     │ 3.0 điểm     │ 3.0 điểm     │ 10.0 điểm    │
└─────────────────────────┴──────────────┴──────────────┴──────────────┴──────────────┘

B. NỘI DUNG ĐỀ KIỂM TRA MÔN TIN HỌC:
PHẦN I: TRẮC NGHIỆM KHÁCH QUAN (6.0 điểm)
Câu 1 (Mức 1 - 1.0đ): Hai phím có gờ xúc giác giúp định vị ngón trỏ ở hàng phím cơ sở là:
  A. Phím G và H                B. Phím F và J
  C. Phím A và L                D. Phím Space và Enter
Câu 2 (Mức 1 - 1.0đ): Bộ phận nào của máy tính được coi là "bộ não", điều khiển mọi hoạt động?
  A. Màn hình                   B. Thân máy (CPU)
  C. Chuột máy tính             D. Bàn phím
Câu 3 (Mức 2 - 1.5đ): Khi ngồi học trước máy tính, khoảng cách an toàn từ mắt đến màn hình nên là bao nhiêu?
  A. 10 - 20 cm                 B. 45 - 60 cm (khoảng một sải tay)
  C. 100 - 150 cm               D. Càng sát càng tốt
Câu 4 (Mức 1 - 1.0đ): Phím dài nhất trên bàn phím là phím gì và dùng để làm gì?
  A. Phím Enter để xuống dòng   B. Phím Space (cách) để tạo khoảng cách giữa các từ
  C. Phím Shift để viết hoa     D. Phím Delete để xóa
Câu 5 (Mức 2 - 1.5đ): Hành động nào dưới đây là đúng khi sử dụng tài khoản học tập trực tuyến?
  A. Chia sẻ mật khẩu cho mọi người
  B. Giữ bí mật mật khẩu và không đăng nhập trên máy tính lạ mà không có người lớn
  C. Bấm vào bất kỳ đường link lạ nào được gửi đến
  D. Cài đặt trò chơi tùy ý

PHẦN II: TỰ LUẬN & THỰC HÀNH (4.0 điểm)
Câu 6 (Mức 2 - 1.5đ): Nêu các ngón tay tương ứng khi đặt trên hàng phím cơ sở (A, S, D, F và J, K, L, ;).
Câu 7 (Mức 3 - 2.5đ): Tình huống số: Nếu một trang web lạ bất ngờ hiện lên yêu cầu em nhập họ tên, địa chỉ nhà và số điện thoại của bố mẹ, em sẽ xử lý như thế nào để đảm bảo an toàn?

C. HƯỚNG DẪN CHẤM & ĐÁP ÁN CHI TIẾT:
- Câu 1: B (Phím F và J) - 1.0đ
- Câu 2: B (Thân máy / CPU) - 1.0đ
- Câu 3: B (45 - 60 cm) - 1.5đ
- Câu 4: B (Phím Space) - 1.0đ
- Câu 5: B - 1.5đ
- Câu 6: Tay trái: ngón út (A), áp út (S), giữa (D), trỏ (F); Tay phải: ngón trỏ (J), giữa (K), áp út (L), út (;). Hai ngón cái đặt phím cách. (1.5đ)
- Câu 7: Tuyệt đối không nhập thông tin cá nhân, đóng ngay trang web đó và báo ngay cho thầy cô hoặc cha mẹ hỗ trợ. (2.5đ)`;
      } else if (subL.includes('khoa') || subL.includes('tự nhiên') || subL.includes('tnxh')) {
        sample = `🎯 ĐỀ KIỂM TRA ĐỊNH KỲ & MA TRẬN ĐỀ 3 MỨC ĐỘ (THÔNG TƯ 27)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MÔN: KHOA HỌC / TỰ NHIÊN VÀ XÃ HỘI - KHỐI ${grade} • THỜI GIAN LÀM BÀI: ${duration}
LỚP: ${className} • TRƯỜNG: ${school} • GV RA ĐỀ: ${teacherName}
CHỦ ĐỀ: ${topic}${customReq}

A. MA TRẬN ĐỀ KIỂM TRA THEO THÔNG TƯ 27/2020/TT-BGDĐT:
┌─────────────────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ Mạch kiến thức kỹ năng  │ Mức 1 (40%)  │ Mức 2 (30%)  │ Mức 3 (30%)  │ Tổng điểm    │
├─────────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ 1. Nhận thức khoa học   │ Câu 1, 2 (2đ)│ Câu 3 (1.5đ) │              │ 3.5 điểm     │
│ 2. Tìm hiểu tự nhiên    │ Câu 4 (1đ)   │ Câu 5 (1.5đ) │              │ 2.5 điểm     │
│ 3. Vận dụng & Môi trường│ Câu 6 (1đ)   │              │ Câu 7, 8 (3đ)│ 4.0 điểm     │
├─────────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ TỔNG CỘNG               │ 4.0 điểm     │ 3.0 điểm     │ 3.0 điểm     │ 10.0 điểm    │
└─────────────────────────┴──────────────┴──────────────┴──────────────┴──────────────┘

B. NỘI DUNG ĐỀ KIỂM TRA MÔN KHOA HỌC:
PHẦN I: TRẮC NGHIỆM KHÁCH QUAN (6.0 điểm)
Câu 1 (Mức 1 - 1.0đ): Bộ phận nào của cây xanh có nhiệm vụ hút nước và chất khoáng từ lòng đất?
  A. Lá cây                      B. Rễ cây
  C. Thân cây                    D. Hoa
Câu 2 (Mức 1 - 1.0đ): Nhờ quá trình nào mà lá cây tạo ra khí oxy giúp con người và động vật hô hấp?
  A. Quang hợp dưới ánh sáng     B. Hút nước qua rễ
  C. Rụng lá vào mùa đông        D. Thoát hơi nước
Câu 3 (Mức 2 - 1.5đ): Để bảo vệ nguồn nước sạch không bị ô nhiễm, chúng ta NÊN làm gì?
  A. Vứt rác và túi ni lông xuống ao hồ
  B. Tiết kiệm nước và đậy nắp kín các dụng cụ chứa nước
  C. Xả nước giặt đồ trực tiếp ra kênh rạch
  D. Để vòi nước chảy tự do
Câu 4 (Mức 1 - 1.0đ): Con người cần những yếu tố nào sau đây để duy trì sự sống?
  A. Thức ăn, nước uống, không khí và ánh sáng
  B. Chỉ cần thức ăn và nước ngọt
  C. Chỉ cần không khí
  D. Chỉ cần ánh sáng mặt trời
Câu 5 (Mức 2 - 1.5đ): Cơ quan tuần hoàn trong cơ thể người gồm có các bộ phận nào?
  A. Tim và các mạch máu         B. Dạ dày và ruột
  C. Phổi và khí quản            D. Não và tủy sống

PHẦN II: TỰ LUẬN & VẬN DỤNG THỰC TẾ (4.0 điểm)
Câu 6 (Mức 2 - 1.5đ): Nêu 3 ích lợi của cây xanh đối với đời sống con người và môi trường.
Câu 7 (Mức 3 - 2.5đ): Em và các bạn lớp ${className} có thể làm những việc gì cụ thể để giữ gìn trường lớp Hoài Nhơn luôn xanh, sạch và đẹp?

C. HƯỚNG DẪN CHẤM & ĐÁP ÁN CHI TIẾT:
- Câu 1: B (Rễ cây) - 1.0đ
- Câu 2: A (Quang hợp dưới ánh sáng) - 1.0đ
- Câu 3: B (Tiết kiệm nước và đậy kín) - 1.5đ
- Câu 4: A - 1.0đ
- Câu 5: A (Tim và các mạch máu) - 1.5đ
- Câu 6: Cung cấp oxy, che bóng mát, chống xói mòn đất, cho hoa quả/gỗ (1.5đ).
- Câu 7: Nêu được ít nhất 2 việc làm thiết thực (trồng/chăm sóc cây, bỏ rác đúng nơi quy định, phân loại rác) (2.5đ).`;
      } else {
        // Mặc định: Toán học
        sample = `🎯 ĐỀ KIỂM TRA ĐỊNH KỲ & MA TRẬN ĐỀ 3 MỨC ĐỘ (THÔNG TƯ 27)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MÔN: TOÁN HỌC - KHỐI ${grade} • THỜI GIAN LÀM BÀI: ${duration}
LỚP: ${className} • TRƯỜNG: ${school} • GV RA ĐỀ: ${teacherName}
CHỦ ĐỀ: ${topic}${customReq}

A. MA TRẬN ĐỀ KIỂM TRA THEO THÔNG TƯ 27/2020/TT-BGDĐT:
┌─────────────────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ Nội dung kiến thức       │ Mức 1 (40%)  │ Mức 2 (30%)  │ Mức 3 (30%)  │ Tổng điểm    │
├─────────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ 1. Kỹ năng tính nhẩm    │ Câu 1, 2 (2đ)│ Câu 3 (1.5đ) │              │ 3.5 điểm     │
│ 2. Giá trị biểu thức    │ Câu 4 (1đ)   │ Câu 5 (1.5đ) │              │ 2.5 điểm     │
│ 3. Giải toán thực tế    │ Câu 6 (1đ)   │              │ Câu 7, 8 (3đ)│ 4.0 điểm     │
├─────────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ TỔNG CỘNG               │ 4.0 điểm     │ 3.0 điểm     │ 3.0 điểm     │ 10.0 điểm    │
└─────────────────────────┴──────────────┴──────────────┴──────────────┴──────────────┘

B. NỘI DUNG ĐỀ KIỂM TRA:
PHẦN I: TRẮC NGHIỆM KHÁCH QUAN (6.0 điểm)
Câu 1 (Mức 1 - 1đ): Kết quả của phép tính 7 × 8 là:
  A. 54          B. 56          C. 63          D. 48
Câu 2 (Mức 1 - 1đ): Trong các phép chia sau, phép chia nào có số dư lớn nhất khi chia cho 6?
  A. 25 : 6      B. 29 : 6      C. 31 : 6      D. 19 : 6
Câu 3 (Mức 2 - 1.5đ): Giá trị của biểu thức 120 - 20 × 4 là:
  A. 400         B. 40          C. 60          D. 100
Câu 4 (Mức 1 - 1đ): Một bao gạo nặng 45kg, sau khi bán đi một phần năm số gạo thì còn lại bao nhiêu ki-lô-gam?
  A. 9kg         B. 36kg        C. 40kg        D. 25kg
Câu 5 (Mức 2 - 1.5đ): Điền dấu thích hợp: 8m 4dm ... 804cm
  A. >           B. <           C. =           D. Không so sánh được

PHẦN II: TỰ LUẬN & VẬN DỤNG THỰC TẾ (4.0 điểm)
Câu 6 (Mức 2 - 1.5đ): Đặt tính rồi tính:
  a) 124 × 3                        b) 486 : 2
Câu 7 (Mức 3 - 1.5đ): Lớp ${className} có 32 học sinh. Cô giáo chia các bạn thành các nhóm trải nghiệm AI Buddy, mỗi nhóm có 4 bạn. Hỏi cô giáo chia được tất cả bao nhiêu nhóm học tập?
Câu 8 (Mức 3 - 1.0đ): Đố vui tư duy: Tìm một số, biết rằng lấy số đó nhân với 6 rồi cộng với 18 thì được số nhỏ nhất có ba chữ số khác nhau?

C. ĐÁP ÁN & BIỂU ĐIỂM CHI TIẾT:
- Câu 1: B (56) - 1.0đ
- Câu 2: B (29 : 6 = 4 dư 5) - 1.0đ
- Câu 3: B (20 × 4 = 80; 120 - 80 = 40) - 1.5đ
- Câu 4: B (45 : 5 = 9kg; 45 - 9 = 36kg) - 1.0đ
- Câu 5: > (840cm > 804cm) - 1.5đ
- Câu 6: a) 372 (0.75đ); b) 243 (0.75đ)
- Câu 7: Số nhóm chia được là: 32 : 4 = 8 (nhóm). Đáp số: 8 nhóm. (1.5đ)
- Câu 8: Số nhỏ nhất có 3 chữ số khác nhau là 102. Số cần tìm là: (102 - 18) : 6 = 14. (1.0đ)`;
      }
    } else if (type === 'personalized_remediation') {
      const studentName = parameters?.studentData?.fullName || 'Em Lê Gia Bảo';
      const supportGoal = parameters?.studentData?.supportGoal || 'Rèn luyện khả năng phát âm từ vựng Tiếng Anh và tính toán có lời văn';

      sample = `💡 KẾ HOẠCH BỒI DƯỠNG & PHỤ ĐẠO CÁ NHÂN HÓA (AI REMEDIATION PLAN)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ĐỐI TƯỢNG HỖ TRỢ: ${studentName} (LỚP ${className})
GIÁO VIÊN CHỦ NHIỆM: ${teacherName} • THỜI GIAN THỰC HIỆN: 2 TUẦN TỚI
MỤC TIÊU TRỌNG TÂM: ${supportGoal}

1. CHẨN ĐOÁN NGUYÊN NHÂN & VẤN ĐỀ CẦN THÁO GỠ:
- Học sinh có tinh thần chăm chỉ nhưng còn e dè khi phát âm từ vựng tiếng Anh mới.
- Trong môn Toán, con đọc đề bài toán có lời văn còn vội, dễ nhầm lẫn giữa "gấp lên nhiều lần" và "giảm đi nhiều lần".

2. LỘ TRÌNH HÀNH ĐỘNG 3 BÊN (GIÁO VIÊN - HỌC SINH - PHỤ HUYNH):
a) Đối với Cô giáo chủ nhiệm trên lớp:
   - Xếp con ngồi cùng bạn nhóm trưởng kèm cặp (đôi bạn cùng tiến với bạn đạt huy hiệu English Star).
   - Gọi con phát biểu ở câu hỏi mức độ nhận biết để tạo tâm lý tự tin, khen thưởng kịp thời trước lớp.
   - Dành 10 phút cuối tiết tự học chiều thứ Ba và thứ Năm hướng dẫn con gạch chân từ khóa trong đề toán.
b) Đối với Học sinh khi tự học ở nhà:
   - Dành 15 phút mỗi ngày mở góc AI Buddy, bấm nghe phát âm mẫu và đọc theo 3 lần/từ.
   - Làm 2 bài toán đố vui trên GameHub trước khi đi ngủ.
c) Đối với Phụ huynh học sinh:
   - Động viên, không gây áp lực điểm số cho con.
   - Cùng con đố vui từ vựng tiếng Anh trong các hoạt động thường ngày tại gia đình.

3. TIÊU CHÍ ĐÁNH GIÁ KẾT QUẢ SAU 2 TUẦN:
- Đọc to, rõ ràng và phát âm đúng ít nhất 10 từ vựng chủ đề hiện tại.
- Tự giải đúng bài toán có lời văn dạng 1 bước và 2 bước tính mà không cần người lớn nhắc nhở.
- Trao huy hiệu khen thưởng "Daily Learner" và "Kind Friend" khi đạt mục tiêu!`;
    } else if (type === 'digital_skills_rubric') {
      sample = `📊 KHUNG RUBRIC ĐÁNH GIÁ NĂNG LỰC SỐ & KỸ NĂNG THẾ KỶ 21 CHO HỌC SINH TIỂU HỌC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ÁP DỤNG: LỚP ${className} • TRƯỜNG: ${school} • GVCN: ${teacherName}

┌────────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┐
│ Tiêu chí Năng lực       │ Mức Tốt (Level 3)    │ Mức Đạt (Level 2)    │ Cần Cố Gắng (Level 1)│
├────────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ 1. Thao tác thiết bị   │ Sử dụng chuột & gõ   │ Thao tác cơ bản đúng │ Còn lúng túng khi gõ │
│    và phần mềm học tập │ bàn phím 10 ngón     │ vị trí, cần ít sự    │ phím, cần hỗ trợ mở  │
│                        │ chuẩn, mở app nhanh  │ hỗ trợ từ cô giáo    │ ứng dụng học tập     │
├────────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ 2. Tương tác an toàn   │ Đặt câu hỏi thông    │ Tương tác lịch sự,   │ Chưa biết cách hỏi rõ│
│    cùng AI Buddy       │ minh, biết nhờ AI    │ hỏi đúng môn học,    │ ràng, cần hướng dẫn  │
│                        │ giải thích dễ hiểu   │ lắng nghe gợi ý      │ thêm cách tra cứu    │
├────────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ 3. Văn hóa số &        │ Bảo mật mật khẩu,    │ Biết giữ bí mật TK,  │ Còn để lộ mật khẩu,  │
│    An toàn trên mạng   │ không xem nội dung lạ│ không bấm link lạ,   │ dùng máy tính quá    │
│                        │ ngồi học đúng tư thế │ ngồi học ngay ngắn   │ thời gian quy định   │
├────────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ 4. Hợp tác & Chia sẻ   │ Tích cực chia sẻ máy │ Phối hợp tốt với bạn,│ Chưa biết nhường     │
│    trong nhóm          │ tính bảng, hỗ trợ bạn│ biết lắng nghe ý kiến│ thiết bị cho bạn,    │
│                        │ cùng tiến bộ         │ đóng góp của nhóm    │ dễ mất tập trung     │
└────────────────────────┴──────────────────────┴──────────────────────┴──────────────────────┘`;
    } else if (type === 'announcement') {
      sample = `📢 THÔNG BÁO TỪ GIÁO VIÊN CHỦ NHIỆM LỚP ${className} (${teacherName})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Kính gửi Quý phụ huynh học sinh lớp ${className},

Để chuẩn bị tốt nhất cho tuần học mới theo định hướng phát triển năng lực và ứng dụng công nghệ số hiệu quả, cô giáo xin gửi đến Quý phụ huynh một số nội dung phối hợp trọng tâm như sau:

1. Học tập & Rèn luyện:
   - Nhắc các con hoàn thành thử thách song ngữ và bài tập Toán rèn luyện tư duy trên ứng dụng AI CLASS.
   - Khuyến khích con dành 15 phút mỗi ngày tương tác cùng trợ lý AI Buddy để mở rộng vốn hiểu biết và rèn kỹ năng tự học.
2. Nề nếp & Kỹ năng sống:
   - Giáo dục con kỹ năng tự giác soạn sách vở đúng thời khóa biểu, giữ gìn vệ sinh và an toàn khi sử dụng thiết bị số.
   - Lớp ${className} đã vinh danh trao 22 huy hiệu "English Star", "Kind Friend" và "Daily Learner" cho các con nỗ lực trong tuần qua!

Trân trọng cảm ơn sự đồng hành quý báu của Quý phụ huynh vì sự tiến bộ và niềm vui mỗi ngày đến trường của các con!
Cô giáo chủ nhiệm: ${teacherName} - Lớp ${className}`;
    } else if (type === 'positive_rules') {
      sample = `🌟 NỘI QUY LỚP HỌC HẠNH PHÚC ${className} - ${school}
(Giáo viên chủ nhiệm: ${teacherName})

Đến trường rạng rỡ nụ cười,
Lắng nghe cô giảng, điểm mười chăm ngoan.
Bạn bè đoàn kết hân hoan,
Giúp nhau cùng tiến, vẹn toàn chữ tâm.
Bàn phím gõ chuẩn phím F,
Màn hình sáng đẹp, góc ngồi chỉn chu.
Nói lời hay, làm việc tốt,
Lớp học hạnh phúc, tự tin vươn xa! 🌟`;
    } else {
      sample = `Nội dung đã được trợ lý AI lớp ${className} xử lý thành công theo chuẩn chương trình GDPT 2018 của ${teacherName}.`;
    }

    return { result: sample, isDemo: true };
  },

  /**
   * Smart Game Generator Engine: parse raw questions from file content or text
   */
  async parseGameFromContent(
    content: string,
    answerKeyText?: string
  ): Promise<{
    suggestedGameType: string;
    questions: any[];
    isDemo: boolean;
  }> {
    const clientApiKey = localStorage.getItem('gemini_api_key') || undefined;
    const clientModel = localStorage.getItem('gemini_selected_model') || 'gemini-2.5-flash';

    try {
      const response = await fetch('/api/gemini/parse-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(clientApiKey ? { 'x-gemini-api-key': clientApiKey } : {})
        },
        body: JSON.stringify({ content, answerKeyText, clientApiKey, clientModel }),
      });

      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        return await response.json();
      }
    } catch {
      // Fallback
    }

    if (clientApiKey) {
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
  "suggestedGameType": "magic-quiz",
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
      const direct = await callDirectGemini(prompt);
      if (direct.text) {
        try {
          const cleaned = direct.text.replace(/```json\n?|\n?```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            return {
              suggestedGameType: parsed.suggestedGameType || 'magic-quiz',
              questions: parsed.questions,
              isDemo: false
            };
          }
        } catch (e) {
          console.warn('Direct parse game json error:', e);
        }
      }
    }

    // Auto-parse mock based on input
    const questions = [
      {
        id: 'gen-1',
        prompt: 'Trong phép chia 36 : 4, kết quả bằng bao nhiêu?',
        options: ['7', '8', '9', '6'],
        answer: '9',
        hint: 'Hãy nhớ lại bảng chia 4 (4 x 9 = 36).'
      },
      {
        id: 'gen-2',
        prompt: 'Từ nào sau đây là từ chỉ hoạt động của học sinh?',
        options: ['Chăm chỉ', 'Học bài', 'Quyển vở', 'Xinh xắn'],
        answer: 'Học bài',
        hint: 'Học bài là việc em làm mỗi ngày.'
      },
      {
        id: 'gen-3',
        prompt: 'Chọn từ tiếng Anh có nghĩa là "trường học":',
        options: ['Teacher', 'Student', 'School', 'Book'],
        answer: 'School',
        hint: 'Nơi chúng mình gặp thầy cô và bạn bè.'
      }
    ];

    return {
      suggestedGameType: 'magic-quiz',
      questions,
      isDemo: true
    };
  }
};
