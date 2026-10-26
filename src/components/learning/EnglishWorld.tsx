import React, { useState } from 'react';
import {
  Languages,
  Volume2,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Award,
  ChevronRight,
  RotateCcw,
  VolumeX,
  Edit3,
  AlertCircle
} from 'lucide-react';
import { ENGLISH_LESSONS } from '../../data/initialData';
import { EnglishLesson } from '../../types';
import { speechService } from '../../services/speechService';
import { useApp } from '../../context/AppContext';

export const EnglishWorld: React.FC = () => {
  const { triggerCelebration, currentUser, activeClass } = useApp();
  const [lessons, setLessons] = useState<EnglishLesson[]>(ENGLISH_LESSONS);
  const [activeLessonId, setActiveLessonId] = useState<string>(ENGLISH_LESSONS[0].id);
  const [activeTab, setActiveTab] = useState<'vocab' | 'pattern' | 'dialogue' | 'reading' | 'quiz'>('vocab');

  // Interactive Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Audio playing indicator
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);

  const currentLesson = lessons.find(l => l.id === activeLessonId) || lessons[0];

  const handleSpeak = (text: string, lang: 'en-US' | 'vi-VN' = 'en-US') => {
    setSpeakingWord(text);
    speechService.speak(text, lang, 0.85, () => setSpeakingWord(null));
  };

  const handleSelectQuizAnswer = (qId: string, option: string) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    currentLesson.practiceQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    if (score === currentLesson.practiceQuestions.length) {
      triggerCelebration();
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-700/50 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI ENGLISH WORLD – TIẾNG ANH LỚP 3 SONG NGỮ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Góc Tự Học & Phát Triển Năng Lực Tiếng Anh {activeClass?.name || '3C1'}
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl">
            Tích hợp phát âm chuẩn AI, luyện nói, phản xạ song ngữ Anh – Việt và bài tập tương tác
            giúp học sinh tiểu học tự tin giao tiếp.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs text-indigo-200">
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">6 Chủ đề cốt lõi</span>
            <span>•</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">Web Speech AI Audio</span>
            <span>•</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">Chấm điểm tức thì</span>
          </div>
        </div>
      </div>

      {/* Topics Selection Carousel */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {lessons.map((lesson) => {
          const isActive = lesson.id === activeLessonId;
          return (
            <button
              key={lesson.id}
              onClick={() => {
                setActiveLessonId(lesson.id);
                handleResetQuiz();
              }}
              className={`p-3.5 rounded-2xl text-left transition-all duration-150 border flex flex-col justify-between ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-102 font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider opacity-80 line-clamp-1">
                {lesson.topic}
              </div>
              <div className="text-xs font-bold mt-1 line-clamp-2">
                {lesson.title}
              </div>
              <div className="text-[10px] mt-2 opacity-75 line-clamp-1">
                {lesson.vocabulary.length} từ vựng
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Lesson Content Area */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        {/* Lesson Sub-Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{currentLesson.title}</h3>
            <p className="text-xs text-slate-500">{currentLesson.vietnameseTitle}</p>
          </div>

          <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('vocab')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'vocab' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              1. Từ vựng & Audio
            </button>
            <button
              onClick={() => setActiveTab('pattern')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'pattern' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              2. Mẫu câu
            </button>
            <button
              onClick={() => setActiveTab('dialogue')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dialogue' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              3. Hội thoại
            </button>
            <button
              onClick={() => setActiveTab('reading')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'reading' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              4. Bài đọc ngắn
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'quiz' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              5. Bài tập thực hành
            </button>
          </div>
        </div>

        {/* 1. VOCABULARY TAB */}
        {activeTab === 'vocab' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>Bấm nút loa để nghe giọng phát âm AI chuẩn tiếng Anh bản xứ.</span>
              <span className="font-semibold text-indigo-600">{currentLesson.vocabulary.length} thẻ từ vựng</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentLesson.vocabulary.map((vocab, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="h-32 w-full bg-slate-200 overflow-hidden relative">
                    <img
                      src={vocab.image}
                      alt={vocab.word}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => handleSpeak(vocab.word, 'en-US')}
                      className={`absolute bottom-2 right-2 p-2 rounded-full shadow-md transition-all ${
                        speakingWord === vocab.word
                          ? 'bg-amber-400 text-slate-900 scale-110'
                          : 'bg-white/90 text-indigo-700 hover:bg-white'
                      }`}
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-extrabold text-slate-900">{vocab.word}</span>
                        <span className="text-xs text-indigo-600 font-mono">{vocab.phonetic}</span>
                      </div>
                      <div className="text-xs font-bold text-purple-700">{vocab.meaning}</div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                      <div
                        onClick={() => handleSpeak(vocab.example, 'en-US')}
                        className="cursor-pointer hover:text-indigo-600 flex items-start gap-1 font-medium"
                      >
                        <Volume2 className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                        <span>"{vocab.example}"</span>
                      </div>
                      <div className="text-slate-400 italic">→ {vocab.exampleVi}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. SENTENCE PATTERN TAB */}
        {activeTab === 'pattern' && (
          <div className="space-y-6">
            <div className="p-5 rounded-3xl bg-indigo-50 border border-indigo-200 space-y-2">
              <span className="text-xs uppercase font-extrabold text-indigo-600 tracking-wider">
                Mẫu câu trọng tâm (Key Sentence Pattern)
              </span>
              <div className="text-base sm:text-lg font-extrabold text-indigo-950">
                {currentLesson.sentencePattern.pattern}
              </div>
              <p className="text-xs text-indigo-700 font-medium">
                Ý nghĩa tiếng Việt: {currentLesson.sentencePattern.meaning}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Ví dụ thực hành mẫu câu:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentLesson.sentencePattern.examples.map((ex, i) => (
                  <div
                    key={i}
                    onClick={() => handleSpeak(ex.en, 'en-US')}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-400 cursor-pointer transition-colors space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                        {ex.en}
                      </span>
                      <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <p className="text-xs text-slate-500 italic">{ex.vi}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. DIALOGUE TAB */}
        {activeTab === 'dialogue' && (
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="text-xs text-slate-500 text-center">
              Luyện nghe và nhắc lại theo từng lượt thoại của các bạn nhỏ:
            </div>

            <div className="space-y-3">
              {currentLesson.conversation.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 p-3.5 rounded-2xl border transition-colors ${
                    i % 2 === 0
                      ? 'bg-purple-50/70 border-purple-200 ml-0 mr-8'
                      : 'bg-indigo-50/70 border-indigo-200 ml-8 mr-0'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white shadow-xs font-bold text-xs flex items-center justify-center shrink-0 text-purple-700 border border-purple-200">
                    {msg.speaker[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900">{msg.speaker}</span>
                      <button
                        onClick={() => handleSpeak(msg.text, 'en-US')}
                        className="text-indigo-600 hover:text-indigo-800 p-1"
                        title="Nghe câu này"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{msg.text}</p>
                    <p className="text-[11px] text-slate-500 italic mt-0.5">{msg.meaning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. READING TAB */}
        {activeTab === 'reading' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h4 className="text-base font-bold text-slate-900">{currentLesson.readingText.title}</h4>
                <button
                  onClick={() => handleSpeak(currentLesson.readingText.content, 'en-US')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe toàn bài</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
                {currentLesson.readingText.content}
              </p>

              <div className="pt-3 border-t border-slate-200 text-xs text-slate-500 italic">
                <span className="font-semibold text-slate-700 block mb-0.5">Dịch nghĩa tiếng Việt:</span>
                {currentLesson.readingText.vietnameseTranslation}
              </div>
            </div>
          </div>
        )}

        {/* 5. INTERACTIVE QUIZ TAB */}
        {activeTab === 'quiz' && (
          <div className="space-y-5 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Bài tập củng cố kiến thức</h4>
                <p className="text-xs text-slate-500">
                  Trả lời {currentLesson.practiceQuestions.length} câu hỏi để nhận sao tích lũy!
                </p>
              </div>

              {quizSubmitted && (
                <div className="text-right">
                  <div className="text-xs text-slate-500">Điểm của bạn</div>
                  <div className="text-lg font-extrabold text-purple-700">
                    {quizScore}/{currentLesson.practiceQuestions.length} câu đúng
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {currentLesson.practiceQuestions.map((q, idx) => {
                const selected = quizAnswers[q.id];
                const isCorrect = selected === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-3"
                  >
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">{q.question}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options?.map((opt) => {
                        const isThisSelected = selected === opt;
                        let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300';

                        if (quizSubmitted) {
                          if (opt === q.correctAnswer) {
                            btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                          } else if (isThisSelected && !isCorrect) {
                            btnStyle = 'bg-rose-100 border-rose-500 text-rose-900 line-through';
                          }
                        } else if (isThisSelected) {
                          btnStyle = 'bg-indigo-600 border-indigo-600 text-white font-bold';
                        }

                        return (
                          <button
                            key={opt}
                            disabled={quizSubmitted}
                            onClick={() => handleSelectQuizAnswer(q.id, opt)}
                            className={`p-2.5 rounded-xl border text-xs text-left transition-all ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
                        <span className="font-bold text-purple-700">Giải thích: </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Submit & Reset Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              {quizSubmitted ? (
                <button
                  onClick={handleResetQuiz}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-md"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Làm lại bài</span>
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(quizAnswers).length === 0}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs transition-colors shadow-md flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Nộp bài & Chấm điểm</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pedagogical Disclaimer as requested in prompt */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Tuyên bố sư phạm (Disclaimer): </span>
            Nội dung học tập có thể được giáo viên linh hoạt chỉnh sửa theo chương trình thực tế tại trường Tiểu học Hoài Nhơn.
            Hệ thống không tuyên bố nội dung hoàn toàn trùng khớp 100% chương trình chính thức nếu chưa được nhà trường đối chiếu.
          </div>
        </div>
      </div>
    </div>
  );
};
