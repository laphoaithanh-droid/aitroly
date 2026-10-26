import React, { useState } from 'react';
import {
  BookOpenText,
  Volume2,
  Sparkles,
  BookOpen,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  AlertCircle,
  PenTool,
  Send,
  Users,
  Feather,
  Check
} from 'lucide-react';
import { VIETNAMESE_LESSONS } from '../../data/initialData';
import { VietnameseLesson } from '../../types';
import { speechService } from '../../services/speechService';
import { useApp } from '../../context/AppContext';

export const VietnameseWorld: React.FC = () => {
  const { triggerCelebration, currentUser, students, createAssignment, activeClass, teacherProfile } = useApp();
  const [lessons] = useState<VietnameseLesson[]>(VIETNAMESE_LESSONS);
  const [activeLessonId, setActiveLessonId] = useState<string>(VIETNAMESE_LESSONS[0].id);

  // Sub-tabs
  const [subTab, setSubTab] = useState<'reading' | 'vocab' | 'grammar' | 'writing' | 'drills' | 'assign'>('reading');

  // Interactive Quiz state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Student writing submission demo
  const [studentWriting, setStudentWriting] = useState<string>('');
  const [writingFeedback, setWritingFeedback] = useState<string | null>(null);

  // Quick Teacher Assignment
  const [assignTarget, setAssignTarget] = useState<'all' | 'group' | 'individual'>('all');
  const [selectedStudentsForAssign, setSelectedStudentsForAssign] = useState<string[]>([]);
  const [assignSuccess, setAssignSuccess] = useState(false);

  const currentLesson = lessons.find(l => l.id === activeLessonId) || lessons[0];

  const handleSpeak = (text: string) => {
    speechService.speak(text, 'vi-VN', 0.9);
  };

  const handleSelectAnswer = (qId: string, opt: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: opt }));
  };

  const handleSubmitDrills = () => {
    let s = 0;
    currentLesson.comprehensionQuestions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) s++;
    });
    setScore(s);
    setSubmitted(true);
    if (s === currentLesson.comprehensionQuestions.length) {
      triggerCelebration();
    }
  };

  const handleResetDrills = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const handleAnalyzeWriting = () => {
    if (!studentWriting.trim()) return;
    // Pedagogical encouragement & instant grammar feedback
    const hasComparison = studentWriting.includes('như') || studentWriting.includes('là') || studentWriting.includes('tựa');
    let fb = `🌟 Nhận xét từ Cô ${teacherProfile?.fullName || teacherProfile?.name || 'Giáo viên'} & Trợ lý Tiếng Việt:\n`;
    fb += '- Đoạn văn diễn đạt trong sáng, câu từ mạch lạc.\n';
    if (hasComparison) {
      fb += '- Rất khen ngợi em đã khéo léo sử dụng hình ảnh so sánh sinh động!\n';
    } else {
      fb += '- Em có thể thêm một hình ảnh so sánh (dùng từ "như", "là") để đoạn văn thêm gợi cảm hơn nhé!\n';
    }
    fb += '- Em chú ý viết hoa chữ cái đầu câu và chấm câu đầy đủ.';
    setWritingFeedback(fb);
    triggerCelebration();
  };

  const handleTeacherAssign = () => {
    createAssignment({
      title: `Tiếng Việt 3: ${currentLesson.title}`,
      subject: 'vietnamese',
      description: `Đọc diễn cảm bài đọc và hoàn thành câu hỏi đọc hiểu chủ điểm: ${currentLesson.theme}`,
      deadline: '2026-10-24',
      assignedMode: assignTarget,
      targetStudentIds: assignTarget === 'all' ? [] : selectedStudentsForAssign,
      targetGroupName: assignTarget === 'group' ? 'Nhóm rèn kỹ năng đọc - hiểu' : undefined,
      criteria: 'Đọc đúng ngắt nghỉ câu và trả lời đúng câu hỏi đọc hiểu',
      status: 'active',
      totalAssigned: assignTarget === 'all' ? students.length : selectedStudentsForAssign.length
    });
    setAssignSuccess(true);
    triggerCelebration();
    setTimeout(() => setAssignSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-rose-900 via-pink-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-rose-700/50 space-y-2 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-rose-300 text-xs font-bold border border-white/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI TIẾNG VIỆT WORLD – BỘ SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Đọc Hiểu, Luyện Từ & Câu, Luyện Viết Đoạn Văn Lớp 3
        </h2>
        <p className="text-xs sm:text-sm text-rose-100 max-w-2xl">
          Tích hợp giọng đọc mẫu AI truyền cảm, phân tích từ ngữ chỉ đặc điểm/hoạt động, câu Ai là gì/làm gì/thế nào,
          biện pháp so sánh, nhân hóa và hệ thống giao nhiệm vụ phân hóa sư phạm.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-rose-200">
          <span className="bg-white/10 px-2.5 py-1 rounded-lg">6 Chủ điểm SGK chính thức</span>
          <span>•</span>
          <span className="bg-white/10 px-2.5 py-1 rounded-lg">Writing Lab viết đoạn</span>
          <span>•</span>
          <span className="bg-white/10 px-2.5 py-1 rounded-lg">Phân hóa sư phạm ẩn danh</span>
        </div>
      </div>

      {/* 6 Theme Units Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {lessons.map((lesson) => {
          const isActive = lesson.id === activeLessonId;
          return (
            <button
              key={lesson.id}
              onClick={() => {
                setActiveLessonId(lesson.id);
                handleResetDrills();
                setWritingFeedback(null);
              }}
              className={`p-3.5 rounded-2xl text-left transition-all duration-150 border flex flex-col justify-between ${
                isActive
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md scale-102 font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300 hover:bg-rose-50/50'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider opacity-80 line-clamp-1">
                Chủ điểm
              </div>
              <div className="text-xs font-bold mt-1 line-clamp-2">
                {lesson.title}
              </div>
              <div className="text-[10px] mt-2 opacity-75 line-clamp-1">
                {lesson.theme}
              </div>
            </button>
          );
        })}
      </div>

      {/* Sub navigation inside lesson */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{currentLesson.title}</h3>
            <p className="text-xs text-slate-500">Chủ điểm: {currentLesson.theme}</p>
          </div>

          <div className="flex flex-wrap p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs">
            <button
              onClick={() => setSubTab('reading')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                subTab === 'reading' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              1. Bài đọc & Audio
            </button>
            <button
              onClick={() => setSubTab('vocab')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                subTab === 'vocab' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              2. Mở rộng vốn từ
            </button>
            <button
              onClick={() => setSubTab('grammar')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                subTab === 'grammar' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              3. Luyện từ và câu
            </button>
            <button
              onClick={() => setSubTab('writing')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                subTab === 'writing' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              4. Góc luyện viết đoạn
            </button>
            <button
              onClick={() => setSubTab('drills')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                subTab === 'drills' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              5. Đọc hiểu tương tác
            </button>
            {currentUser.role === 'teacher' && (
              <button
                onClick={() => setSubTab('assign')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  subTab === 'assign' ? 'bg-purple-600 text-white shadow-xs' : 'text-purple-700 bg-purple-50'
                }`}
              >
                Giao bài phân hóa
              </button>
            )}
          </div>
        </div>

        {/* 1. BÀI ĐỌC & AUDIO MẪU */}
        {subTab === 'reading' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {currentLesson.readingPassage.title}
                  </h4>
                  {currentLesson.readingPassage.author && (
                    <span className="text-xs text-slate-500 italic">
                      Tác giả: {currentLesson.readingPassage.author}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleSpeak(currentLesson.readingPassage.paragraphs.join(' '))}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe đọc mẫu truyền cảm</span>
                </button>
              </div>

              <div className="space-y-3 font-serif text-slate-800 text-sm leading-relaxed">
                {currentLesson.readingPassage.paragraphs.map((p, idx) => (
                  <p key={idx} className="indent-6">
                    {p}
                  </p>
                ))}
              </div>

              {/* Chú thích từ khó */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Giải nghĩa từ ngữ khó & Thành ngữ:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentLesson.readingPassage.difficultWordsGlossary.map((g, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                      <span className="font-bold text-rose-700">{g.word}: </span>
                      <span className="text-slate-600">{g.explanation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MỞ RỘNG VỐN TỪ */}
        {subTab === 'vocab' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500">
              Ngân hàng từ ngữ theo chủ điểm bám sát sách Kết nối tri thức với cuộc sống:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentLesson.wordBank.map((wb, i) => (
                <div key={i} className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-rose-900">{wb.word}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-rose-700 border border-rose-200">
                      {wb.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{wb.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. LUYỆN TỪ VÀ CÂU */}
        {subTab === 'grammar' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="p-5 rounded-3xl bg-indigo-50 border border-indigo-200 space-y-2">
              <span className="text-xs font-extrabold uppercase text-indigo-700 tracking-wider">
                Trọng tâm ngữ pháp & Biện pháp tu từ Lớp 3
              </span>
              <h4 className="text-base font-bold text-indigo-950">
                {currentLesson.grammarFocus.topic}
              </h4>
              <p className="text-xs text-indigo-800 leading-relaxed">
                {currentLesson.grammarFocus.explanation}
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Câu văn mẫu tiêu biểu:
              </span>
              <ul className="space-y-2">
                {currentLesson.grammarFocus.examples.map((ex, i) => (
                  <li key={i} className="p-3 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800">
                    "{ex}"
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 4. GÓC LUYỆN VIẾT ĐOẠN VĂN (WRITING LAB) */}
        {subTab === 'writing' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-amber-700" />
                <h4 className="text-sm font-bold text-amber-950">
                  Đề bài: {currentLesson.writingLab.prompt}
                </h4>
              </div>

              <div className="space-y-1 text-xs text-amber-900">
                <span className="font-bold block">Các bước gợi ý viết đoạn:</span>
                {currentLesson.writingLab.stepGuides.map((guide, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="font-bold">•</span>
                    <span>{guide}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Student input box */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Góc viết của em (Học sinh lớp {activeClass?.name || '3C1'}):
              </label>
              <textarea
                rows={4}
                value={studentWriting}
                onChange={(e) => setStudentWriting(e.target.value)}
                placeholder="Em hãy viết đoạn văn từ 3-5 câu theo gợi ý ở trên nhé..."
                className="w-full p-4 rounded-2xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleAnalyzeWriting}
                  disabled={!studentWriting.trim()}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi bài để cô giáo & AI góp ý</span>
                </button>
              </div>
            </div>

            {writingFeedback && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 whitespace-pre-line animate-in fade-in">
                {writingFeedback}
              </div>
            )}

            {/* Đoạn văn tham khảo */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block">Đoạn văn tham khảo đạt chuẩn:</span>
              <p className="italic">"{currentLesson.writingLab.sampleParagraph}"</p>
            </div>
          </div>
        )}

        {/* 5. ĐỌC HIỂU TƯƠNG TÁC (DRILLS) */}
        {subTab === 'drills' && (
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">Câu hỏi kiểm tra đọc hiểu</h4>
              {submitted && (
                <span className="text-xs font-bold text-rose-700">
                  Đạt: {score}/{currentLesson.comprehensionQuestions.length} câu đúng
                </span>
              )}
            </div>

            <div className="space-y-3">
              {currentLesson.comprehensionQuestions.map((q, idx) => {
                const selected = answers[q.id];
                const isCorrect = selected === q.correctAnswer;

                return (
                  <div key={q.id} className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">{q.question}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt) => {
                        const isThisSelected = selected === opt;
                        let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-rose-300';

                        if (submitted) {
                          if (opt === q.correctAnswer) {
                            btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                          } else if (isThisSelected && !isCorrect) {
                            btnStyle = 'bg-rose-100 border-rose-500 text-rose-900 line-through';
                          }
                        } else if (isThisSelected) {
                          btnStyle = 'bg-rose-600 border-rose-600 text-white font-bold';
                        }

                        return (
                          <button
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleSelectAnswer(q.id, opt)}
                            className={`p-2.5 rounded-xl border text-xs text-left transition-all ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {submitted && (
                      <div className="text-xs text-slate-600 pt-2 border-t border-slate-200">
                        <span className="font-bold text-rose-700">Giải thích: </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {submitted ? (
                <button
                  onClick={handleResetDrills}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-md"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Làm lại bài</span>
                </button>
              ) : (
                <button
                  onClick={handleSubmitDrills}
                  disabled={Object.keys(answers).length === 0}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs transition-colors shadow-md flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Nộp bài & Chấm điểm</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* 6. GIAO BÀI PHÂN HÓA (TEACHER ASSIGNMENT SYSTEM) */}
        {subTab === 'assign' && currentUser.role === 'teacher' && (
          <div className="space-y-4 max-w-2xl mx-auto p-6 rounded-3xl bg-purple-50/70 border border-purple-200">
            <h4 className="text-sm font-bold text-purple-950 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-700" />
              <span>Giao nhiệm vụ phân hóa sư phạm cho bài học: {currentLesson.title}</span>
            </h4>

            {assignSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Đã giao bài thành công tới đối tượng chỉ định!</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Chế độ giao bài:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setAssignTarget('all')}
                    className={`p-2.5 rounded-xl border text-center font-bold ${
                      assignTarget === 'all'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Cả lớp {activeClass?.name || '3C1'} ({students.length} bạn)
                  </button>
                  <button
                    onClick={() => setAssignTarget('group')}
                    className={`p-2.5 rounded-xl border text-center font-bold ${
                      assignTarget === 'group'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Theo nhóm năng lực
                  </button>
                  <button
                    onClick={() => setAssignTarget('individual')}
                    className={`p-2.5 rounded-xl border text-center font-bold ${
                      assignTarget === 'individual'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Từng cá nhân cụ thể
                  </button>
                </div>
              </div>

              {assignTarget !== 'all' && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Chọn học sinh nhận nhiệm vụ (ẩn danh sư phạm):
                  </label>
                  <div className="max-h-40 overflow-y-auto grid grid-cols-2 gap-1.5 p-2 bg-white rounded-xl border border-slate-200">
                    {students.map((st) => (
                      <label key={st.id} className="flex items-center gap-2 p-1.5 hover:bg-purple-50 rounded">
                        <input
                          type="checkbox"
                          checked={selectedStudentsForAssign.includes(st.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudentsForAssign(prev => [...prev, st.id]);
                            } else {
                              setSelectedStudentsForAssign(prev => prev.filter(id => id !== st.id));
                            }
                          }}
                        />
                        <span className="text-[11px] font-medium text-slate-800">
                          {st.stt}. {st.fullName}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={handleTeacherAssign}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md"
                >
                  Xác nhận giao nhiệm vụ cho học sinh
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Cơ chế quản trị & Tuyên bố trách nhiệm: </span>
            Hệ thống không tự động tuyên bố nội dung hoàn toàn trùng khớp 100% với phiên bản sách giáo khoa in chính thức
            nếu ngữ liệu và câu hỏi chưa được giáo viên/tổ chuyên môn nhà trường đối chiếu, chuẩn hóa theo phân phối chương trình của trường Tiểu học Hoài Nhơn.
          </div>
        </div>
      </div>
    </div>
  );
};
