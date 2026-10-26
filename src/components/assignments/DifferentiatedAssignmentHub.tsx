import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Layers,
  ClipboardCheck,
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Users,
  UserCheck,
  ChevronRight,
  Printer,
  Copy,
  CheckCheck,
  Star,
  FileText,
  Calendar,
  Send,
  RefreshCw,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AbilityTier, Assignment, AssignmentQuestion, Student, StudentGrowthReport } from '../../types';

export const DifferentiatedAssignmentHub: React.FC = () => {
  const {
    students,
    activeClass,
    assignments,
    autoAssignDifferentiatedTasks,
    submitAssignmentWithEvaluation,
    generateStudentProgressReport,
    updateStudentAbilityTier,
    triggerCelebration,
    authSession
  } = useApp();

  const [activeTab, setActiveTab] = useState<'generate' | 'assignments' | 'analytics'>('generate');

  // Generator Tab State
  const [selectedSubject, setSelectedSubject] = useState<string>('math');
  const [topicInput, setTopicInput] = useState<string>('Bảng nhân 7 và vận dụng thực tế');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genSuccessMessage, setGenSuccessMessage] = useState<string>('');

  // Assignments & Grading Tab State
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(assignments[0]?.id || '');
  const [selectedStudentForGrading, setSelectedStudentForGrading] = useState<Student | null>(null);
  const [gradingScore, setGradingScore] = useState<number>(9);
  const [gradingFeedback, setGradingFeedback] = useState<string>('Em hoàn thành bài rất tốt, tư duy logic và lập luận rõ ràng!');
  const [isGradingModalOpen, setIsGradingModalOpen] = useState<boolean>(false);

  // Analytics Tab State
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student>(students[0] || null);
  const [currentReport, setCurrentReport] = useState<StudentGrowthReport | null>(null);
  const [copiedZaloReport, setCopiedZaloReport] = useState<boolean>(false);

  // Group students by Ability Tier
  const tierGroups = useMemo(() => {
    const advanced: Student[] = [];
    const proficient: Student[] = [];
    const remedial: Student[] = [];

    students.forEach((s) => {
      const tier = s.abilityTier || (s.learningProgress >= 88 ? 'advanced' : s.learningProgress >= 70 ? 'proficient' : 'remedial');
      if (tier === 'advanced') advanced.push(s);
      else if (tier === 'remedial') remedial.push(s);
      else proficient.push(s);
    });

    return { advanced, proficient, remedial };
  }, [students]);

  // Selected assignment object
  const currentAssignment = useMemo(() => {
    return assignments.find((a) => a.id === selectedAssignmentId) || assignments[0] || null;
  }, [assignments, selectedAssignmentId]);

  // Handle AI Auto Assign Generation
  const handleAutoAssign = () => {
    if (!topicInput.trim()) return;
    setIsGenerating(true);
    setGenSuccessMessage('');

    setTimeout(() => {
      const res = autoAssignDifferentiatedTasks(
        activeClass.id,
        selectedSubject,
        topicInput.trim()
      );
      setIsGenerating(false);
      setGenSuccessMessage(
        res.message || `AI đã sinh thành công 3 bộ đề phân hóa cho nhóm Nâng cao (${tierGroups.advanced.length} HS), nhóm Đạt chuẩn (${tierGroups.proficient.length} HS) và nhóm Cần hỗ trợ (${tierGroups.remedial.length} HS)!`
      );
      if (res.createdAssignments && res.createdAssignments.length > 0) {
        setSelectedAssignmentId(res.createdAssignments[0].id);
      }
      triggerCelebration();
    }, 600);
  };

  // Handle open grading modal for a student
  const handleOpenGrading = (st: Student) => {
    setSelectedStudentForGrading(st);
    // Find if already submitted
    const existingSub = currentAssignment?.submissions?.find((s) => s.studentId === st.id);
    if (existingSub) {
      setGradingScore(existingSub.score || 9);
      setGradingFeedback(existingSub.teacherFeedback || 'Em làm bài tiến bộ đáng khen ngợi!');
    } else {
      const defaultScore = st.learningProgress >= 88 ? 10 : st.learningProgress >= 70 ? 8 : 7;
      setGradingScore(defaultScore);
      setGradingFeedback('Em đã hiểu bài, thực hiện đúng yêu cầu và có nỗ lực tiến bộ rõ nét.');
    }
    setIsGradingModalOpen(true);
  };

  // Submit Grade & Growth Evaluation
  const handleSaveGrading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAssignment || !selectedStudentForGrading) return;

    submitAssignmentWithEvaluation(
      currentAssignment.id,
      selectedStudentForGrading.id,
      { '1': 'A', '2': 'B', '3': 'C' },
      Number(gradingScore),
      gradingFeedback
    );

    setIsGradingModalOpen(false);
    triggerCelebration();
  };

  // Generate TT27 Progress Report
  const handleViewReport = (st: Student) => {
    setSelectedStudentForReport(st);
    const report = generateStudentProgressReport(st.id);
    setCurrentReport(report);
  };

  // Copy report for Zalo
  const handleCopyZaloReport = () => {
    if (!currentReport) return;
    const content = `[PHIẾU ĐÁNH GIÁ TIẾN BỘ HỌC SINH THEO THÔNG TƯ 27]
Trường: Trường Tiểu học Hoài Nhơn
Lớp: ${activeClass.name} | Năm học 2026-2027
Họ và tên: ${currentReport.studentName} (Mã: ${currentReport.studentCode})
-----------------------------------
- Mức độ hoàn thành: ${currentReport.tt27Evaluation.achievementLevel === 'T' ? 'Hoàn thành Tốt (T)' : currentReport.tt27Evaluation.achievementLevel === 'H' ? 'Hoàn thành (H)' : 'Cần cố gắng (C)'}
- Tiến độ học tập hiện tại: ${currentReport.currentProgress}% (Tăng trưởng +${currentReport.growthPercentage}% so với đầu kỳ)
- Nhóm năng lực: ${currentReport.currentTier === 'advanced' ? 'Hoàn thành Tốt (Nâng cao)' : currentReport.currentTier === 'remedial' ? 'Cần hỗ trợ' : 'Đạt chuẩn'}
- Điểm đánh giá trung bình bài tập: ${currentReport.averageScore}/10

* ĐIỂM MẠNH NỔI BẬT:
${currentReport.tt27Evaluation.strengths.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}

* NỘI DUNG CẦN TIẾP TỤC RÈN LUYỆN:
${currentReport.tt27Evaluation.weaknesses.map((w, i) => `  - ${w}`).join('\n')}

* KHUYẾN NGHỊ DÀNH CHO PHỤ HUYNH:
${currentReport.tt27Evaluation.recommendationsForParent}

(Thầy/Cô chủ nhiệm gửi đến Quý phụ huynh để cùng đồng hành với học sinh!)`;

    navigator.clipboard.writeText(content);
    setCopiedZaloReport(true);
    setTimeout(() => setCopiedZaloReport(false), 2500);
  };

  // Subject options
  const subjects = [
    { id: 'math', name: 'Toán học', icon: '📐', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'vietnamese', name: 'Tiếng Việt', icon: '📖', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { id: 'english', name: 'Tiếng Anh', icon: '🌐', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { id: 'informatics', name: 'Tin học', icon: '💻', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    { id: 'ethics', name: 'Đạo đức', icon: '🌱', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 'nature-society', name: 'Tự nhiên và Xã hội', icon: '🌍', color: 'bg-teal-50 text-teal-700 border-teal-200' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Ribbon */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>GIAO BÀI TẬP PHÂN HÓA NĂNG LỰC & ĐÁNH GIÁ TIẾN BỘ THEO THÔNG TƯ 27</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[11px] font-bold">
              Lớp {activeClass.name}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Hệ Thống Phân Hóa Bài Tập Tự Động & Thống Kê Tăng Trưởng
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tự động chia bài tập thành 3 mức độ (Hoàn thành Tốt, Hoàn thành, Cần hỗ trợ), chấm bài và theo dõi tỷ lệ tiến bộ cá nhân hóa
          </p>
        </div>

        {/* 3 Tier Summary Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-2 rounded-2xl bg-purple-50 border border-purple-200 text-center">
            <div className="text-[10px] font-bold text-purple-600 uppercase">Hoàn thành Tốt</div>
            <div className="text-sm font-black text-purple-900">{tierGroups.advanced.length} HS (Nâng cao)</div>
          </div>
          <div className="px-3 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <div className="text-[10px] font-bold text-emerald-600 uppercase">Hoàn thành</div>
            <div className="text-sm font-black text-emerald-900">{tierGroups.proficient.length} HS (Đạt chuẩn)</div>
          </div>
          <div className="px-3 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <div className="text-[10px] font-bold text-amber-600 uppercase">Cần hỗ trợ</div>
            <div className="text-sm font-black text-amber-900">{tierGroups.remedial.length} HS (Phụ đạo)</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('generate')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'generate'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>1. AI Giao Bài Tập Phân Hóa</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'assignments'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>2. Danh Sách Bài Tập & Nộp / Chấm Bài</span>
          <span className="w-5 h-5 rounded-full bg-white/20 text-center text-[10px] leading-5 font-bold">
            {assignments.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('analytics');
            if (!currentReport && students[0]) {
              handleViewReport(students[0]);
            }
          }}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>3. Phân Tích & Đánh Giá Sự Tiến Bộ (TT 27)</span>
        </button>
      </div>

      {/* ================= TAB 1: AI GENERATE DIFFERENTIATED ASSIGNMENT ================= */}
      {activeTab === 'generate' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>Thiết Lập Yêu Cầu & Chủ Đề Để AI Tự Động Tạo 3 Đề Phân Hóa</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                AI sẽ căn cứ vào chương trình GDPT 2018 và tiêu chí Thông tư 27 để tự động sinh 3 phiên bản bài tập thích hợp cho từng nhóm học sinh trong lớp {activeClass.name}.
              </p>
            </div>

            {/* Subject Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">1. Chọn Môn học:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {subjects.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedSubject(sub.id)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      selectedSubject === sub.id
                        ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                    }`}
                  >
                    <span className="text-xl mb-1">{sub.icon}</span>
                    <span className="text-xs font-bold text-slate-900">{sub.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                2. Nhập Chủ đề / Tên bài học muốn giao:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="Ví dụ: Bảng nhân 7 và bài toán có lời văn, Mở rộng vốn từ Bạn bè..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAutoAssign}
                  disabled={isGenerating || !topicInput.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all shrink-0 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isGenerating ? 'AI đang sinh 3 đề...' : '✨ Tự động tạo 3 đề & Phân phối'}</span>
                </button>
              </div>
            </div>

            {/* Success message */}
            {genSuccessMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-semibold flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <div>{genSuccessMessage}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('assignments')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] inline-flex items-center gap-1"
                    >
                      <span>Xem & chấm bài ngay</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Explanation of the 3 Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-purple-200 text-purple-900 font-black text-[10px]">
                    MỨC 3: NÂNG CAO
                  </span>
                  <span className="text-xs font-bold text-purple-700">{tierGroups.advanced.length} Học sinh</span>
                </div>
                <h4 className="text-xs font-black text-slate-900">Nhóm Hoàn Thành Tốt</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Đề bài tập trung vào bài toán vận dụng cao, phân tích tổng hợp, tư duy sáng tạo và liên hệ thực tiễn mở rộng.
                </p>
                <div className="text-[10px] text-purple-800 font-semibold bg-white/70 p-2 rounded-lg border border-purple-100">
                  🎯 Mục tiêu: Bồi dưỡng năng khiếu và rèn luyện giải quyết vấn đề phức hợp.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 font-black text-[10px]">
                    MỨC 2: ĐẠT CHUẨN
                  </span>
                  <span className="text-xs font-bold text-emerald-700">{tierGroups.proficient.length} Học sinh</span>
                </div>
                <h4 className="text-xs font-black text-slate-900">Nhóm Hoàn Thành</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Đề bài bám sát chuẩn kiến thức, kỹ năng cốt lõi của chương trình GDPT 2018 theo bài học trên lớp.
                </p>
                <div className="text-[10px] text-emerald-800 font-semibold bg-white/70 p-2 rounded-lg border border-emerald-100">
                  🎯 Mục tiêu: Củng cố vững chắc lý thuyết và kỹ năng làm bài thuần thục.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 font-black text-[10px]">
                    MỨC 1: PHỤ ĐẠO
                  </span>
                  <span className="text-xs font-bold text-amber-700">{tierGroups.remedial.length} Học sinh</span>
                </div>
                <h4 className="text-xs font-black text-slate-900">Nhóm Cần Hỗ Trợ</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Đề bài chia nhỏ từng bước, có hình ảnh minh họa và gợi ý tư duy trực tiếp từ AI Buddy (không cho đáp án).
                </p>
                <div className="text-[10px] text-amber-800 font-semibold bg-white/70 p-2 rounded-lg border border-amber-100">
                  🎯 Mục tiêu: Giúp học sinh tự tin, lấp lỗ hổng kiến thức từng ngày.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: ASSIGNMENTS & GRADING ================= */}
      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Left Column: List of Assignments */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Danh sách bài tập ({assignments.length})
            </h3>
            <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
              {assignments.map((asgn) => {
                const isSelected = asgn.id === selectedAssignmentId;
                const tier = asgn.targetAbilityTier;
                return (
                  <div
                    key={asgn.id}
                    onClick={() => setSelectedAssignmentId(asgn.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tier === 'advanced'
                          ? 'bg-purple-100 text-purple-700'
                          : tier === 'remedial'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {tier === 'advanced' ? '🌟 Nâng cao' : tier === 'remedial' ? '🔶 Phụ đạo' : '✅ Đạt chuẩn'}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {asgn.deadline}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {asgn.title}
                    </h4>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{asgn.targetGroupName || 'Toàn bộ học sinh'}</span>
                      <span className="font-bold text-indigo-700">
                        {asgn.submissionsCount || 0}/{asgn.totalAssigned} đã nộp
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Assignment Details & Student Submissions Grid */}
          <div className="lg:col-span-2 space-y-4">
            {currentAssignment ? (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                        currentAssignment.targetAbilityTier === 'advanced'
                          ? 'bg-purple-100 text-purple-700'
                          : currentAssignment.targetAbilityTier === 'remedial'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {currentAssignment.targetGroupName}
                      </span>
                      <span className="text-xs text-slate-400">|</span>
                      <span className="text-xs font-semibold text-slate-600">
                        Môn: {currentAssignment.subject.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-slate-900">
                      {currentAssignment.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {currentAssignment.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-slate-700">
                      Đã chấm / nộp: <span className="text-indigo-600 font-black">{currentAssignment.submissionsCount || 0}</span> / {currentAssignment.totalAssigned}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Hạn nộp: {currentAssignment.deadline}</div>
                  </div>
                </div>

                {/* Questions Preview */}
                {currentAssignment.questions && currentAssignment.questions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Nội dung bộ câu hỏi ({currentAssignment.questions.length} câu)</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      {currentAssignment.questions.map((q, idx) => (
                        <div key={q.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                          <div className="font-bold text-indigo-700">Câu {idx + 1}:</div>
                          <div className="font-medium text-slate-800 line-clamp-2">{q.question}</div>
                          {q.hint && (
                            <div className="text-[10px] text-amber-700 bg-amber-50 p-1 rounded border border-amber-200">
                              💡 {q.hint}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Target Student Submissions & Grading Table */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                    <span>Danh sách học sinh nhận bài tập này</span>
                    <span className="text-[11px] text-indigo-600 lowercase font-normal">
                      * Nhấp vào học sinh để chấm bài & nhận xét Thông tư 27
                    </span>
                  </h4>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3 text-center w-12">STT</th>
                          <th className="py-2.5 px-3">Mã HS</th>
                          <th className="py-2.5 px-4">Họ và tên</th>
                          <th className="py-2.5 px-3 text-center">Trạng thái</th>
                          <th className="py-2.5 px-3 text-center">Điểm số</th>
                          <th className="py-2.5 px-3 text-center">Tăng trưởng</th>
                          <th className="py-2.5 px-3 text-center">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {students
                          .filter((st) => {
                            if (currentAssignment.assignedMode === 'all') return true;
                            if (currentAssignment.targetStudentIds?.includes(st.id)) return true;
                            const tier = st.abilityTier || (st.learningProgress >= 88 ? 'advanced' : st.learningProgress >= 70 ? 'proficient' : 'remedial');
                            return tier === currentAssignment.targetAbilityTier;
                          })
                          .map((st) => {
                            const sub = currentAssignment.submissions?.find((s) => s.studentId === st.id);
                            return (
                              <tr key={st.id} className="hover:bg-indigo-50/30 transition-colors">
                                <td className="py-2.5 px-3 text-center font-bold text-slate-500">{st.stt}</td>
                                <td className="py-2.5 px-3 font-semibold text-purple-700">{st.studentCode}</td>
                                <td className="py-2.5 px-4 font-bold text-slate-900">{st.fullName}</td>
                                <td className="py-2.5 px-3 text-center">
                                  {sub ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      Đã chấm
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                                      Chưa nộp
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                                  {sub ? (
                                    <span className="text-indigo-600 font-mono text-sm">{sub.score}/10</span>
                                  ) : (
                                    '--'
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-center font-bold">
                                  {sub?.aiProgressEvaluation ? (
                                    <span className="inline-flex items-center text-emerald-600 text-xs">
                                      +{sub.aiProgressEvaluation.growthScore}%
                                      <ArrowUpRight className="w-3 h-3" />
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 text-xs">--</span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <button
                                    onClick={() => handleOpenGrading(st)}
                                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] shadow-xs transition-colors"
                                  >
                                    {sub ? 'Chấm lại' : 'Chấm điểm'}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-400">
                Chưa có bài tập nào được chọn.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: GROWTH ANALYTICS & TT27 REPORT ================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Class Overall Growth Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-md">
              <div className="text-xs font-semibold text-indigo-200">Tiến độ trung bình lớp</div>
              <div className="text-3xl font-black mt-1">
                {Math.round(
                  students.reduce((acc, s) => acc + s.learningProgress, 0) / (students.length || 1)
                )}%
              </div>
              <div className="text-[11px] text-indigo-100 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
                <span>Tăng trưởng trung bình: <strong className="text-emerald-300">+5.4%</strong> tuần qua</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-purple-700">Hoàn thành Tốt (T)</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {tierGroups.advanced.length} <span className="text-xs font-normal text-slate-400">({Math.round((tierGroups.advanced.length / students.length) * 100)}%)</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Năng lực tiếp thu và vận dụng xuất sắc</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-emerald-700">Hoàn thành (H)</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {tierGroups.proficient.length} <span className="text-xs font-normal text-slate-400">({Math.round((tierGroups.proficient.length / students.length) * 100)}%)</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Nắm vững kiến thức trọng tâm</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-amber-700">Cần hỗ trợ (C)</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {tierGroups.remedial.length} <span className="text-xs font-normal text-slate-400">({Math.round((tierGroups.remedial.length / students.length) * 100)}%)</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Được AI Buddy trợ giúp & phụ đạo mỗi ngày</p>
            </div>
          </div>

          {/* Student Selector Toolbar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-700 shrink-0">Chọn học sinh đánh giá:</span>
              <select
                value={selectedStudentForReport?.id || ''}
                onChange={(e) => {
                  const st = students.find((s) => s.id === e.target.value);
                  if (st) handleViewReport(st);
                }}
                className="w-full md:w-72 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.stt}. {st.fullName} ({st.studentCode}) - {st.learningProgress}%
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>In Phiếu Đánh Giá</span>
              </button>

              <button
                type="button"
                onClick={handleCopyZaloReport}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
              >
                {copiedZaloReport ? <CheckCheck className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedZaloReport ? 'Đã sao chép!' : 'Sao chép gửi Zalo Phụ huynh'}</span>
              </button>
            </div>
          </div>

          {/* Detailed Progress Card (TT 27 Criteria) */}
          {currentReport && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              {/* Header Ribbon of the Progress Card */}
              <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-amber-300 text-[10px] font-bold">
                      PHIẾU ĐÁNH GIÁ SỰ TIẾN BỘ HỌC SINH (TT 27/2020/TT-BGDĐT)
                    </span>
                    <span className="text-white/60 text-xs">|</span>
                    <span className="text-xs text-white/90">Lớp {activeClass.name} - Trường TH Hoài Nhơn</span>
                  </div>
                  <h3 className="text-xl font-black text-white">
                    {currentReport.studentName} <span className="text-sm font-normal text-indigo-200">({currentReport.studentCode})</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Được đánh giá tự động dựa trên kết quả {currentReport.totalAssignmentsCompleted} bài tập phân hóa đã nộp và chấm điểm.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/10 rounded-2xl text-center border border-white/10">
                    <div className="text-[10px] text-indigo-200 font-bold uppercase">Mức Đạt Chuẩn</div>
                    <div className="text-2xl font-black text-amber-300">
                      {currentReport.tt27Evaluation.achievementLevel}
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-500/20 rounded-2xl text-center border border-emerald-400/30">
                    <div className="text-[10px] text-emerald-200 font-bold uppercase">Tăng Trưởng</div>
                    <div className="text-2xl font-black text-emerald-300 flex items-center justify-center">
                      +{currentReport.growthPercentage}%
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Core Skills Growth Bars */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">
                  Thước đo 4 năng lực môn học cốt lõi
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(currentReport.skillGrowth).map(([skillKey, data]) => {
                    const skillLabels: Record<string, { name: string; color: string }> = {
                      math: { name: 'Toán học', color: 'bg-emerald-600' },
                      vietnamese: { name: 'Tiếng Việt', color: 'bg-rose-600' },
                      english: { name: 'Tiếng Anh', color: 'bg-indigo-600' },
                      informatics: { name: 'Tin học', color: 'bg-cyan-600' }
                    };
                    const label = skillLabels[skillKey] || { name: skillKey, color: 'bg-slate-600' };

                    return (
                      <div key={skillKey} className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span className="text-slate-800">{label.name}</span>
                          <span className="text-indigo-600 font-black">{data.after}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                          <div
                            className={`${label.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${data.after}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
                          <ArrowUpRight className="w-3 h-3" />
                          <span>Tăng +{data.change}% so với bài tập trước</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pedagogical Observations Grid (Strengths, Weaknesses, Recommendations) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Strengths */}
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <h4 className="text-xs font-black text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Điểm mạnh và sự tiến bộ nổi bật</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-emerald-950">
                    {currentReport.tt27Evaluation.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas for Growth */}
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <h4 className="text-xs font-black text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>Nội dung cần tiếp tục rèn luyện thêm</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-amber-950">
                    {currentReport.tt27Evaluation.weaknesses.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations for Teacher */}
                <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                  <h4 className="text-xs font-black text-purple-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>Biện pháp sư phạm khuyến nghị cho Giáo viên</span>
                  </h4>
                  <p className="text-xs text-purple-950 leading-relaxed">
                    {currentReport.tt27Evaluation.recommendationsForTeacher}
                  </p>
                </div>

                {/* Recommendations for Parent */}
                <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                  <h4 className="text-xs font-black text-blue-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                    <span>Khuyến nghị đồng hành dành cho Phụ huynh</span>
                  </h4>
                  <p className="text-xs text-blue-950 leading-relaxed">
                    {currentReport.tt27Evaluation.recommendationsForParent}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: QUICK GRADING & FEEDBACK ================= */}
      {isGradingModalOpen && selectedStudentForGrading && currentAssignment && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-indigo-700 to-purple-800 text-white">
              <div className="text-[10px] font-bold text-indigo-200 uppercase">
                CHẤM ĐIỂM & ĐÁNH GIÁ TIẾN BỘ THÔNG TƯ 27
              </div>
              <h3 className="text-base font-black text-white mt-0.5">
                {selectedStudentForGrading.fullName} ({selectedStudentForGrading.studentCode})
              </h3>
              <p className="text-xs text-indigo-100 mt-1">
                Bài tập: {currentAssignment.title}
              </p>
            </div>

            <form onSubmit={handleSaveGrading} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. Điểm số (Thang điểm 10):
                </label>
                <div className="flex items-center gap-2">
                  {[6, 7, 8, 9, 10].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setGradingScore(score)}
                      className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                        gradingScore === score
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Lời nhận xét sư phạm (sẽ gửi vào sổ liên lạc):
                </label>
                <textarea
                  rows={3}
                  value={gradingFeedback}
                  onChange={(e) => setGradingFeedback(e.target.value)}
                  placeholder="Nhập nhận xét cụ thể sự tiến bộ của học sinh..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Hệ thống sẽ tự động tính tỷ lệ tăng trưởng <strong>+4% đến +6%</strong> và nâng điểm kỹ năng tương ứng của em trên CSDL đám mây.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGradingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lưu & Đánh Giá Tiến Bộ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
