import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Volume2,
  RotateCcw,
  ShieldCheck,
  Languages,
  Calculator,
  BookOpen,
  Laptop,
  CheckCircle2,
  FolderOpen,
  Layers,
  Calendar,
  Copy,
  Check,
  UserCheck,
  GraduationCap,
  Clock,
  Award,
  CalendarDays,
  ExternalLink,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { geminiService, ChatMessage, isSchedulingIntent } from '../../services/geminiService';
import { speechService } from '../../services/speechService';
import { useApp } from '../../context/AppContext';

// Lightweight robust Markdown Viewer component for rendering formatted AI responses
const renderInlineMarkdown = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={index} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-slate-200/80 text-purple-700 font-mono text-[11px] font-semibold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

const MarkdownViewer: React.FC<{ content: string; className?: string }> = ({ content, className = '' }) => {
  const blocks: React.ReactNode[] = [];
  const lines = content.split('\n');
  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBlockLines: string[] = [];
  let tableRows: string[][] = [];

  const flushTable = (key: number) => {
    if (tableRows.length === 0) return null;
    const rows = [...tableRows];
    tableRows = [];
    const isSeparator = (r: string[]) => r.every(cell => /^[-: ]+$/.test(cell.trim()));
    const validRows = rows.filter(r => !isSeparator(r));
    if (validRows.length === 0) return null;
    const header = validRows[0];
    const body = validRows.slice(1);

    return (
      <div key={`tbl-${key}`} className="my-2.5 overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
        <table className="min-w-full text-xs text-left border-collapse">
          <thead className="bg-slate-100/90 text-slate-800 font-bold border-b border-slate-200">
            <tr>
              {header.map((col, idx) => (
                <th key={idx} className="px-3 py-2 border-r border-slate-200 last:border-r-0">
                  {renderInlineMarkdown(col.trim())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {body.map((row, rIdx) => (
              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-3 py-1.5 border-r border-slate-200 last:border-r-0 text-slate-700">
                    {renderInlineMarkdown(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code fence toggle
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        const codeText = codeBlockLines.join('\n');
        blocks.push(
          <div
            key={`code-${i}`}
            className="my-2.5 rounded-xl bg-slate-900 text-slate-100 p-3 font-mono text-xs overflow-x-auto shadow-inner relative"
          >
            {codeBlockLang && (
              <span className="text-[10px] uppercase font-bold text-slate-400 absolute top-2 right-2 tracking-wider">
                {codeBlockLang}
              </span>
            )}
            <pre className="pt-2 whitespace-pre-wrap">{codeText}</pre>
          </div>
        );
        codeBlockLines = [];
        inCodeBlock = false;
        codeBlockLang = '';
        continue;
      } else {
        inCodeBlock = true;
        codeBlockLang = line.trim().slice(3).trim();
        continue;
      }
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Markdown Table Detection
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const cells = line.trim().slice(1, -1).split('|');
      tableRows.push(cells);
      continue;
    } else if (tableRows.length > 0) {
      blocks.push(flushTable(i));
    }

    // Empty line spacing
    if (!line.trim()) {
      blocks.push(<div key={`sp-${i}`} className="h-1.5" />);
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      blocks.push(
        <h4 key={`h3-${i}`} className="text-sm font-bold mt-2.5 mb-1 text-purple-950">
          {renderInlineMarkdown(line.slice(4))}
        </h4>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push(
        <h3 key={`h2-${i}`} className="text-base font-bold mt-3 mb-1 text-purple-950">
          {renderInlineMarkdown(line.slice(3))}
        </h3>
      );
      continue;
    }
    if (line.startsWith('# ')) {
      blocks.push(
        <h2 key={`h1-${i}`} className="text-lg font-extrabold mt-3.5 mb-1.5 text-purple-950">
          {renderInlineMarkdown(line.slice(2))}
        </h2>
      );
      continue;
    }

    // Bullet list
    if (/^[\*\-•]\s+/.test(line.trim())) {
      const cleanLine = line.trim().replace(/^[\*\-•]\s+/, '');
      blocks.push(
        <div key={`li-${i}`} className="flex items-start gap-2 ml-1.5 my-1 text-slate-800">
          <span className="text-purple-600 font-bold shrink-0 mt-0.5">•</span>
          <div className="flex-1">{renderInlineMarkdown(cleanLine)}</div>
        </div>
      );
      continue;
    }

    // Numbered list
    const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      blocks.push(
        <div key={`num-${i}`} className="flex items-start gap-2 ml-1.5 my-1 text-slate-800">
          <span className="font-bold text-purple-700 shrink-0 text-xs min-w-[16px]">{numMatch[1]}.</span>
          <div className="flex-1">{renderInlineMarkdown(numMatch[2])}</div>
        </div>
      );
      continue;
    }

    // Regular paragraph
    blocks.push(
      <p key={`p-${i}`} className="my-0.5 leading-relaxed text-slate-800">
        {renderInlineMarkdown(line)}
      </p>
    );
  }

  if (tableRows.length > 0) {
    blocks.push(flushTable(lines.length));
  }

  return <div className={`space-y-0.5 ${className}`}>{blocks}</div>;
};

export const AIBuddyChat: React.FC = () => {
  const {
    currentUser,
    activeClass,
    teacherProfile,
    materials,
    subjects,
    aiLiveStatus,
    triggerCelebration
  } = useApp();

  // Role mode: Defaults to current user role, but teacher can toggle to experience student mode
  const [roleMode, setRoleMode] = useState<'teacher' | 'student'>(
    currentUser.role === 'teacher' ? 'teacher' : 'student'
  );

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getInitialMessage = (role: 'teacher' | 'student'): ChatMessage => {
    if (role === 'teacher') {
      return {
        id: 'init-teacher',
        sender: 'ai',
        text: `Kính chào ${teacherProfile.name}! 👋 Tôi là **AIBuddy** – Trợ lý học tập và điều hành giáo dục thông minh của lớp ${activeClass.name} (Trường Tiểu học Hoài Nhơn).\n\nTôi sẵn sàng hỗ trợ Thầy/Cô:\n• 📋 **Soạn Kế hoạch bài dạy (Giáo án)** chuẩn Công văn 2345/BGDĐT.\n• ✨ **Thiết kế hoạt động trải nghiệm** đổi mới phương pháp GDPT 2018.\n• 📊 **Bảng tiêu chí đánh giá (Rubric)** theo Thông tư 27/2020/BGDĐT.\n• 🎮 **Ý tưởng trò chơi học tập** mở đầu & củng cố tiết dạy.\n• 📅 **Tự động lên lịch họp & nhắc việc** đồng bộ qua **Dola AI / Calendar**!`,
        timestamp: 'Vừa xong',
        options: [
          'Soạn kế hoạch bài dạy chuẩn CV 2345 môn Toán',
          'Thiết kế hoạt động trải nghiệm phân môn Tiếng Việt',
          'Bảng tiêu chí đánh giá học lực Rubric chuẩn TT 27',
          'Ý tưởng trò chơi học tập khởi động tiết học',
          'Lên lịch họp phụ huynh & nhắc việc qua Dola AI'
        ]
      };
    }

    return {
      id: 'init-student',
      sender: 'ai',
      text: `Xin chào bạn nhỏ lớp ${activeClass.name}! 👋 Mình là **AI Buddy** – Người bạn đồng hành thông minh cùng cô giáo ${teacherProfile.name} (Trường Tiểu học Hoài Nhơn) đây! Hôm nay bạn muốn cùng mình học Tiếng Anh, giải đố Toán học, đọc Tiếng Việt hay tìm hiểu học liệu số nào trong thư viện? ⭐`,
      timestamp: 'Vừa xong',
      options: [
        'Học từ vựng Tiếng Anh chủ đề Friends',
        'Gợi ý cách giải bài toán 2 bước tính',
        'Tìm biện pháp so sánh trong câu thơ',
        'Vị trí hai phím xuất phát chuẩn F và J',
        'Nhắc lịch làm bài tập ôn thi qua Dola AI'
      ]
    };
  };

  // Restore messages from persistent storage or default
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const initialRole = currentUser.role === 'teacher' ? 'teacher' : 'student';
    try {
      const saved = localStorage.getItem(`aiclass_chat_messages_v2_${initialRole}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return [getInitialMessage(initialRole)];
  });

  // Restore input message draft from persistent storage
  const [inputMessage, setInputMessage] = useState<string>(() => {
    const initialRole = currentUser.role === 'teacher' ? 'teacher' : 'student';
    return localStorage.getItem(`aiclass_chat_draft_${initialRole}`) || '';
  });

  const [selectedSubject, setSelectedSubject] = useState('Chung');
  const [isLoading, setIsLoading] = useState(false);

  // Sync roleMode when currentUser switches, or reload saved messages for the active role
  useEffect(() => {
    const saved = localStorage.getItem(`aiclass_chat_messages_v2_${roleMode}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        } else {
          setMessages([getInitialMessage(roleMode)]);
        }
      } catch {
        setMessages([getInitialMessage(roleMode)]);
      }
    } else {
      setMessages([getInitialMessage(roleMode)]);
    }

    const savedDraft = localStorage.getItem(`aiclass_chat_draft_${roleMode}`) || '';
    setInputMessage(savedDraft);
  }, [roleMode]);

  // Persist messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(`aiclass_chat_messages_v2_${roleMode}`, JSON.stringify(messages));
      } catch (err) {
        console.warn('Failed to persist chat messages to localStorage', err);
      }
    }
  }, [messages, roleMode]);

  // Auto-save input draft with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputMessage(val);
    try {
      localStorage.setItem(`aiclass_chat_draft_${roleMode}`, val);
    } catch (err) {
      console.warn('Failed to save draft to localStorage', err);
    }
  };

  const handleResetChat = () => {
    const initMsg = getInitialMessage(roleMode);
    setMessages([initMsg]);
    try {
      localStorage.setItem(`aiclass_chat_messages_v2_${roleMode}`, JSON.stringify([initMsg]));
      localStorage.removeItem(`aiclass_chat_draft_${roleMode}`);
    } catch {
      // Ignore
    }
    setInputMessage('');
  };

  // Subject quick prompts mapped for each role
  const subjectQuickPromptsTeacher: Record<string, string[]> = {
    'Chung': [
      'Soạn kế hoạch bài dạy chuẩn CV 2345',
      'Thiết kế hoạt động trải nghiệm phân môn',
      'Bảng Rubric đánh giá năng lực học sinh TT 27',
      'Lên lịch họp phụ huynh qua Dola AI'
    ],
    'Tiếng Anh': [
      'Kế hoạch bài dạy Tiếng Anh 3 Unit Family',
      'Hoạt động trải nghiệm đóng vai giao tiếp Tiếng Anh',
      'Bảng Rubric đánh giá phát âm & từ vựng Tiếng Anh',
      'Trò chơi Word Bingo củng cố từ vựng'
    ],
    'Toán học': [
      'Giáo án Toán 3: Bài toán giải bằng 2 bước tính',
      'Bảng Rubric đánh giá tư duy giải toán có lời văn',
      'Tình huống sư phạm: HS lúng túng khi làm toán đố',
      'Trò chơi Vòng quay số học khởi động'
    ],
    'Tiếng Việt': [
      'Giáo án Tiếng Việt 3: Luyện từ và câu - So sánh',
      'Hoạt động trải nghiệm viết sáng tạo đoạn văn ngắn',
      'Bảng tiêu chí đánh giá kỹ năng đọc hiểu và diễn đạt',
      'Trò chơi Nối từ tiếp sức rèn vốn từ'
    ],
    'Tin học': [
      'Kế hoạch bài dạy: Gõ 10 ngón hàng phím cơ sở F và J',
      'Quy tắc công dân số và an toàn mạng cho học sinh',
      'Tiêu chí đánh giá kỹ năng thực hành máy tính',
      'Hoạt động trải nghiệm thuật toán mê cung'
    ],
    'Khoa học': [
      'Kế hoạch bài dạy Khoa học 3: Các bộ phận của cây',
      'Hoạt động trải nghiệm chăm sóc vườn cây trường học',
      'Rubric đánh giá năng lực quan sát tự nhiên',
      'Thí nghiệm mini trực quan khám phá sự sống'
    ],
    'Lịch sử & Địa lí': [
      'Kế hoạch bài dạy: Tự hào quê hương Hoài Nhơn',
      'Hoạt động trải nghiệm tìm hiểu di tích lịch sử địa phương',
      'Bảng đánh giá năng lực tìm hiểu địa lí quê hương',
      'Bộ câu hỏi đố vui nhân vật lịch sử Việt Nam'
    ]
  };

  const subjectQuickPromptsStudent: Record<string, string[]> = {
    'Chung': [
      'Học từ vựng Tiếng Anh chủ đề Friends',
      'Gợi ý cách giải bài toán 2 bước tính',
      'Tìm biện pháp so sánh trong câu thơ',
      'Vị trí hai phím xuất phát chuẩn F và J',
      'Nhắc lịch làm bài tập ôn thi qua Dola AI'
    ],
    'Tiếng Anh': [
      'Luyện phát âm từ vựng chủ đề Family',
      'Mẫu câu hỏi thăm sức khỏe và bạn bè',
      'Đoạn hội thoại tiếng Anh ngắn tại lớp học',
      'Đố vui từ vựng về trường lớp'
    ],
    'Toán học': [
      'Gợi ý cách giải bài toán 2 bước tính',
      'Quy tắc tính giá trị biểu thức có nhân chia',
      'Bảng nhân 7 và bài toán chia có dư',
      'Bài toán đố vui tư duy hình học'
    ],
    'Tiếng Việt': [
      'Tìm hình ảnh so sánh trong câu thơ',
      'Biện pháp nhân hóa và ví dụ minh họa',
      'Gợi ý viết đoạn văn ngắn kể về người thân',
      'Giải nghĩa từ láy và từ ngữ chỉ cảm xúc'
    ],
    'Tin học': [
      'Vị trí đặt 10 ngón tay trên hàng phím cơ sở',
      'Tại sao hai phím F và J lại có gờ nổi?',
      '3 quy tắc an toàn bảo mật khi lên mạng',
      'Cách cầm chuột và tư thế ngồi chuẩn'
    ],
    'Khoa học': [
      'Các bộ phận của cây xanh và chức năng rễ',
      'Quá trình quang hợp của lá cây',
      'Làm thế nào để bảo vệ nguồn nước sạch?',
      'Cơ quan tuần hoàn trong cơ thể gồm những gì?'
    ],
    'Lịch sử & Địa lí': [
      'Kể chuyện về anh hùng dân tộc Việt Nam',
      'Giới thiệu cảnh đẹp quê hương Hoài Nhơn',
      'Đặc điểm khí hậu và sông ngòi nước ta',
      'Ý nghĩa của ngày Quốc khánh 2 tháng 9'
    ]
  };

  const activeQuickPrompts = roleMode === 'teacher' ? subjectQuickPromptsTeacher : subjectQuickPromptsStudent;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Find linked materials for current subject
  const linkedMaterials = useMemo(() => {
    if (selectedSubject === 'Chung') return materials.slice(0, 4);
    return materials.filter(m => {
      const sub = subjects.find(s => s.name.toLowerCase() === selectedSubject.toLowerCase());
      if (sub) {
        return m.subject.toLowerCase() === sub.id.toLowerCase() || m.subject.toLowerCase() === selectedSubject.toLowerCase();
      }
      return m.subject.toLowerCase().includes(selectedSubject.toLowerCase());
    });
  }, [materials, selectedSubject, subjects]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    try {
      localStorage.removeItem(`aiclass_chat_draft_${roleMode}`);
    } catch {
      // Ignore
    }
    setIsLoading(true);

    const history = messages.slice(-10).map(m => ({
      role: m.sender === 'user' ? ('user' as const) : ('model' as const),
      text: m.text
    }));

    // Generate materials context from linked materials
    const materialsContext = linkedMaterials
      .map(
        m =>
          `[Tài liệu: ${m.title} - Môn: ${m.subject}]\n${
            m.content || m.description
          }\n${m.keyConcepts ? 'Từ khóa: ' + m.keyConcepts.join(', ') : ''}`
      )
      .join('\n\n');

    const result = await geminiService.sendBuddyMessage(
      text,
      history,
      selectedSubject,
      materialsContext,
      teacherProfile.name,
      activeClass.name,
      roleMode
    );

    setIsLoading(false);

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: result.text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      audioText: result.audioText,
      dolaEvent: result.dolaEvent
    };

    setMessages(prev => [...prev, aiMsg]);
    triggerCelebration();
  };

  const handleSpeakText = (text: string) => {
    const isEnglishSubject = selectedSubject.toLowerCase().includes('anh') || selectedSubject.toLowerCase() === 'english';
    speechService.speak(text, isEnglishSubject ? 'en-US' : 'vi-VN');
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSelectMaterialToAsk = (matTitle: string) => {
    if (roleMode === 'teacher') {
      handleSendMessage(`Soạn giáo án và hoạt động trải nghiệm bài "${matTitle}" trong Kho học liệu số`);
    } else {
      handleSendMessage(`Chào AI Buddy, hãy hướng dẫn em gợi ý học bài "${matTitle}" trong Kho học liệu số với!`);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-700/50 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>CHATBOT AIBUDDY – ĐIỀU HÀNH & HỌC TẬP THÔNG MINH</span>
              </span>

              {/* Dola AI Integration Badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[11px] font-semibold border border-indigo-400/40">
                <CalendarDays className="w-3 h-3 text-indigo-300" />
                <span>Liên kết Dola AI Hub</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AIBuddy Lớp {activeClass.name} – {roleMode === 'teacher' ? 'Đồng Hành Chuyên Môn Giáo Viên' : 'Trợ Lý Học Tập Học Sinh'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              Trường Tiểu học Hoài Nhơn • Giáo viên chủ nhiệm: <strong>{teacherProfile.name}</strong>. Hỗ trợ sư phạm chuẩn mực, phân môn toàn diện và liên kết Kho học liệu số.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0 z-10">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400/40 p-1 flex items-center justify-center shadow-lg">
              <div className="w-full h-full rounded-full bg-[#0B1428] flex items-center justify-center">
                <Bot className="w-8 h-8 text-emerald-300 animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
            </div>

            {/* Mode Switcher Pill */}
            <div className="flex items-center p-1 rounded-2xl bg-black/40 border border-white/20 text-xs font-semibold">
              <button
                onClick={() => {
                  setRoleMode('teacher');
                  setMessages([getInitialMessage('teacher')]);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition-all ${
                  roleMode === 'teacher'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Chế độ Giáo viên: Soạn giáo án CV 2345, Rubric TT 27, trải nghiệm"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Giáo viên</span>
              </button>
              <button
                onClick={() => {
                  setRoleMode('student');
                  setMessages([getInitialMessage('student')]);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition-all ${
                  roleMode === 'student'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Chế độ Học sinh: Phương pháp Socratic gợi mở, không cho đáp án sẵn"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Học sinh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Safe AI rules guarantee */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-3 text-[11px] text-emerald-200 z-10">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{roleMode === 'teacher' ? 'Hỗ trợ sư phạm chuẩn Bộ GD&ĐT' : 'Bảo vệ quyền riêng tư học sinh'}</span>
          </span>
          <span>•</span>
          <span>GVCN {teacherProfile.name}</span>
          <span>•</span>
          <span>{materials.length} học liệu số liên kết</span>
          <span>•</span>
          <span className="text-amber-300">
            {aiLiveStatus.hasKey ? 'Gemini 2.5 Flash Engine' : 'Chế độ Sư phạm Chuẩn hóa'}
          </span>
        </div>
      </div>

      {/* Main Chatbox Frame */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md flex flex-col h-[650px] overflow-hidden">
        {/* Chat Subject Switcher Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-500 shrink-0">Phân môn:</span>
            {['Chung', 'Tiếng Anh', 'Toán học', 'Tiếng Việt', 'Tin học', 'Khoa học', 'Lịch sử & Địa lí'].map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedSubject === sub
                    ? roleMode === 'teacher'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          <button
            onClick={handleResetChat}
            className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-slate-200/60 rounded-lg transition-colors shrink-0 flex items-center gap-1 text-[11px] font-medium"
            title="Xóa làm mới / Bắt đầu cuộc trò chuyện mới"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
        </div>

        {/* Linked Learning Materials Strip */}
        {linkedMaterials.length > 0 && (
          <div className="px-4 py-2 bg-purple-50/70 border-b border-purple-100 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="font-bold text-purple-900 flex items-center gap-1 shrink-0">
              <FolderOpen className="w-3.5 h-3.5 text-purple-600" />
              <span>Học liệu liên kết ({selectedSubject}):</span>
            </span>
            <div className="flex items-center gap-1.5">
              {linkedMaterials.slice(0, 3).map(mat => (
                <button
                  key={mat.id}
                  type="button"
                  onClick={() => handleSelectMaterialToAsk(mat.title)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-purple-200 hover:border-purple-400 text-purple-800 font-medium whitespace-nowrap transition-colors flex items-center gap-1"
                  title={roleMode === 'teacher' ? 'Soạn giáo án và hoạt động từ bài này' : 'Nhấn để nhờ AI Buddy hướng dẫn'}
                >
                  <BookOpen className="w-3 h-3 text-purple-600" />
                  <span className="truncate max-w-[200px]">{mat.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  roleMode === 'teacher' 
                    ? 'bg-purple-100 text-purple-800 border-purple-300' 
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                {/* Dola AI Event Confirmation Card if present */}
                {msg.dolaEvent && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 shadow-xs space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <span>DOLA AI CALENDAR HUB – ĐÃ GHI NHẬN LỊCH TRÌNH</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Đã lên lịch</span>
                      </span>
                    </div>
                    <div className="text-xs text-indigo-950 font-medium">
                      📌 <strong>Nội dung:</strong> {msg.dolaEvent.taskTitle || msg.dolaEvent.summary}
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-indigo-700">
                      <span>⏰ <strong>Thời gian:</strong> {msg.dolaEvent.dateTime || 'Theo hạn chót'}</span>
                      <span>👥 <strong>Đối tượng:</strong> {msg.dolaEvent.targetAudience === 'teacher' ? 'Giáo viên' : msg.dolaEvent.targetAudience === 'class' ? 'Cả lớp' : 'Học sinh'}</span>
                    </div>
                  </div>
                )}

                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-xs relative ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-xs'
                      : 'bg-slate-50 text-slate-800 rounded-tl-xs border border-slate-200/90'
                  }`}
                >
                  {msg.sender === 'ai' ? (
                    <MarkdownViewer content={msg.text} />
                  ) : (
                    <p className="whitespace-pre-line font-sans">{msg.text}</p>
                  )}

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-current/10 text-[11px] opacity-80">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'ai' && (
                      <div className="flex items-center gap-2 ml-2">
                        <button
                          onClick={() => handleCopyText(msg.id, msg.text)}
                          className="hover:scale-110 transition-transform p-1 rounded-md hover:bg-slate-200/50 text-slate-600 flex items-center gap-1 text-[11px]"
                          title="Sao chép nội dung câu trả lời"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-semibold">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Sao chép</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleSpeakText(msg.text)}
                          className="hover:scale-110 transition-transform p-1 rounded-md hover:bg-slate-200/50 text-slate-600"
                          title="Nghe giọng đọc"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick suggestion bubbles if any */}
                {msg.options && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(opt)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors text-left flex items-center gap-1.5 ${
                          roleMode === 'teacher'
                            ? 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-300 shrink-0"
                />
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                roleMode === 'teacher' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 text-xs text-slate-600 italic flex items-center gap-2">
                <span>
                  {roleMode === 'teacher'
                    ? 'AIBuddy đang nghiên cứu học liệu và soạn thảo nội dung sư phạm...'
                    : 'AIBuddy đang tìm gợi ý từng bước giúp bạn nhỏ tự tư duy...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick subject suggestion prompts */}
        {activeQuickPrompts[selectedSubject] && (
          <div className="px-3 py-1.5 bg-slate-50/90 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className={`text-[10px] font-bold shrink-0 flex items-center gap-1 ${
              roleMode === 'teacher' ? 'text-purple-800' : 'text-emerald-800'
            }`}>
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Gợi ý môn {selectedSubject} ({roleMode === 'teacher' ? 'Giáo viên' : 'Học sinh'}):</span>
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {activeQuickPrompts[selectedSubject].map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-[11px] font-medium transition-colors shrink-0 truncate max-w-[260px]"
                  title={prompt}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder={
              roleMode === 'teacher'
                ? `Hỏi AIBuddy về soạn giáo án, Rubric, hoạt động trải nghiệm hoặc lên lịch Dola AI...`
                : `Hỏi AI Buddy về gợi ý bài tập môn ${selectedSubject} hoặc các bài học trong Kho học liệu...`
            }
            className={`flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:bg-white ${
              roleMode === 'teacher' ? 'focus:ring-purple-500' : 'focus:ring-emerald-500'
            }`}
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className={`p-3 rounded-2xl disabled:opacity-40 text-white shadow-md transition-colors ${
              roleMode === 'teacher'
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
            title="Gửi câu hỏi tới AIBuddy"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
