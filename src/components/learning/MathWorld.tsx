import React, { useState } from 'react';
import {
  Calculator,
  Volume2,
  Sparkles,
  BookOpen,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  AlertCircle,
  Bot,
  Lightbulb,
  Maximize2,
  Check
} from 'lucide-react';
import { MATH_LESSONS } from '../../data/initialData';
import { MathLesson } from '../../types';
import { speechService } from '../../services/speechService';
import { useApp } from '../../context/AppContext';

export const MathWorld: React.FC = () => {
  const { triggerCelebration } = useApp();
  const [lessons] = useState<MathLesson[]>(MATH_LESSONS);
  const [activeLessonId, setActiveLessonId] = useState<string>(MATH_LESSONS[0].id);

  // Drill state
  const [drillAnswers, setDrillAnswers] = useState<Record<string, string>>({});
  const [drillSubmitted, setDrillSubmitted] = useState<boolean>(false);
  const [drillScore, setDrillScore] = useState<number>(0);

  // AI Tutor Hint popup
  const [showAiHint, setShowAiHint] = useState<string | null>(null);

  const currentLesson = lessons.find(l => l.id === activeLessonId) || lessons[0];

  const handleSpeak = (text: string) => {
    speechService.speak(text, 'vi-VN', 0.9);
  };

  const handleSelectAnswer = (qId: string, opt: string) => {
    if (drillSubmitted) return;
    setDrillAnswers(prev => ({ ...prev, [qId]: opt }));
  };

  const handleSubmitDrills = () => {
    let score = 0;
    currentLesson.practiceDrills.forEach(d => {
      if (drillAnswers[d.id] === d.correctAnswer) score++;
    });
    setDrillScore(score);
    setDrillSubmitted(true);
    if (score === currentLesson.practiceDrills.length) {
      triggerCelebration();
    }
  };

  const handleResetDrills = () => {
    setDrillAnswers({});
    setDrillSubmitted(false);
    setDrillScore(0);
    setShowAiHint(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-700/50 space-y-2 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-bold border border-white/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI MATH WORLD – TOÁN LỚP 3 TRỰC QUAN</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Phát Triển Tư Duy Toán Học & Trực Quan Hóa Tri Thức
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl">
          Đầy đủ 8 thành phần trực quan: Bàn tính, tia số, mô hình phân số/hình học, giọng đọc AI tiếng Việt,
          phân tích đề toán "Cho biết gì? Hỏi gì?" và giải toán bằng hai bước tính.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-emerald-200">
          <span className="bg-white/10 px-2.5 py-1 rounded-lg">6 Chuyên đề trọng tâm</span>
          <span>•</span>
          <span className="bg-white/10 px-2.5 py-1 rounded-lg">Mô hình trực quan số</span>
          <span>•</span>
          <span className="bg-white/10 px-2.5 py-1 rounded-lg">Gia sư AI gợi ý logic</span>
        </div>
      </div>

      {/* 6 Core Modules Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {lessons.map((lesson) => {
          const isActive = lesson.id === activeLessonId;
          return (
            <button
              key={lesson.id}
              onClick={() => {
                setActiveLessonId(lesson.id);
                handleResetDrills();
              }}
              className={`p-3.5 rounded-2xl text-left transition-all duration-150 border flex flex-col justify-between ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-102 font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider opacity-80 line-clamp-1">
                {lesson.category}
              </div>
              <div className="text-xs font-bold mt-1 line-clamp-2">
                {lesson.title}
              </div>
              <div className="text-[10px] mt-2 opacity-75 line-clamp-1">
                {lesson.practiceDrills.length} bài tập
              </div>
            </button>
          );
        })}
      </div>

      {/* Lesson Details (8 Standard Architectural Components) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{currentLesson.title}</h3>
            <p className="text-xs text-slate-500">{currentLesson.vietnameseTitle}</p>
          </div>

          <button
            onClick={() => handleSpeak(currentLesson.audioGuideText)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs self-start sm:self-auto"
          >
            <Volume2 className="w-4 h-4" />
            <span>Nghe hướng dẫn giọng AI chuẩn</span>
          </button>
        </div>

        {/* 1. Thuật ngữ & Khái niệm (Key Terms) */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>1. Thuật ngữ & Khái niệm toán học cốt lõi</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentLesson.keyTerms.map((term, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-xs text-emerald-800 block mb-1">{term.term}</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">{term.definition}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Mô hình trực quan (Visual Model) */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Maximize2 className="w-4 h-4 text-emerald-600" />
            <span>2. Mô hình trực quan (Visual Model)</span>
          </h4>
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
            <div className="text-xs font-bold text-emerald-900 mb-2">
              {currentLesson.visualModel.description}
            </div>

            {currentLesson.visualModel.type === 'place-value' && (
              <div className="grid grid-cols-5 gap-2 max-w-lg mx-auto text-center font-bold">
                {Object.entries(currentLesson.visualModel.sampleValue).map(([k, v]) => (
                  <div key={k} className="p-2.5 rounded-xl bg-white border border-emerald-200 shadow-2xs">
                    <span className="text-[10px] text-slate-400 block">{k}</span>
                    <span className="text-xl text-emerald-700">{v as string}</span>
                  </div>
                ))}
              </div>
            )}

            {currentLesson.visualModel.type === 'geometry-shape' && (
              <div className="flex flex-col items-center justify-center p-4">
                <div className="w-48 h-28 border-4 border-dashed border-emerald-500 bg-white/80 rounded-xl flex items-center justify-center font-bold text-emerald-800 text-sm shadow-xs">
                  Hình chữ nhật: 6cm x 4cm
                </div>
                <div className="mt-2 text-xs text-emerald-700 font-semibold">
                  Chu vi: (6 + 4) x 2 = 20 cm | Diện tích: 6 x 4 = 24 cm²
                </div>
              </div>
            )}

            {currentLesson.visualModel.type === 'bar-model' && (
              <div className="p-3 bg-white rounded-xl border border-emerald-200 text-center font-mono text-xs text-emerald-800">
                {currentLesson.visualModel.sampleValue}
              </div>
            )}

            {currentLesson.visualModel.type === 'abacus' && (
              <div className="p-3 bg-white rounded-xl border border-emerald-200 text-center font-mono text-sm font-bold text-emerald-800">
                {currentLesson.visualModel.sampleValue}
              </div>
            )}
          </div>
        </div>

        {/* 3 & 4. Quy tắc từng bước & Hộp công thức (Formula Box) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <span>3. Hướng dẫn từng bước giải</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-amber-950">
              {currentLesson.stepGuide.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-3xl bg-indigo-50/70 border border-indigo-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-800">
              4. Hộp ghi nhớ & Công thức chuẩn
            </h4>
            <div className="p-2.5 rounded-xl bg-white border border-indigo-200 font-bold text-xs text-indigo-950">
              {currentLesson.formulaBox.rule}
            </div>
            <div className="space-y-1 text-xs text-indigo-900">
              <span className="font-semibold block">Ví dụ mẫu:</span>
              <p className="font-medium text-slate-800">{currentLesson.formulaBox.workedExamples[0].problem}</p>
              <p className="text-emerald-700 font-bold">{currentLesson.formulaBox.workedExamples[0].solution}</p>
            </div>
          </div>
        </div>

        {/* 5 & 6. Tình huống đời sống & Đọc hiểu đề toán ("Cho biết gì? Hỏi gì?") */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              5. Tình huống toán học đời sống
            </h4>
            <span className="text-xs font-bold text-slate-900 block">{currentLesson.realLifeStory.title}</span>
            <p className="text-xs text-slate-600">{currentLesson.realLifeStory.scenario}</p>
            <div className="p-2 rounded-xl bg-white border border-slate-200 text-xs">
              <span className="font-bold text-purple-700">Câu hỏi: </span>{currentLesson.realLifeStory.question}
              <div className="text-emerald-700 font-bold mt-1">Đáp án: {currentLesson.realLifeStory.answer}</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              6. Đọc hiểu đề toán (Phân tích 2 bước)
            </h4>
            <p className="text-xs font-serif text-slate-800 italic">"{currentLesson.readingProblem.statement}"</p>
            <div className="space-y-1 text-xs">
              <div className="text-blue-700">
                <span className="font-bold">Bài toán cho biết gì: </span>{currentLesson.readingProblem.givenData}
              </div>
              <div className="text-rose-700">
                <span className="font-bold">Bài toán hỏi gì: </span>{currentLesson.readingProblem.questionData}
              </div>
              <div className="text-emerald-700 font-medium">
                <span className="font-bold">Hướng dẫn giải: </span>{currentLesson.readingProblem.solutionGuide}
              </div>
            </div>
          </div>
        </div>

        {/* 7. Hệ thống bài tập thực hành tương tác (Interactive Drills) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>7. Bài tập thực hành tương tác (Chấm điểm & Gợi ý AI)</span>
            </h4>
            {drillSubmitted && (
              <span className="text-xs font-bold text-emerald-700">
                Đạt: {drillScore}/{currentLesson.practiceDrills.length} câu đúng
              </span>
            )}
          </div>

          <div className="space-y-3">
            {currentLesson.practiceDrills.map((drill, idx) => {
              const selected = drillAnswers[drill.id];
              const isCorrect = selected === drill.correctAnswer;

              return (
                <div key={drill.id} className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">{drill.question}</p>
                    </div>

                    <button
                      onClick={() => setShowAiHint(drill.id)}
                      className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold flex items-center gap-1 hover:bg-purple-100 shrink-0"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Gợi ý AI</span>
                    </button>
                  </div>

                  {/* AI Hint Box if toggled */}
                  {showAiHint === drill.id && (
                    <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-start gap-2 animate-in fade-in">
                      <Bot className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Gia sư AI gợi ý logic:</span>
                        {drill.hint}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {drill.options?.map((opt) => {
                      const isThisSelected = selected === opt;
                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300';

                      if (drillSubmitted) {
                        if (opt === drill.correctAnswer) {
                          btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                        } else if (isThisSelected && !isCorrect) {
                          btnStyle = 'bg-rose-100 border-rose-500 text-rose-900 line-through';
                        }
                      } else if (isThisSelected) {
                        btnStyle = 'bg-emerald-600 border-emerald-600 text-white font-bold';
                      }

                      return (
                        <button
                          key={opt}
                          disabled={drillSubmitted}
                          onClick={() => handleSelectAnswer(drill.id, opt)}
                          className={`p-2.5 rounded-xl border text-xs text-left transition-all ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {drillSubmitted && (
                    <div className="text-xs text-slate-600 pt-2 border-t border-slate-200">
                      <span className="font-bold text-emerald-700">Lời giải chi tiết: </span>
                      {drill.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {drillSubmitted ? (
              <button
                onClick={handleResetDrills}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm lại bài toán</span>
              </button>
            ) : (
              <button
                onClick={handleSubmitDrills}
                disabled={Object.keys(drillAnswers).length === 0}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs transition-colors shadow-md flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Nộp bài & Chấm điểm</span>
              </button>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Cơ chế quản trị & Tuyên bố trách nhiệm (CMS & Disclaimer): </span>
            Cho phép giáo viên linh hoạt biên tập số liệu, đề bài bám sát từng bộ sách giáo khoa (Cánh Diều, Kết Nối Tri Thức, Chân Trời Sáng Tạo).
            Hệ thống không tự động tuyên bố nội dung hoàn toàn trùng khớp 100% nếu chưa đối chiếu theo kế hoạch bài dạy thực tế.
          </div>
        </div>
      </div>
    </div>
  );
};
