import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Mail,
  Award,
  FileText,
  Copy,
  Check,
  Send,
  Calendar,
  Users,
  Lightbulb,
  Edit,
  Save,
  Download,
  Printer,
  Target,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Brain,
  Compass,
  Star,
  ChevronRight,
  Layers,
  HelpCircle,
  RefreshCw,
  FolderDown,
  FolderOpen
} from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import { useApp } from '../../context/AppContext';

export const AITeacherAssistant: React.FC = () => {
  const { teacherInfo, teacherProfile, activeClass, students, materials, addNotification, triggerCelebration, setApiKeyModalOpen } = useApp();

  type TaskType =
    | 'lesson_plan_2345'
    | 'tt27_comment'
    | 'quiz_generator_tt27'
    | 'personalized_remediation'
    | 'digital_skills_rubric'
    | 'announcement'
    | 'positive_rules';

  const [activeTask, setActiveTask] = useState<TaskType>('lesson_plan_2345');

  // Specific form states
  const [selectedSubject, setSelectedSubject] = useState('Tiếng Việt 3');
  const [selectedGrade, setSelectedGrade] = useState(activeClass.grade || 3);
  const [selectedBookSeries, setSelectedBookSeries] = useState('Bộ sách Kết nối tri thức với cuộc sống');
  const [promptTopic, setPromptTopic] = useState('');
  const [selectedStudentForComment, setSelectedStudentForComment] = useState<string>(students[0]?.id || '');
  const [commentScope, setCommentScope] = useState<'individual' | 'batch_all'>('individual');
  const [commentPeriod, setCommentPeriod] = useState('Giữa Học kỳ I');
  const [quizDuration, setQuizDuration] = useState('35 phút');
  const [teacherCustomNotes, setTeacherCustomNotes] = useState('');
  
  // Generation output & status
  const [generatedOutput, setGeneratedOutput] = useState<string>(() => {
    return localStorage.getItem('aiclass_teacher_assistant_output') || '';
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sentAsAnnouncement, setSentAsAnnouncement] = useState(false);

  React.useEffect(() => {
    if (generatedOutput) {
      try {
        localStorage.setItem('aiclass_teacher_assistant_output', generatedOutput);
      } catch (e) {
        console.warn('Failed to save assistant output to localStorage', e);
      }
    }
  }, [generatedOutput]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setApiError(null);
    setCopied(false);
    setSentAsAnnouncement(false);

    let params: Record<string, any> = {
      teacherName: teacherProfile.fullName || teacherProfile.name || 'Giáo viên',
      className: activeClass.name || 'Lớp học',
      school: activeClass.schoolName || teacherProfile.schoolName || (teacherProfile as any).school || 'Trường Tiểu học Hoài Nhơn',
      grade: selectedGrade || activeClass.grade || 3
    };

    if (activeTask === 'lesson_plan_2345') {
      params = {
        ...params,
        subject: selectedSubject,
        bookSeries: selectedBookSeries,
        lessonTitle: promptTopic || 'Luyện từ và câu - Từ ngữ chỉ tình cảm gia đình. Biện pháp So sánh',
        customRequirements: teacherCustomNotes.trim()
      };
    } else if (activeTask === 'tt27_comment') {
      if (commentScope === 'batch_all') {
        // Sinh nhận xét cả lớp
        params = {
          ...params,
          period: commentPeriod,
          batchMode: true,
          studentsList: students.map(s => ({
            fullName: s.fullName,
            studentCode: s.studentCode,
            progress: s.learningProgress,
            supportGoal: s.supportGoal
          }))
        };
      } else {
        const student = students.find(s => s.id === selectedStudentForComment) || students[0];
        params = {
          ...params,
          period: commentPeriod,
          studentData: {
            fullName: student.fullName,
            studentCode: student.studentCode,
            learningProgress: student.learningProgress,
            skills: student.skills,
            supportGoal: student.supportGoal,
            badgesCount: student.badges?.length || 0
          }
        };
      }
    } else if (activeTask === 'quiz_generator_tt27') {
      params = {
        ...params,
        subject: selectedSubject,
        duration: quizDuration,
        topic: promptTopic || 'Kiến thức trọng tâm theo chương trình',
        customRequirements: teacherCustomNotes.trim()
      };
    } else if (activeTask === 'personalized_remediation') {
      const student = students.find(s => s.id === selectedStudentForComment) || students[0];
      params = {
        ...params,
        studentData: {
          fullName: student.fullName,
          studentCode: student.studentCode,
          supportGoal: promptTopic || student.supportGoal
        }
      };
    } else if (activeTask === 'digital_skills_rubric') {
      params = {
        ...params,
        topic: promptTopic || 'Năng lực số và Kỹ năng thế kỷ 21 cho học sinh tiểu học'
      };
    } else if (activeTask === 'announcement') {
      params = {
        ...params,
        topic: promptTopic || 'Kế hoạch học tập tuần mới và rèn luyện kỹ năng số'
      };
    } else if (activeTask === 'positive_rules') {
      params = {
        ...params,
        topic: promptTopic || `Nội quy lớp học hạnh phúc ${activeClass.name}`
      };
    }

    const result = await geminiService.generateTeacherTask(activeTask, params);
    
    if (result.error) {
      setApiError(result.error);
      setIsGenerating(false);
      return;
    }

    // Nếu là sinh nhận xét cả lớp, tạo bảng tổng hợp đẹp mắt
    if (activeTask === 'tt27_comment' && commentScope === 'batch_all') {
      let batchText = `📋 BẢNG TỔNG HỢP NHẬN XÉT ĐÁNH GIÁ ĐỊNH KỲ THEO THÔNG TƯ 27/2020/TT-BGDĐT\n`;
      batchText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      batchText += `TRƯỜNG: ${activeClass.schoolName || teacherProfile.school} • LỚP: ${activeClass.name}\n`;
      batchText += `GIÁO VIÊN CHỦ NHIỆM: ${teacherProfile.name} • ĐỢT ĐÁNH GIÁ: ${commentPeriod}\n`;
      batchText += `TỔNG SỐ HỌC SINH: ${students.length} em • NGÀY BAN HÀNH: ${new Date().toLocaleDateString('vi-VN')}\n\n`;

      students.forEach((st, idx) => {
        const rating = st.learningProgress >= 90 ? 'T (Hoàn thành tốt)' : st.learningProgress >= 75 ? 'H (Hoàn thành)' : 'C (Chưa hoàn thành)';
        batchText += `【Học sinh ${idx + 1}: ${st.fullName} (${st.studentCode})】\n`;
        batchText += `- Mức đánh giá: ${rating} • Tiến độ: ${st.learningProgress}%\n`;
        batchText += `- Đánh giá Môn học: Nắm chắc kiến thức trọng tâm, tính toán cẩn thận và chăm chỉ rèn luyện đọc hiểu.\n`;
        batchText += `- Đánh giá Năng lực: Tự giác chuẩn bị bài, tự tin hợp tác cùng bạn bè và sử dụng tốt AI Buddy.\n`;
        batchText += `- Đánh giá Phẩm chất: Ngoan ngoãn, hòa đồng, biết giúp đỡ bạn bè (Đạt ${st.badges?.length || 0} huy hiệu khen thưởng).\n`;
        batchText += `- Góp ý hỗ trợ: ${st.supportGoal}\n`;
        batchText += `─────────────────────────────────────────────────────────────────────────────\n`;
      });

      setGeneratedOutput(batchText);
    } else {
      setGeneratedOutput(result.result);
    }

    setIsGenerating(false);
    triggerCelebration();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDoc = () => {
    const blob = new Blob(['\uFEFF' + generatedOutput], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const taskName = activeTask.replace(/_/g, '-');
    link.download = `aiclass_${taskName}_${activeClass.name}_${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePublishAsNotification = () => {
    if (!generatedOutput) return;
    addNotification(`Thông báo từ ${teacherProfile.title} ${teacherProfile.name}`, generatedOutput, true);
    setSentAsAnnouncement(true);
    triggerCelebration();
    setTimeout(() => setSentAsAnnouncement(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-[#0B1428] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-purple-800/50 space-y-2 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TRUNG TÂM AI ĐỔI MỚI QUẢN LÝ & GIẢNG DẠY TIỂU HỌC 4.0</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Trợ Lý Nghiệp Vụ Sư Phạm Cho {teacherProfile.title} {teacherProfile.name}
        </h2>
        <p className="text-xs sm:text-sm text-purple-100 max-w-3xl leading-relaxed">
          Được thiết kế tối ưu theo <strong>Chương trình GDPT 2018</strong>, chuẩn giáo án <strong>Công văn 2345/BGDĐT-GDTH</strong>, 
          quy định đánh giá học sinh tiểu học <strong>Thông tư 27/2020/TT-BGDĐT</strong> và rèn luyện kỹ năng công dân số cho học sinh lớp {activeClass.name}.
        </p>

        <div className="pt-2 text-xs text-purple-200 flex flex-wrap items-center gap-3">
          <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/15">Chuẩn CV 2345/BGDĐT</span>
          <span>•</span>
          <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/15">Đánh giá TT 27/2020</span>
          <span>•</span>
          <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/15">Ma trận 3 mức độ</span>
          <span>•</span>
          <span className="text-amber-300 font-semibold">Gemini 2.5 Flash AI Engine</span>
        </div>
      </div>

      {/* 6 Pedagogical Task Categories Toolbar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <button
          onClick={() => {
            setActiveTask('lesson_plan_2345');
            setGeneratedOutput('');
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
            activeTask === 'lesson_plan_2345'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md font-bold ring-2 ring-purple-300'
              : 'bg-white border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-1.5 shrink-0 text-purple-300" />
          <div>
            <div className="text-xs font-bold leading-snug">1. Giáo Án CV 2345</div>
            <div className="text-[10px] opacity-75 mt-0.5">Tiến trình 4 bước</div>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveTask('tt27_comment');
            setGeneratedOutput('');
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
            activeTask === 'tt27_comment'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md font-bold ring-2 ring-purple-300'
              : 'bg-white border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-slate-50'
          }`}
        >
          <FileCheck className="w-5 h-5 mb-1.5 shrink-0 text-emerald-300" />
          <div>
            <div className="text-xs font-bold leading-snug">2. Nhận Xét TT 27</div>
            <div className="text-[10px] opacity-75 mt-0.5">Học bạ & cả lớp</div>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveTask('quiz_generator_tt27');
            setGeneratedOutput('');
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
            activeTask === 'quiz_generator_tt27'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md font-bold ring-2 ring-purple-300'
              : 'bg-white border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-slate-50'
          }`}
        >
          <Target className="w-5 h-5 mb-1.5 shrink-0 text-amber-300" />
          <div>
            <div className="text-xs font-bold leading-snug">3. Đề Thi 3 Mức Độ</div>
            <div className="text-[10px] opacity-75 mt-0.5">Kèm ma trận & đáp án</div>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveTask('personalized_remediation');
            setGeneratedOutput('');
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
            activeTask === 'personalized_remediation'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md font-bold ring-2 ring-purple-300'
              : 'bg-white border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-slate-50'
          }`}
        >
          <Brain className="w-5 h-5 mb-1.5 shrink-0 text-blue-300" />
          <div>
            <div className="text-xs font-bold leading-snug">4. Lộ Trình Phụ Đạo</div>
            <div className="text-[10px] opacity-75 mt-0.5">Bồi dưỡng cá nhân hóa</div>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveTask('digital_skills_rubric');
            setGeneratedOutput('');
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
            activeTask === 'digital_skills_rubric'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md font-bold ring-2 ring-purple-300'
              : 'bg-white border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-5 h-5 mb-1.5 shrink-0 text-cyan-300" />
          <div>
            <div className="text-xs font-bold leading-snug">5. Rubric Năng Lực Số</div>
            <div className="text-[10px] opacity-75 mt-0.5">Kỹ năng thế kỷ 21</div>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveTask('announcement');
            setGeneratedOutput('');
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
            activeTask === 'announcement'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md font-bold ring-2 ring-purple-300'
              : 'bg-white border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-slate-50'
          }`}
        >
          <Mail className="w-5 h-5 mb-1.5 shrink-0 text-pink-300" />
          <div>
            <div className="text-xs font-bold leading-snug">6. Thư Ngỏ & Thông Báo</div>
            <div className="text-[10px] opacity-75 mt-0.5">Kết nối phụ huynh</div>
          </div>
        </button>
      </div>

      {/* Input Parameters Panel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        {/* TASK 1: SOẠN GIÁO ÁN CHUẨN CV 2345 */}
        {activeTask === 'lesson_plan_2345' && (
          <div className="space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-900 pb-2 border-b border-slate-100">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>Cấu hình Kế hoạch bài dạy chuẩn Công văn 2345/BGDĐT-GDTH:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Môn học</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 bg-white"
                >
                  <option value="Tiếng Việt">Tiếng Việt</option>
                  <option value="Toán">Toán học</option>
                  <option value="Tiếng Anh">Tiếng Anh (English)</option>
                  <option value="Tin học & Công nghệ">Tin học & Công nghệ</option>
                  <option value="Tự nhiên và Xã hội">Tự nhiên và Xã hội</option>
                  <option value="Khoa học">Khoa học</option>
                  <option value="Lịch sử và Địa lí">Lịch sử và Địa lí</option>
                  <option value="Đạo đức">Đạo đức (Kỹ năng sống)</option>
                  <option value="Hoạt động trải nghiệm">Hoạt động trải nghiệm</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Khối lớp</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 bg-white"
                >
                  <option value={1}>Khối 1</option>
                  <option value={2}>Khối 2</option>
                  <option value={3}>Khối 3 (Lớp {activeClass.name})</option>
                  <option value={4}>Khối 4</option>
                  <option value={5}>Khối 5</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Bộ sách giáo khoa</label>
                <select
                  value={selectedBookSeries}
                  onChange={(e) => setSelectedBookSeries(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 bg-white"
                >
                  <option value="Kết nối tri thức với cuộc sống">Kết nối tri thức với cuộc sống</option>
                  <option value="Chân trời sáng tạo">Chân trời sáng tạo</option>
                  <option value="Cánh Diều">Cánh Diều</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold text-xs mb-1">
                Tên bài học & Mục tiêu trọng tâm (để trống để dùng bài mẫu):
              </label>
              <input
                type="text"
                value={promptTopic}
                onChange={(e) => setPromptTopic(e.target.value)}
                placeholder="Ví dụ: Luyện từ và câu - Từ ngữ chỉ tình cảm gia đình. Biện pháp So sánh"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
              />
              {/* Nạp nhanh từ kho học liệu */}
              {materials.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1.5">
                  <span className="text-[10px] text-purple-700 font-bold flex items-center gap-1">
                    <FolderOpen className="w-3 h-3" />
                    <span>Lấy từ Kho học liệu:</span>
                  </span>
                  {materials.slice(0, 3).map(mat => (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() => setPromptTopic(mat.title)}
                      className="px-2 py-0.5 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-medium transition-colors truncate max-w-[200px]"
                      title={mat.title}
                    >
                      {mat.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-slate-700 font-semibold text-xs mb-1">
                Yêu cầu / Ghi chú sư phạm riêng của giáo viên (tùy chọn):
              </label>
              <textarea
                rows={2}
                value={teacherCustomNotes}
                onChange={(e) => setTeacherCustomNotes(e.target.value)}
                placeholder="Ví dụ: Chú trọng hoạt động cặp đôi, phân hóa bài tập cho học sinh còn yếu tính nhẩm, lồng ghép ví dụ thực tế Hoài Nhơn..."
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              />
            </div>
          </div>
        )}

        {/* TASK 2: ĐÁNH GIÁ NHẬN XÉT THEO THÔNG TƯ 27 */}
        {activeTask === 'tt27_comment' && (
          <div className="space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 pb-2 border-b border-slate-100">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Đánh giá học sinh tiểu học theo Thông tư 27/2020/TT-BGDĐT:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phạm vi nhận xét</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCommentScope('individual')}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      commentScope === 'individual'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    1 Học sinh cụ thể
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommentScope('batch_all')}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      commentScope === 'batch_all'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Cả Lớp ({students.length} em)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Đợt đánh giá định kỳ</label>
                <select
                  value={commentPeriod}
                  onChange={(e) => setCommentPeriod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 bg-white"
                >
                  <option value="Đánh giá thường xuyên tháng này">Đánh giá thường xuyên tháng này</option>
                  <option value="Giữa Học kỳ I">Giữa Học kỳ I</option>
                  <option value="Cuối Học kỳ I">Cuối Học kỳ I</option>
                  <option value="Giữa Học kỳ II">Giữa Học kỳ II</option>
                  <option value="Cuối Năm học 2026–2027">Cuối Năm học 2026–2027 (Tổng kết học bạ)</option>
                </select>
              </div>
            </div>

            {commentScope === 'individual' && (
              <div>
                <label className="block text-slate-700 font-semibold text-xs mb-1">
                  Chọn học sinh lớp {activeClass.name}:
                </label>
                <select
                  value={selectedStudentForComment}
                  onChange={(e) => setSelectedStudentForComment(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white font-medium"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.stt}. {st.fullName} ({st.studentCode}) - Tiến độ: {st.learningProgress}% - Điểm cần hỗ trợ: {st.supportGoal}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* TASK 3: TẠO ĐỀ THI 3 MỨC ĐỘ THÔNG TƯ 27 */}
        {activeTask === 'quiz_generator_tt27' && (
          <div className="space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 pb-2 border-b border-slate-100">
              <Target className="w-4 h-4 text-amber-600" />
              <span>Thiết kế Đề kiểm tra định kỳ & Ma trận đề 3 Mức độ (Thông tư 27):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Môn kiểm tra</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 bg-white"
                >
                  <option value="Toán">Toán học</option>
                  <option value="Tiếng Việt">Tiếng Việt</option>
                  <option value="Tiếng Anh">Tiếng Anh (English)</option>
                  <option value="Tin học">Tin học</option>
                  <option value="Khoa học">Khoa học</option>
                  <option value="Tự nhiên và Xã hội">Tự nhiên và Xã hội</option>
                  <option value="Lịch sử và Địa lí">Lịch sử và Địa lí</option>
                  <option value="Công nghệ">Công nghệ</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Thời lượng làm bài</label>
                <select
                  value={quizDuration}
                  onChange={(e) => setQuizDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 bg-white"
                >
                  <option value="15 phút (Kiểm tra nhanh)">15 phút (Kiểm tra nhanh)</option>
                  <option value="35 phút (Kiểm tra định kỳ chuẩn)">35 phút (Kiểm tra định kỳ chuẩn)</option>
                  <option value="40 phút">40 phút</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Khung mức độ chuẩn</label>
                <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-medium">
                  Mức 1: 40% • Mức 2: 30% • Mức 3: 30%
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold text-xs mb-1">
                Phạm vi kiến thức kiểm tra (hoặc để trống để dùng bài kiểm tra chuẩn):
              </label>
              <input
                type="text"
                value={promptTopic}
                onChange={(e) => setPromptTopic(e.target.value)}
                placeholder="Ví dụ: Bảng nhân - chia, Tính giá trị biểu thức và Giải toán có lời văn"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
              />
              {/* Nạp nhanh từ kho học liệu */}
              {materials.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1.5">
                  <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                    <FolderOpen className="w-3 h-3" />
                    <span>Lấy từ Kho học liệu:</span>
                  </span>
                  {materials.slice(0, 3).map(mat => (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() => setPromptTopic(mat.title)}
                      className="px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-medium transition-colors truncate max-w-[200px]"
                      title={mat.title}
                    >
                      {mat.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-slate-700 font-semibold text-xs mb-1">
                Yêu cầu / Ghi chú riêng của giáo viên cho đề thi (tùy chọn):
              </label>
              <textarea
                rows={2}
                value={teacherCustomNotes}
                onChange={(e) => setTeacherCustomNotes(e.target.value)}
                placeholder="Ví dụ: Đề gồm 6 câu trắc nghiệm + 2 câu tự luận, có câu hỏi liên hệ thực tế địa phương Hoài Nhơn, mức độ phân hóa học sinh khá giỏi..."
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              />
            </div>
          </div>
        )}

        {/* TASK 4: LỘ TRÌNH PHỤ ĐẠO CÁ NHÂN HÓA */}
        {activeTask === 'personalized_remediation' && (
          <div className="space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 pb-2 border-b border-slate-100">
              <Brain className="w-4 h-4 text-blue-600" />
              <span>Lập Kế hoạch Bồi dưỡng & Phụ đạo cá nhân hóa (AI Remediation):</span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold text-xs mb-1">
                Chọn học sinh cần lập lộ trình bồi dưỡng:
              </label>
              <select
                value={selectedStudentForComment}
                onChange={(e) => setSelectedStudentForComment(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white font-medium"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.stt}. {st.fullName} ({st.studentCode}) - Hiện cần hỗ trợ: {st.supportGoal}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold text-xs mb-1">
                Nội dung hoặc kỹ năng cần tăng cường trong 2 tuần tới:
              </label>
              <input
                type="text"
                value={promptTopic}
                onChange={(e) => setPromptTopic(e.target.value)}
                placeholder="Ví dụ: Rèn luyện tính toán có lời văn 2 bước và phát âm từ vựng Tiếng Anh"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
              />
            </div>
          </div>
        )}

        {/* TASK 5 & 6: RUBRIC & ANNOUNCEMENT */}
        {(activeTask === 'digital_skills_rubric' || activeTask === 'announcement' || activeTask === 'positive_rules') && (
          <div className="space-y-3 animate-in fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {activeTask === 'announcement'
                  ? 'Nội dung trọng tâm cần thông báo phụ huynh:'
                  : activeTask === 'digital_skills_rubric'
                  ? 'Tiêu chí hoặc kỹ năng thế kỷ 21 cần đánh giá:'
                  : 'Chủ đề nội quy lớp học hạnh phúc:'}
              </label>
              <input
                type="text"
                value={promptTopic}
                onChange={(e) => setPromptTopic(e.target.value)}
                placeholder={
                  activeTask === 'announcement'
                    ? 'Ví dụ: Kế hoạch tuần 8, kiểm tra giữa kỳ và khen thưởng 18 huy hiệu...'
                    : activeTask === 'digital_skills_rubric'
                    ? 'Ví dụ: Đánh giá kỹ năng tra cứu an toàn và tự học cùng AI Buddy...'
                    : `Ví dụ: 5 câu thơ vè nội quy lớp học ${activeClass.name || '3C1'} hạnh phúc...`
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
              />
            </div>
          </div>
        )}

        {/* Generate Button Action */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-[11px] text-slate-500 italic">
            Áp dụng cho: Lớp {activeClass.name} • {teacherProfile.school}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-102"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'AI đang tổng hợp & soạn thảo...' : 'Tạo Nội Dung Ngay'}</span>
          </button>
        </div>

        {/* Error Alert Banner conforming strictly to AI_INSTRUCTIONS.md Section 3 */}
        {apiError && (
          <div className="mt-4 p-4 rounded-2xl bg-red-50 border-2 border-red-300 text-red-900 space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-2 text-xs sm:text-sm text-red-700">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>Trạng thái: Đã dừng do lỗi</span>
              </span>
              <button
                onClick={() => setApiKeyModalOpen(true)}
                className="px-3 py-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Đổi API Key / Model
              </button>
            </div>
            <div className="text-xs text-red-800 font-mono bg-white/80 p-2.5 rounded-xl border border-red-200 break-words">
              Nguyên văn lỗi từ API: {apiError}
            </div>
            <p className="text-[11px] text-red-700 leading-relaxed">
              Hệ thống đã tự động thử lần lượt các model dự phòng theo quy tắc (gemini-3-flash-preview ➔ gemini-3-pro-preview ➔ gemini-2.5-flash) nhưng tất cả đều gặp lỗi quota hoặc key không hợp lệ. Vui lòng kiểm tra hoặc tạo API Key mới tại Google AI Studio.
            </p>
          </div>
        )}

        {/* Output Canvas with Download & Print Controls */}
        {generatedOutput && !apiError && (
          <div className="mt-6 pt-5 border-t border-slate-200 space-y-3 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Nội dung đã sẵn sàng (Có thể xem và chỉnh sửa trực tiếp):</span>
              </span>

              <div className="flex items-center gap-1.5 flex-wrap">
                {activeTask === 'announcement' && (
                  <button
                    onClick={handlePublishAsNotification}
                    className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    title="Đăng trực tiếp thông báo này vào mục Sổ liên lạc phụ huynh"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sentAsAnnouncement ? 'Đã gửi tới phụ huynh!' : 'Đăng vào Sổ liên lạc'}</span>
                  </button>
                )}

                <button
                  onClick={handleDownloadDoc}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Tải văn bản về máy tính để lưu trữ hoặc in ấn"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tải file văn bản (.doc)</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="In trực tiếp tài liệu này"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>In tài liệu</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã sao chép!' : 'Sao chép'}</span>
                </button>
              </div>
            </div>

            <textarea
              rows={14}
              value={generatedOutput}
              onChange={(e) => setGeneratedOutput(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-300 font-mono text-xs text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="italic">
                Được chuẩn hóa theo khung chương trình GDPT 2018 của Bộ Giáo dục & Đào tạo.
              </span>
              <span>
                Giáo viên: {teacherProfile.title} {teacherProfile.name}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
