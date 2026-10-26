import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  AlertCircle,
  Bot,
  Plus,
  Edit3,
  Calendar,
  Send,
  Users,
  Check,
  ChevronRight,
  GraduationCap,
  FlaskConical,
  Compass,
  Trees,
  HeartHandshake,
  Cpu,
  Palette,
  Music,
  Activity,
  Globe,
  Award,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { speechService } from '../../services/speechService';
import { geminiService } from '../../services/geminiService';
import { GenericLesson } from '../../types';

export const SubjectWorld: React.FC = () => {
  const {
    subjects,
    activeSubjectId,
    setActiveSubjectId,
    genericLessons,
    selectedGrade,
    setSelectedGrade,
    triggerCelebration,
    currentUser,
    students,
    createAssignment,
    setLessonEditorOpen,
    setEditingLesson
  } = useApp();

  const currentSubject = subjects.find(s => s.id === activeSubjectId) || subjects[0];

  // Filter lessons by subject and grade (or all lessons of this subject if grade has none)
  const availableLessons = genericLessons.filter(l => l.subjectId === currentSubject.id);
  const gradeFilteredLessons = availableLessons.filter(l => l.grade === selectedGrade);
  const lessonsToDisplay = gradeFilteredLessons.length > 0 ? gradeFilteredLessons : availableLessons;

  const [activeLessonId, setActiveLessonId] = useState<string>(
    lessonsToDisplay[0]?.id || ''
  );

  const [activeTab, setActiveTab] = useState<'theory' | 'drills' | 'aitutor' | 'assign'>('theory');

  // Interactive Quiz state
  const [drillAnswers, setDrillAnswers] = useState<Record<string, string>>({});
  const [drillSubmitted, setDrillSubmitted] = useState<boolean>(false);
  const [drillScore, setDrillScore] = useState<number>(0);
  const [showHintId, setShowHintId] = useState<string | null>(null);

  // Audio playing indicator
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);

  // AI Tutor prompt state
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiChatMessages, setAiChatMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Quick Teacher Assignment state
  const [assignTarget, setAssignTarget] = useState<'all' | 'group' | 'individual'>('all');
  const [selectedStudentsForAssign, setSelectedStudentsForAssign] = useState<string[]>([]);
  const [assignDeadline, setAssignDeadline] = useState<string>('2026-10-24');
  const [assignCriteria, setAssignCriteria] = useState<string>('Hoàn thành bài tập trắc nghiệm và nắm vững kiến thức trọng tâm');
  const [assignSuccess, setAssignSuccess] = useState<boolean>(false);

  const currentLesson = lessonsToDisplay.find(l => l.id === activeLessonId) || lessonsToDisplay[0];

  const handleSpeak = (text: string) => {
    setSpeakingWord(text);
    speechService.speak(text, 'vi-VN', 0.88, () => setSpeakingWord(null));
  };

  const handleSelectAnswer = (qId: string, opt: string) => {
    if (drillSubmitted) return;
    setDrillAnswers(prev => ({ ...prev, [qId]: opt }));
  };

  const handleSubmitDrills = () => {
    if (!currentLesson?.drills?.length) return;
    let score = 0;
    currentLesson.drills.forEach(d => {
      if (drillAnswers[d.id] === d.correctAnswer) score++;
    });
    setDrillScore(score);
    setDrillSubmitted(true);
    if (score === currentLesson.drills.length) {
      triggerCelebration();
    }
  };

  const handleResetDrills = () => {
    setDrillAnswers({});
    setDrillSubmitted(false);
    setDrillScore(0);
    setShowHintId(null);
  };

  const handleAskAiTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim() || isAiThinking) return;

    const userText = aiQuestion.trim();
    setAiQuestion('');
    setAiChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsAiThinking(true);

    try {
      const prompt = `Em là học sinh lớp ${selectedGrade}. Em đang học bài "${currentLesson?.title || currentSubject.name}" môn ${currentSubject.name}. Câu hỏi của em là: ${userText}`;
      const res = await geminiService.sendBuddyMessage(
        prompt,
        aiChatMessages.map(m => ({ role: m.role, text: m.text })),
        currentSubject.name
      );
      setAiChatMessages(prev => [...prev, { role: 'model', text: res.text }]);
    } catch {
      setAiChatMessages(prev => [
        ...prev,
        {
          role: 'model',
          text: `Chào em! Thầy cô trợ lý AI đã nhận được câu hỏi. Em hãy đọc kỹ phần lý thuyết bài học "${currentLesson?.title || currentSubject.name}" và làm các câu hỏi trắc nghiệm để nắm chắc kiến thức nhé!`
        }
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleQuickAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLesson) return;

    createAssignment({
      title: `Bài tập ${currentSubject.name}: ${currentLesson.title}`,
      subject: currentSubject.id,
      description: `Đọc kỹ bài học "${currentLesson.title}", ghi nhớ các thuật ngữ then chốt và hoàn thành các câu hỏi trắc nghiệm luyện tập.`,
      deadline: assignDeadline,
      assignedMode: assignTarget,
      targetStudentIds: assignTarget === 'individual' ? selectedStudentsForAssign : [],
      targetGroupName: assignTarget === 'group' ? 'Nhóm bồi dưỡng môn học' : undefined,
      criteria: assignCriteria,
      status: 'active',
      totalAssigned: assignTarget === 'all' ? students.length : selectedStudentsForAssign.length
    });

    setAssignSuccess(true);
    triggerCelebration();
    setTimeout(() => setAssignSuccess(false), 3000);
  };

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'FlaskConical': return FlaskConical;
      case 'Compass': return Compass;
      case 'Trees': return Trees;
      case 'HeartHandshake': return HeartHandshake;
      case 'Cpu': return Cpu;
      case 'Palette': return Palette;
      case 'Music': return Music;
      case 'Activity': return Activity;
      case 'Globe': return Globe;
      default: return BookOpen;
    }
  };

  const IconComponent = getSubjectIcon(currentSubject.icon);

  return (
    <div className="space-y-6 pb-12">
      {/* Subject Header Ribbon */}
      <div className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-r ${currentSubject.color} text-white shadow-md border border-white/10 relative overflow-hidden`}>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner shrink-0">
              <IconComponent className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                  Môn học {currentSubject.code}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-xs font-medium">
                  {currentSubject.englishName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-xs font-black">
                  Đang chọn: Khối {selectedGrade}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {currentSubject.name} World
              </h1>
              <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-2xl leading-relaxed">
                {currentSubject.description}
              </p>
            </div>
          </div>

          {/* Action buttons & Grade Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            {/* Grade Selector */}
            <div className="bg-black/20 backdrop-blur-md p-1 rounded-2xl border border-white/20 flex items-center gap-1">
              <span className="text-[11px] font-bold px-2 text-white/80">Khối lớp:</span>
              {[1, 2, 3, 4, 5].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`w-7 h-7 rounded-xl text-xs font-black transition-all ${
                    selectedGrade === g
                      ? 'bg-white text-slate-900 shadow-sm scale-105'
                      : 'text-white hover:bg-white/15'
                  }`}
                  title={`Lọc bài học Khối ${g}`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Teacher Lesson Actions */}
            {currentUser.role === 'teacher' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingLesson(null);
                    setLessonEditorOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white text-slate-900 hover:bg-white/90 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm bài học mới</span>
                </button>
                {currentLesson && (
                  <button
                    onClick={() => {
                      setEditingLesson(currentLesson);
                      setLessonEditorOpen(true);
                    }}
                    className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors border border-white/20"
                    title="Chỉnh sửa bài học này"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Playlist & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Lesson Playlist (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900">Danh mục bài học</h3>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                {lessonsToDisplay.length} Bài (Khối {selectedGrade})
              </span>
            </div>

            {lessonsToDisplay.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>Chưa có bài học nào cho Khối {selectedGrade}.</p>
                {currentUser.role === 'teacher' && (
                  <button
                    onClick={() => {
                      setEditingLesson(null);
                      setLessonEditorOpen(true);
                    }}
                    className="mt-3 px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
                  >
                    + Biên soạn bài học Khối {selectedGrade}
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {lessonsToDisplay.map((lesson, idx) => {
                  const isActive = lesson.id === (currentLesson?.id || activeLessonId);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setActiveLessonId(lesson.id);
                        handleResetDrills();
                      }}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                        isActive
                          ? 'border-purple-400 bg-purple-50/80 shadow-2xs'
                          : 'border-slate-100 hover:border-slate-200 bg-slate-50/60 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                          isActive
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-600">
                          <span>{lesson.chapter || `Bài ${idx + 1}`}</span>
                          <span>• Khối {lesson.grade}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {lesson.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {lesson.drills?.length || 0} câu hỏi trắc nghiệm
                        </p>
                      </div>
                      <ChevronRight className={`w-4 h-4 self-center shrink-0 ${isActive ? 'text-purple-600' : 'text-slate-300'}`} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Lesson Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {currentLesson ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
              {/* Workspace Navigation Tabs */}
              <div className="px-6 pt-4 pb-2 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between gap-2 overflow-x-auto">
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => setActiveTab('theory')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'theory'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Lý thuyết bài học</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('drills')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'drills'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Luyện tập trắc nghiệm ({currentLesson.drills?.length || 0})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('aitutor')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'aitutor'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Hỏi trợ giảng AI</span>
                  </button>

                  {currentUser.role === 'teacher' && (
                    <button
                      onClick={() => setActiveTab('assign')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        activeTab === 'assign'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Giao bài tập</span>
                    </button>
                  )}
                </div>

                {/* Text-to-speech speaker button */}
                <button
                  onClick={() => handleSpeak(currentLesson.audioText || currentLesson.summary)}
                  className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
                    speakingWord
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                      : 'bg-white hover:bg-purple-50 text-purple-700 border border-purple-200'
                  }`}
                  title="Nghe cô giáo AI đọc bài giảng"
                >
                  <Volume2 className="w-4 h-4 text-purple-600" />
                  <span className="hidden sm:inline">Nghe giảng AI</span>
                </button>
              </div>

              {/* TAB 1: LÝ THUYẾT BÀI HỌC */}
              {activeTab === 'theory' && (
                <div className="p-6 space-y-6">
                  {/* Title & Subtitle */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                        {currentLesson.chapter}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                        Khối {currentLesson.grade}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {currentLesson.title}
                    </h2>
                    {currentLesson.subtitle && (
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {currentLesson.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Summary Box */}
                  {currentLesson.summary && (
                    <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 text-xs sm:text-sm text-purple-950 leading-relaxed">
                      <span className="font-bold text-purple-800 uppercase text-[11px] tracking-wider block mb-1">
                        Tóm tắt kiến thức trọng tâm:
                      </span>
                      {currentLesson.summary}
                    </div>
                  )}

                  {/* Lesson Paragraphs */}
                  <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {currentLesson.contentParagraphs?.map((para, pIdx) => (
                      <div key={pIdx} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                        {para}
                      </div>
                    ))}
                  </div>

                  {/* Key Terms */}
                  {currentLesson.keyTerms && currentLesson.keyTerms.length > 0 && (
                    <div className="space-y-2.5 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Thuật ngữ then chốt cần ghi nhớ:</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {currentLesson.keyTerms.map((term, tIdx) => (
                          <div key={tIdx} className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/70">
                            <span className="font-bold text-xs text-amber-900 block">
                              {term.term}
                            </span>
                            <span className="text-xs text-amber-800/90 mt-0.5 block">
                              {term.explanation}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Practical Application */}
                  {currentLesson.practicalApplication && (
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950">
                      <span className="font-bold text-emerald-800 uppercase text-[11px] block mb-1">
                        Ứng dụng thực tế đời sống:
                      </span>
                      {currentLesson.practicalApplication}
                    </div>
                  )}

                  {/* Bottom Navigation */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setActiveTab('drills')}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2"
                    >
                      <span>Luyện tập trắc nghiệm ngay</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: LUYỆN TẬP TRẮC NGHIỆM */}
              {activeTab === 'drills' && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        Luyện tập tương tác: {currentLesson.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Chọn đáp án đúng, bấm "Gợi ý" nếu gặp khó khăn và bấm "Nộp bài kiểm tra" để chấm điểm
                      </p>
                    </div>

                    {drillSubmitted && (
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>
                          Kết quả: {drillScore}/{currentLesson.drills?.length || 0} ({Math.round((drillScore / (currentLesson.drills?.length || 1)) * 100)}%)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Questions List */}
                  <div className="space-y-4">
                    {currentLesson.drills?.map((drill, qIdx) => {
                      const isCorrect = drillSubmitted && drillAnswers[drill.id] === drill.correctAnswer;
                      const isWrong = drillSubmitted && drillAnswers[drill.id] && drillAnswers[drill.id] !== drill.correctAnswer;

                      return (
                        <div
                          key={drill.id || qIdx}
                          className={`p-4 rounded-2xl border transition-all ${
                            isCorrect
                              ? 'border-emerald-300 bg-emerald-50/40'
                              : isWrong
                              ? 'border-red-300 bg-red-50/40'
                              : 'border-slate-200 bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h4 className="font-bold text-sm text-slate-900">
                              Câu {qIdx + 1}: {drill.question}
                            </h4>
                            {drill.hint && (
                              <button
                                onClick={() => setShowHintId(showHintId === drill.id ? null : drill.id)}
                                className="px-2 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-800 text-[11px] font-bold shrink-0 transition-colors"
                              >
                                {showHintId === drill.id ? 'Ẩn gợi ý' : 'Gợi ý AI'}
                              </button>
                            )}
                          </div>

                          {showHintId === drill.id && drill.hint && (
                            <div className="mb-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                              <strong>Gợi ý:</strong> {drill.hint}
                            </div>
                          )}

                          {/* Options */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {drill.options?.map((opt, optIdx) => {
                              const isSelected = drillAnswers[drill.id] === opt;
                              let btnClass = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';

                              if (drillSubmitted) {
                                if (opt === drill.correctAnswer) {
                                  btnClass = 'border-emerald-500 bg-emerald-100 text-emerald-900 font-bold';
                                } else if (isSelected) {
                                  btnClass = 'border-red-400 bg-red-100 text-red-900 line-through';
                                }
                              } else if (isSelected) {
                                btnClass = 'border-purple-600 bg-purple-100 text-purple-900 font-bold';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleSelectAnswer(drill.id, opt)}
                                  disabled={drillSubmitted}
                                  className={`p-2.5 rounded-xl border text-xs text-left transition-all flex items-center gap-2 ${btnClass}`}
                                >
                                  <span className="w-5 h-5 rounded-full bg-black/5 flex items-center justify-center font-bold text-[10px] shrink-0">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span>{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation after submission */}
                          {drillSubmitted && drill.explanation && (
                            <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-xs text-slate-600">
                              <strong>Giải thích:</strong> {drill.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Submit / Reset Actions */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    {drillSubmitted ? (
                      <button
                        onClick={handleResetDrills}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Làm lại bài</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitDrills}
                        className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Nộp bài & Chấm điểm</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: TRỢ GIẢNG AI THÔNG MINH */}
              {activeTab === 'aitutor' && (
                <div className="p-6 space-y-4">
                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-indigo-950">
                        Góc Trợ giảng AI môn {currentSubject.name}
                      </h4>
                      <p className="text-[11px] text-indigo-800">
                        Đặt bất kỳ câu hỏi nào về bài học "{currentLesson.title}" để được giải đáp bằng ngôn ngữ ấm áp, dễ hiểu
                      </p>
                    </div>
                  </div>

                  {/* Messages container */}
                  <div className="space-y-3 max-h-72 overflow-y-auto p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    {aiChatMessages.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        Hãy đặt câu hỏi đầu tiên! Ví dụ: "Tại sao nước lại bốc hơi?", "Kể cho em một câu chuyện về bài học này"...
                      </div>
                    ) : (
                      aiChatMessages.map((msg, mIdx) => (
                        <div
                          key={mIdx}
                          className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                            msg.role === 'user'
                              ? 'ml-auto bg-purple-600 text-white'
                              : 'mr-auto bg-white border border-slate-200 text-slate-800 shadow-2xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                      ))
                    )}
                    {isAiThinking && (
                      <div className="mr-auto bg-white border border-slate-200 p-3 rounded-2xl text-xs text-slate-500 animate-pulse">
                        Trợ giảng AI đang suy nghĩ câu trả lời...
                      </div>
                    )}
                  </div>

                  {/* Question input */}
                  <form onSubmit={handleAskAiTutor} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Em muốn hỏi gì về bài học này?..."
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-xs"
                    />
                    <button
                      type="submit"
                      disabled={isAiThinking || !aiQuestion.trim()}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Hỏi AI</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: GIAO BÀI TẬP NHANH CHO HỌC SINH */}
              {activeTab === 'assign' && currentUser.role === 'teacher' && (
                <form onSubmit={handleQuickAssign} className="p-6 space-y-4">
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-purple-950">
                        Giao nhiệm vụ học tập: {currentLesson.title}
                      </h4>
                      <p className="text-[11px] text-purple-800">
                        Bài tập sẽ được lưu vào danh sách nhiệm vụ của lớp và theo dõi tiến độ
                      </p>
                    </div>
                    {assignSuccess && (
                      <span className="px-3 py-1 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã giao thành công!</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Đối tượng giao bài:
                      </label>
                      <select
                        value={assignTarget}
                        onChange={(e) => setAssignTarget(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                      >
                        <option value="all">Toàn bộ lớp ({students.length} học sinh)</option>
                        <option value="group">Nhóm bồi dưỡng chuyên đề</option>
                        <option value="individual">Chọn từng học sinh cụ thể</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Hạn nộp bài:
                      </label>
                      <input
                        type="date"
                        value={assignDeadline}
                        onChange={(e) => setAssignDeadline(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  {assignTarget === 'individual' && (
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <label className="text-xs font-bold text-slate-700">
                        Chọn các học sinh nhận nhiệm vụ:
                      </label>
                      <div className="max-h-36 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {students.map((st) => (
                          <label key={st.id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white text-xs cursor-pointer">
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
                              className="rounded-sm text-purple-600"
                            />
                            <span className="truncate">{st.stt}. {st.fullName}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Yêu cầu cần đạt / Tiêu chí đánh giá:
                    </label>
                    <input
                      type="text"
                      value={assignCriteria}
                      onChange={(e) => setAssignCriteria(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Xác nhận giao nhiệm vụ cho học sinh</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-semibold">Chọn hoặc tạo một bài học để bắt đầu học tập.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
