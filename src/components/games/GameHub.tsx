import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Sparkles,
  Trophy,
  RotateCcw,
  Volume2,
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Shuffle,
  Users,
  Award,
  ChevronRight,
  Filter,
  Check,
  Play,
  Flame,
  Star,
  Trash2
} from 'lucide-react';
import { EducationalGame } from '../../types';
import { speechService } from '../../services/speechService';
import { geminiService } from '../../services/geminiService';
import { useApp } from '../../context/AppContext';

export const GameHub: React.FC = () => {
  const { triggerCelebration, currentUser, students, games, setGames, addGame, deleteGame, activeClass } = useApp();

  const [activeGame, setActiveGame] = useState<EducationalGame | null>(() => games[0] || null);
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  // Game Play Session State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameTimer, setGameTimer] = useState(15);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Magic Wheel Spin state
  const [wheelPoints, setWheelPoints] = useState(100);
  const [isSpinning, setIsSpinning] = useState(false);

  // Word Match State
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  // Sentence Builder State
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);

  // Bingo 3x3 State
  const [bingoGrid, setBingoGrid] = useState<boolean[]>(Array(9).fill(false));

  // Memory Flip State
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [solvedCards, setSolvedCards] = useState<number[]>([]);

  // Smart Game Generator from File State
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [uploadedQuestionFileName, setUploadedQuestionFileName] = useState<string | null>(null);
  const [uploadedAnswerFileName, setUploadedAnswerFileName] = useState<string | null>(null);
  const [generatorText, setGeneratorText] = useState('');
  const [answerKeyInput, setAnswerKeyInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<any | null>(null);

  // Filtered games
  const filteredGames = games.filter(g => (subjectFilter === 'all' ? true : g.subject === subjectFilter));

  const currentQ = activeGame?.sampleQuestions[currentQuestionIndex] || activeGame?.sampleQuestions[0];

  // Timer effect for Magic Quiz
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && gameTimer > 0 && !feedback && !isGameOver) {
      interval = setInterval(() => {
        setGameTimer(prev => prev - 1);
      }, 1000);
    } else if (gameTimer === 0 && !feedback && !isGameOver) {
      handleAnswer(''); // Timeout
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameTimer, feedback, isGameOver]);

  const startNewGameSession = (game: EducationalGame) => {
    setActiveGame(game);
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setIsGameOver(false);
    setGameTimer(15);
    setIsTimerRunning(game.type === 'magic-quiz');
    setSelectedLeft(null);
    setMatchedPairs([]);
    setSelectedTokens([]);
    setBingoGrid(Array(9).fill(false));
    setFlippedCards([]);
    setSolvedCards([]);
  };

  const handleAnswer = (answerChosen: string) => {
    if (!currentQ || feedback) return;

    const isCorrect = answerChosen.trim().toLowerCase() === currentQ.answer.trim().toLowerCase();

    if (isCorrect) {
      const addedPoints = activeGame?.type === 'magic-quiz' ? wheelPoints : 100;
      setScore(prev => prev + addedPoints);
      setStreak(prev => prev + 1);
      setFeedback({ isCorrect: true, message: `🎉 Chính xác! +${addedPoints} điểm` });
      triggerCelebration();
    } else {
      setStreak(0);
      setFeedback({
        isCorrect: false,
        message: `Chưa chính xác! Đáp án đúng là: ${currentQ.answer}. ${currentQ.hint ? `(Gợi ý: ${currentQ.hint})` : ''}`
      });
    }

    setIsTimerRunning(false);

    // Auto advance after 2.5 seconds
    setTimeout(() => {
      setFeedback(null);
      if (activeGame && currentQuestionIndex + 1 < activeGame.sampleQuestions.length) {
        setCurrentQuestionIndex(prev => prev + 1);
        setGameTimer(15);
        setIsTimerRunning(activeGame.type === 'magic-quiz');
      } else {
        setIsGameOver(true);
      }
    }, 2400);
  };

  // Word Match pair selection handler
  const handleWordMatchClick = (side: 'left' | 'right', text: string) => {
    if (side === 'left') {
      setSelectedLeft(text);
    } else if (side === 'right' && selectedLeft) {
      // Check if match
      const pairs = currentQ?.pairs || [];
      const match = pairs.find(p => p.left === selectedLeft && p.right === text);
      if (match) {
        setMatchedPairs(prev => [...prev, selectedLeft]);
        setSelectedLeft(null);
        setScore(prev => prev + 100);
        triggerCelebration();
        if (matchedPairs.length + 1 >= pairs.length) {
          setIsGameOver(true);
        }
      } else {
        setSelectedLeft(null);
      }
    }
  };

  // Sentence Builder token click
  const handleTokenClick = (tok: string) => {
    const updated = [...selectedTokens, tok];
    setSelectedTokens(updated);
    if (updated.join(' ') === currentQ?.answer) {
      setScore(prev => prev + 150);
      setFeedback({ isCorrect: true, message: '🎉 Tuyệt vời! Bạn đã ghép thành câu hoàn chỉnh!' });
      triggerCelebration();
      setTimeout(() => {
        setFeedback(null);
        setIsGameOver(true);
      }, 2000);
    }
  };

  // Bingo Cell Click
  const handleBingoCell = (idx: number) => {
    if (bingoGrid[idx]) return;
    const nextGrid = [...bingoGrid];
    nextGrid[idx] = true;
    setBingoGrid(nextGrid);
    setScore(prev => prev + 100);
    triggerCelebration();
  };

  // Wheel Spin trigger
  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const pointOptions = [100, 200, 300, 400, 500];
    const picked = pointOptions[Math.floor(Math.random() * pointOptions.length)];
    setTimeout(() => {
      setWheelPoints(picked);
      setIsSpinning(false);
      triggerCelebration();
    }, 1200);
  };

  // AI File Parser Trigger
  const handleRunGenerator = async () => {
    setIsGenerating(true);
    const content = generatorText || 'File bài giảng và danh sách câu hỏi trắc nghiệm Toán - Tiếng Anh';
    const res = await geminiService.parseGameFromContent(content, answerKeyInput);
    setIsGenerating(false);
    setGeneratedPreview(res);
  };

  const handlePublishGeneratedGame = () => {
    if (!generatedPreview) return;
    const newG: EducationalGame = {
      id: `game-custom-${Date.now()}`,
      name: 'Bài tập AI tự động',
      vietnameseName: 'Trò chơi mới tải lên từ File',
      type: (generatedPreview.suggestedGameType as any) || 'magic-quiz',
      subject: 'general',
      grade: 3,
      description: 'Trò chơi được bóc tách tự động từ file giáo án/câu hỏi của giáo viên.',
      rulesVi: 'Đọc kỹ câu hỏi và chọn đáp án chính xác!',
      questionsCount: generatedPreview.questions?.length || 3,
      sampleQuestions: generatedPreview.questions || []
    };
    addGame(newG);
    setIsGeneratorModalOpen(false);
    setGeneratedPreview(null);
    startNewGameSession(newG);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-purple-800/50 space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
          <Gamepad2 className="w-4 h-4 text-amber-400" />
          <span>HỆ THỐNG 10 TRÒ CHƠI HỌC TẬP SƯ PHẠM & CÔNG CỤ TẠO GAME TỰ ĐỘNG TỪ FILE</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Kho Game Tương Tác Sư Phạm Lớp {activeClass?.name || '3C1'}
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-2xl leading-relaxed">
              10 cơ chế trò chơi tích hợp sẵn bám sát kiến thức: Ghép từ, Vòng quay kiến thức, Nghe chọn,
              Xây dựng câu, Thám tử hình ảnh, Bingo, Lật thẻ, Săn kho báu, Sáng tạo truyện và Đấu trường đồng đội.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsGeneratorModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-2 transition-all hover:scale-102"
            >
              <Upload className="w-4 h-4" />
              <span>Tạo Game từ File (PPTX, DOCX, PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 10 Games Selection Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Chọn trò chơi học tập ({filteredGames.length} trò chơi):
          </span>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700"
            >
              <option value="all">Tất cả môn học</option>
              <option value="english">Tiếng Anh</option>
              <option value="math">Toán học</option>
              <option value="vietnamese">Tiếng Việt</option>
              <option value="informatics">Tin học</option>
              <option value="general">Liên môn</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {filteredGames.map((game, idx) => {
            const isPlaying = activeGame?.id === game.id;
            return (
              <button
                key={game.id}
                onClick={() => startNewGameSession(game)}
                className={`p-3 rounded-2xl text-left border transition-all duration-150 flex flex-col justify-between ${
                  isPlaying
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md font-bold scale-102'
                    : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-purple-50 hover:border-purple-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] opacity-75">
                    <span>Game #{idx + 1}</span>
                    <span className="capitalize">{game.subject}</span>
                  </div>
                  <div className="text-xs font-extrabold mt-1 line-clamp-1">
                    {game.vietnameseName}
                  </div>
                  <div className="text-[10px] opacity-75 italic line-clamp-1">
                    ({game.name})
                  </div>
                </div>

                <div className="mt-2 pt-1 border-t border-current/10 flex items-center justify-between text-[10px]">
                  <span>{game.sampleQuestions?.length || 4} câu</span>
                  <div className="flex items-center gap-1.5">
                    {game.id.startsWith('game-custom') && currentUser.role === 'teacher' && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Bạn có chắc muốn xóa trò chơi "${game.vietnameseName}"?`)) {
                            deleteGame(game.id);
                            if (activeGame?.id === game.id) {
                              setActiveGame(games.find(g => g.id !== game.id) || null);
                            }
                          }
                        }}
                        className="p-1 rounded-md hover:bg-red-500 hover:text-white transition-colors"
                        title="Xóa trò chơi này"
                      >
                        <Trash2 className="w-3 h-3" />
                      </span>
                    )}
                    <Play className="w-3 h-3 fill-current" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE GAME PLAY ARENA */}
      {activeGame && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
          {/* Game Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-extrabold text-[11px] uppercase tracking-wider">
                  {activeGame.name}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">{activeGame.rulesVi}</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                {activeGame.vietnameseName}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {/* Score */}
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-extrabold shadow-2xs">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>{score} điểm</span>
              </div>

              {/* Streak */}
              {streak > 1 && (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-extrabold">
                  <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
                  <span>x{streak} chuỗi đúng!</span>
                </div>
              )}

              {/* Reset Session */}
              <button
                onClick={() => startNewGameSession(activeGame)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Chơi lại từ đầu"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div
              className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-150 ${
                feedback.isCorrect
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}
            >
              {feedback.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* GAMEPLAY OVER SCREEN */}
          {isGameOver ? (
            <div className="text-center py-10 space-y-4 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center mx-auto shadow-xl p-2 animate-bounce">
                <Trophy className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-extrabold text-slate-900">
                Chúc mừng bạn đã hoàn thành trò chơi!
              </h4>
              <p className="text-sm text-slate-600">
                Tổng điểm đạt được: <span className="font-extrabold text-purple-700 text-lg">{score} điểm</span>
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => startNewGameSession(activeGame)}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi lại trò chơi</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 1. MAGIC QUIZ ARENA (VÒNG QUAY + TÍNH GIỜ) */}
              {activeGame.type === 'magic-quiz' && (
                <div className="space-y-6 max-w-xl mx-auto">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50 border border-purple-200">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSpinWheel}
                        disabled={isSpinning}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 font-extrabold text-xs text-slate-950 shadow-xs flex items-center gap-1.5"
                      >
                        <RotateCcw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
                        <span>Quay điểm may mắn</span>
                      </button>
                      <span className="text-xs font-bold text-purple-900">
                        Giá trị câu này: <span className="text-base text-purple-700">{wheelPoints} điểm</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                      <span>{gameTimer}s</span>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                      Câu hỏi {currentQuestionIndex + 1}/{activeGame.sampleQuestions.length}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900">
                      {currentQ?.prompt}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {currentQ?.options?.map((opt) => (
                        <button
                          key={opt}
                          disabled={Boolean(feedback)}
                          onClick={() => handleAnswer(opt)}
                          className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-purple-500 hover:bg-purple-50/50 font-bold text-xs text-slate-800 transition-all text-left shadow-2xs hover:scale-102"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. WORD MATCH ARENA */}
              {activeGame.type === 'word-match' && (
                <div className="space-y-4 max-w-xl mx-auto">
                  <div className="text-xs text-slate-500 text-center">
                    Nhấp 1 từ ở cột Tiếng Anh, sau đó nhấp nghĩa tương ứng ở cột Tiếng Việt:
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                        Từ vựng tiếng Anh
                      </span>
                      {currentQ?.pairs?.map((p) => {
                        const isMatched = matchedPairs.includes(p.left);
                        const isSelected = selectedLeft === p.left;

                        return (
                          <button
                            key={p.left}
                            disabled={isMatched}
                            onClick={() => handleWordMatchClick('left', p.left)}
                            className={`w-full p-3 rounded-2xl border font-bold text-xs transition-all text-center ${
                              isMatched
                                ? 'bg-emerald-100 border-emerald-400 text-emerald-800 line-through opacity-60'
                                : isSelected
                                ? 'bg-purple-600 text-white border-purple-600 ring-2 ring-purple-300'
                                : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-purple-400'
                            }`}
                          >
                            {p.left}
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                        Nghĩa Tiếng Việt
                      </span>
                      {currentQ?.pairs?.map((p) => {
                        const isMatched = matchedPairs.includes(p.left);

                        return (
                          <button
                            key={p.right}
                            disabled={isMatched}
                            onClick={() => handleWordMatchClick('right', p.right)}
                            className={`w-full p-3 rounded-2xl border font-bold text-xs transition-all text-center ${
                              isMatched
                                ? 'bg-emerald-100 border-emerald-400 text-emerald-800 line-through opacity-60'
                                : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-purple-400'
                            }`}
                          >
                            {p.right}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. LISTEN AND CHOOSE */}
              {activeGame.type === 'listen-choose' && (
                <div className="space-y-5 max-w-lg mx-auto text-center">
                  <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-200 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                      Bấm nút loa để nghe giọng đọc:
                    </span>
                    <div>
                      <button
                        onClick={() => {
                          const isEn = activeGame?.subject === 'english';
                          speechService.speak(currentQ?.audioPrompt || (isEn ? 'Father' : currentQ?.prompt || ''), isEn ? 'en-US' : 'vi-VN');
                        }}
                        className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center mx-auto shadow-lg hover:scale-105 transition-all"
                      >
                        <Volume2 className="w-8 h-8" />
                      </button>
                    </div>
                    <p className="text-xs text-indigo-900 font-semibold">{currentQ?.prompt}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {currentQ?.options?.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(opt)}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-500 font-bold text-xs text-slate-800 shadow-2xs hover:scale-102"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. SENTENCE BUILDER */}
              {activeGame.type === 'sentence-builder' && (
                <div className="space-y-4 max-w-lg mx-auto">
                  <div className="text-xs text-slate-500 text-center font-medium">
                    {currentQ?.prompt}
                  </div>

                  {/* Built sentence area */}
                  <div className="p-4 rounded-2xl bg-purple-50 border-2 border-dashed border-purple-300 min-h-16 flex flex-wrap items-center justify-center gap-2">
                    {selectedTokens.length === 0 ? (
                      <span className="text-xs text-purple-400 italic">Nhấp các từ bên dưới để ghép câu...</span>
                    ) : (
                      selectedTokens.map((tok, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-xs">
                          {tok}
                        </span>
                      ))
                    )}
                  </div>

                  {/* Token options to click */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    {currentQ?.tokens?.map((tok) => {
                      const isUsed = selectedTokens.includes(tok);
                      return (
                        <button
                          key={tok}
                          disabled={isUsed}
                          onClick={() => handleTokenClick(tok)}
                          className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                            isUsed
                              ? 'opacity-30 border-slate-200 bg-slate-100'
                              : 'bg-white border-slate-300 hover:border-purple-500 text-slate-800 shadow-xs'
                          }`}
                        >
                          {tok}
                        </button>
                      );
                    })}
                  </div>

                  {selectedTokens.length > 0 && (
                    <div className="flex justify-center pt-2">
                      <button
                        onClick={() => setSelectedTokens([])}
                        className="text-xs text-slate-500 hover:text-slate-800 underline"
                      >
                        Xóa làm lại câu này
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 5. EDUCATIONAL BINGO 3x3 */}
              {activeGame.type === 'educational-bingo' && (
                <div className="space-y-4 max-w-md mx-auto text-center">
                  <div className="text-xs text-slate-500">
                    Nhấp vào các ô trả lời đúng để thắp sáng ngôi sao, tạo thành hàng ngang/dọc để BINGO!
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-4 rounded-3xl bg-slate-50 border border-slate-200">
                    {bingoGrid.map((isStarred, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleBingoCell(idx)}
                        className={`h-24 rounded-2xl border font-bold text-xs flex flex-col items-center justify-center transition-all ${
                          isStarred
                            ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-md scale-102 font-extrabold'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-purple-400 hover:bg-purple-50'
                        }`}
                      >
                        {isStarred ? (
                          <>
                            <Star className="w-6 h-6 fill-slate-950 mb-1" />
                            <span>STAR</span>
                          </>
                        ) : (
                          <>
                            <span className="text-slate-400 text-[10px]">Ô #{idx + 1}</span>
                            <span className="text-xs text-slate-800 mt-1">Câu đố vui</span>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. DEFAULT GENERAL QUESTIONS FOR REMAINING GAMES */}
              {activeGame.type !== 'magic-quiz' &&
                activeGame.type !== 'word-match' &&
                activeGame.type !== 'listen-choose' &&
                activeGame.type !== 'sentence-builder' &&
                activeGame.type !== 'educational-bingo' && (
                  <div className="space-y-4 max-w-xl mx-auto text-center">
                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                      <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                        Câu hỏi {currentQuestionIndex + 1}/{activeGame.sampleQuestions.length}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900">
                        {currentQ?.prompt}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {currentQ?.options?.map((opt) => (
                          <button
                            key={opt}
                            disabled={Boolean(feedback)}
                            onClick={() => handleAnswer(opt)}
                            className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-purple-500 hover:bg-purple-50/50 font-bold text-xs text-slate-800 transition-all text-left shadow-2xs hover:scale-102"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
            </>
          )}

          {/* Leaderboard miniature */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Bảng thi đua tuần: 1. Bảo An (950đ) • 2. Minh Khang (880đ) • 3. Hoàng Yến (850đ)</span>
            </div>
            <div className="font-semibold text-purple-700">
              Lớp {activeClass?.name || '3C1'} – Hoài Nhơn
            </div>
          </div>
        </div>
      )}

      {/* SMART GAME GENERATOR MODAL (FROM PPTX / DOCX / PDF) */}
      {isGeneratorModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Cơ chế tạo trò chơi thông minh từ File (Smart Game Generator Engine)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Hỗ trợ tệp .pptx, .docx, .pdf câu hỏi và tệp đáp án đính kèm
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsGeneratorModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* File 1: Questions */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 text-center space-y-2">
                <FileText className="w-8 h-8 text-purple-600 mx-auto" />
                <div className="text-xs font-bold text-purple-900">
                  1. Tệp nội dung / Câu hỏi
                </div>
                <p className="text-[10px] text-slate-500">
                  Hỗ trợ định dạng .pptx, .docx, .pdf
                </p>
                <input
                  type="file"
                  accept=".pptx,.docx,.pdf,.txt"
                  className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setUploadedQuestionFileName(e.target.files[0].name);
                      setGeneratorText(`Tệp: ${e.target.files[0].name}\nNội dung: Trắc nghiệm Toán và Tiếng Anh tiểu học lớp 3`);
                    }
                  }}
                />
                {uploadedQuestionFileName && (
                  <div className="text-[11px] font-semibold text-emerald-700 truncate">
                    ✓ Đã nhận: {uploadedQuestionFileName}
                  </div>
                )}
              </div>

              {/* File 2: Answer Key */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/50 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-amber-600 mx-auto" />
                <div className="text-xs font-bold text-amber-900">
                  2. Tệp đáp án đính kèm (Tùy chọn)
                </div>
                <p className="text-[10px] text-slate-500">
                  Bảng đáp án 1-A, 2-C hoặc file .docx/.pdf riêng
                </p>
                <input
                  type="file"
                  accept=".docx,.pdf,.xlsx,.txt"
                  className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-amber-600 file:text-white"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setUploadedAnswerFileName(e.target.files[0].name);
                      setAnswerKeyInput(`1-A, 2-B, 3-C (Từ file: ${e.target.files[0].name})`);
                    }
                  }}
                />
                {uploadedAnswerFileName && (
                  <div className="text-[11px] font-semibold text-emerald-700 truncate">
                    ✓ Đã nhận: {uploadedAnswerFileName}
                  </div>
                )}
              </div>
            </div>

            {/* Direct text input alternative */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hoặc dán nội dung câu hỏi/bài tập vào đây:
              </label>
              <textarea
                rows={3}
                value={generatorText}
                onChange={(e) => setGeneratorText(e.target.value)}
                placeholder="Ví dụ: 1. Kết quả của phép tính 36:4 là? A. 8 B. 9 C. 7 D. 6..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleRunGenerator}
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'AI đang bóc tách...' : 'AI Quét & Ánh xạ tự động'}</span>
              </button>
            </div>

            {/* Preview Generated Result */}
            {generatedPreview && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Bản xem trước ({generatedPreview.questions?.length} câu hỏi) – Template gợi ý: {generatedPreview.suggestedGameType}
                  </span>
                  <button
                    onClick={handlePublishGeneratedGame}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                  >
                    Xuất bản vào Game Hub
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {generatedPreview.questions?.map((q: any, i: number) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                      <div className="font-bold text-slate-800">{i + 1}. {q.prompt}</div>
                      <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                        Đáp án đúng: {q.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
