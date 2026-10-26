import React, { useState } from 'react';
import {
  Laptop,
  Volume2,
  Sparkles,
  ShieldAlert,
  MousePointer,
  FolderTree,
  FileText,
  FolderPlus,
  Trash2,
  CheckCircle,
  RotateCcw,
  AlertCircle,
  Bot,
  Keyboard,
  ShieldCheck
} from 'lucide-react';
import { INFORMATICS_LESSONS } from '../../data/initialData';
import { InformaticsLesson } from '../../types';
import { speechService } from '../../services/speechService';
import { useApp } from '../../context/AppContext';

export const InformaticsWorld: React.FC = () => {
  const { triggerCelebration, activeClass, teacherProfile } = useApp();
  const [lessons] = useState<InformaticsLesson[]>(INFORMATICS_LESSONS);
  const [activeLessonId, setActiveLessonId] = useState<string>(INFORMATICS_LESSONS[0].id);

  // Interactive Virtual Keyboard Simulator State
  const [typedText, setTypedText] = useState<string>('');
  const [activePressedKey, setActivePressedKey] = useState<string | null>(null);

  // Interactive Virtual Mouse Simulator State
  const [mouseActionFeedback, setMouseActionFeedback] = useState<string>('Rê chuột vào đây hoặc thử nhấp chuột!');

  // Interactive Folder Tree Simulator State
  const [folders, setFolders] = useState([
    { id: 'f-root', name: `LOP_${(activeClass?.name || '3C1').replace(/[^a-zA-Z0-9]/g, '_')}`, parent: null, isFolder: true },
    { id: 'f-toan', name: 'Toan_Hoc', parent: 'f-root', isFolder: true },
    { id: 'f-van', name: 'Tieng_Viet', parent: 'f-root', isFolder: true },
    { id: 'f-anh', name: 'Tieng_Anh', parent: 'f-root', isFolder: true },
    { id: 'f-tin', name: 'Tin_Hoc_3', parent: 'f-root', isFolder: true },
    { id: 'f-file1', name: 'Bai_tap_ve_nha.docx', parent: 'f-toan', isFolder: false }
  ]);
  const [newFolderName, setNewFolderName] = useState('');

  // Drill state
  const [drillAnswers, setDrillAnswers] = useState<Record<string, string>>({});
  const [drillSubmitted, setDrillSubmitted] = useState<boolean>(false);
  const [drillScore, setDrillScore] = useState<number>(0);

  const currentLesson = lessons.find(l => l.id === activeLessonId) || lessons[0];

  const handleSpeak = (text: string) => {
    speechService.speak(text, 'vi-VN', 0.9);
  };

  const handleKeyPress = (key: string) => {
    setActivePressedKey(key);
    if (key === 'SPACE') {
      setTypedText(prev => prev + ' ');
    } else if (key === 'BACKSPACE') {
      setTypedText(prev => prev.slice(0, -1));
    } else {
      setTypedText(prev => prev + key);
    }
    setTimeout(() => setActivePressedKey(null), 250);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const newId = `f-${Date.now()}`;
    setFolders(prev => [
      ...prev,
      { id: newId, name: newFolderName.trim(), parent: 'f-root', isFolder: true }
    ]);
    setNewFolderName('');
    triggerCelebration();
  };

  const handleDeleteItem = (id: string) => {
    if (id === 'f-root') return;
    setFolders(prev => prev.filter(f => f.id !== id && f.parent !== id));
  };

  const handleSubmitDrill = () => {
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

  // Keyboard Rows
  const rowHome = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const rowTop = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const rowBottom = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-cyan-950 via-teal-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-cyan-800/50 space-y-2 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-cyan-300 text-xs font-bold border border-white/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI INFORMATICS WORLD – TIN HỌC LỚP 3 (SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Làm Quen Máy Tính, Tư Duy Thuật Toán & An Toàn Số
        </h2>
        <p className="text-xs sm:text-sm text-cyan-100 max-w-2xl">
          Mô phỏng bàn phím ảo 3D nhận diện phím gờ F/J, chuột ảo tương tác, cây thư mục và quy tắc an toàn
          theo 6 Chủ đề chuẩn sách giáo khoa.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-cyan-200">
          <span className="bg-white/10 px-2.5 py-1 rounded-lg">6 Chủ đề & 16 Bài học</span>
          <span>•</span>
          <span className="bg-white/10 px-2.5 py-1 rounded-lg">Bàn phím & Chuột ảo</span>
          <span>•</span>
          <span className="bg-white/10 px-2.5 py-1 rounded-lg">Mô phỏng cây thư mục</span>
        </div>
      </div>

      {/* Chapters Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {lessons.map((lesson) => {
          const isActive = lesson.id === activeLessonId;
          return (
            <button
              key={lesson.id}
              onClick={() => {
                setActiveLessonId(lesson.id);
                setDrillAnswers({});
                setDrillSubmitted(false);
              }}
              className={`p-3.5 rounded-2xl text-left transition-all duration-150 border flex flex-col justify-between ${
                isActive
                  ? 'bg-cyan-600 text-white border-cyan-600 shadow-md scale-102 font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/50'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider opacity-80 line-clamp-1">
                {lesson.chapterTitle}
              </div>
              <div className="text-xs font-bold mt-1 line-clamp-2">
                {lesson.title}
              </div>
              <div className="text-[10px] mt-2 opacity-75 line-clamp-1">
                Công cụ: {lesson.virtualToolType}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content & Interactive Simulator */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{currentLesson.title}</h3>
            <p className="text-xs text-slate-500">{currentLesson.chapterTitle}</p>
          </div>

          <button
            onClick={() => handleSpeak(currentLesson.safetyBox)}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs self-start sm:self-auto"
          >
            <Volume2 className="w-4 h-4" />
            <span>Nghe mẹo an toàn số</span>
          </button>
        </div>

        {/* 1. Mẹo an toàn số & Ghi nhớ (Safety Box) */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Hộp ghi nhớ an toàn số của cô {teacherProfile?.fullName || teacherProfile?.name || 'Giáo viên'}: </span>
            {currentLesson.safetyBox}
          </div>
        </div>

        {/* 2. INTERACTIVE SIMULATORS (Bàn phím ảo / Chuột ảo / Cây thư mục) */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span>Phòng thực hành số tương tác trực quan (Interactive Sandbox)</span>
          </h4>

          {/* SIMULATOR 1: VIRTUAL KEYBOARD WITH HOME ROW F & J */}
          {currentLesson.virtualToolType === 'keyboard' && (
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold text-cyan-400 flex items-center gap-2">
                  <Keyboard className="w-4 h-4" />
                  <span>Bàn phím ảo nhận diện 10 ngón tay & Phím chuẩn F / J có gờ nổi</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Nhấp các phím để thực hành gõ tên hoặc từ vựng
                </span>
              </div>

              {/* Display typed text */}
              <div className="p-3 bg-slate-800/90 rounded-2xl border border-slate-700 min-h-12 flex items-center justify-between">
                <span className="font-mono text-sm text-cyan-300">
                  {typedText || 'Nhấp phím bên dưới để gõ chữ...'}
                </span>
                {typedText && (
                  <button
                    onClick={() => setTypedText('')}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Xóa
                  </button>
                )}
              </div>

              {/* Keyboard Keys Layout */}
              <div className="space-y-2 select-none">
                {/* Top row */}
                <div className="flex justify-center gap-1.5">
                  {rowTop.map((k) => (
                    <button
                      key={k}
                      onClick={() => handleKeyPress(k)}
                      className={`w-9 sm:w-11 h-10 rounded-xl font-bold text-xs transition-all ${
                        activePressedKey === k
                          ? 'bg-cyan-500 text-slate-950 scale-95 shadow-inner'
                          : 'bg-slate-800 text-white hover:bg-slate-700 shadow-sm'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>

                {/* Home row (with special indicators for F and J) */}
                <div className="flex justify-center gap-1.5">
                  {rowHome.map((k) => {
                    const isF = k === 'F';
                    const isJ = k === 'J';
                    return (
                      <button
                        key={k}
                        onClick={() => handleKeyPress(k)}
                        className={`w-9 sm:w-11 h-10 rounded-xl font-bold text-xs relative transition-all ${
                          isF || isJ
                            ? 'bg-cyan-600/40 text-cyan-200 border-2 border-cyan-400'
                            : 'bg-slate-800 text-white hover:bg-slate-700 shadow-sm'
                        } ${activePressedKey === k ? 'bg-cyan-400 text-slate-950 scale-95' : ''}`}
                      >
                        {k}
                        {(isF || isJ) && (
                          <span
                            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-amber-400 rounded-full"
                            title="Gờ nổi chuẩn định vị ngón trỏ"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom row */}
                <div className="flex justify-center gap-1.5">
                  {rowBottom.map((k) => (
                    <button
                      key={k}
                      onClick={() => handleKeyPress(k)}
                      className={`w-9 sm:w-11 h-10 rounded-xl font-bold text-xs transition-all ${
                        activePressedKey === k
                          ? 'bg-cyan-500 text-slate-950 scale-95'
                          : 'bg-slate-800 text-white hover:bg-slate-700'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                  <button
                    onClick={() => handleKeyPress('BACKSPACE')}
                    className="px-3 h-10 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500"
                  >
                    Xóa
                  </button>
                </div>

                {/* Space bar */}
                <div className="flex justify-center pt-1">
                  <button
                    onClick={() => handleKeyPress('SPACE')}
                    className="w-64 h-9 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 border border-slate-700"
                  >
                    Space Bar (Phím cách – Ngón cái)
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/80 text-center text-xs text-cyan-200">
                ⭐ <span className="font-bold">Lưu ý sư phạm:</span> Phím F và J có gờ nổi màu vàng để hai ngón trỏ định vị mà không cần nhìn bàn phím.
              </div>
            </div>
          )}

          {/* SIMULATOR 2: VIRTUAL MOUSE */}
          {currentLesson.virtualToolType === 'mouse' && (
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="text-xs text-slate-600 text-center">
                Mô phỏng chuột máy tính: Nhấp chuột trái, nhấp đúp, nhấp chuột phải hoặc lăn con lăn.
              </div>

              <div className="flex flex-col items-center justify-center p-6 space-y-4">
                {/* Visual Mouse illustration */}
                <div className="w-40 h-60 rounded-[48px] bg-slate-200 border-4 border-slate-400 p-2 shadow-xl flex flex-col justify-between relative">
                  {/* Top buttons */}
                  <div className="grid grid-cols-2 gap-1 h-24">
                    <button
                      onClick={() => setMouseActionFeedback('✓ Bạn vừa thực hiện thao tác: NHÁY CHUỘT TRÁI (Left Click)')}
                      onDoubleClick={() => setMouseActionFeedback('🎉 Bạn vừa thực hiện thao tác: NHÁY ĐÚP CHUỘT (Double Click)! Mở thư mục thành công!')}
                      className="rounded-tl-[36px] bg-cyan-100 hover:bg-cyan-200 text-cyan-900 font-bold text-[11px] p-2 flex flex-col items-center justify-center border border-cyan-300"
                    >
                      <span>Nút trái</span>
                      <span className="text-[9px] text-cyan-600 font-normal">Ngón trỏ</span>
                    </button>

                    <button
                      onClick={() => setMouseActionFeedback('✓ Bạn vừa thực hiện thao tác: NHÁY CHUỘT PHẢI (Right Click) - Mở menu ngữ cảnh!')}
                      className="rounded-tr-[36px] bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold text-[11px] p-2 flex flex-col items-center justify-center border border-indigo-300"
                    >
                      <span>Nút phải</span>
                      <span className="text-[9px] text-indigo-600 font-normal">Ngón giữa</span>
                    </button>
                  </div>

                  {/* Scroll wheel */}
                  <div className="w-6 h-10 mx-auto -mt-6 rounded-full bg-slate-700 border-2 border-white flex items-center justify-center">
                    <span className="w-1 h-3 bg-amber-400 rounded-full animate-pulse" />
                  </div>

                  {/* Mouse palm body */}
                  <div className="h-28 rounded-b-[36px] bg-slate-300 flex items-center justify-center text-slate-500 font-semibold text-xs">
                    Thân chuột
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-slate-300 text-center text-xs font-bold text-slate-800 max-w-md w-full shadow-xs">
                  {mouseActionFeedback}
                </div>
              </div>
            </div>
          )}

          {/* SIMULATOR 3: FILE TREE FOLDER SIMULATOR */}
          {currentLesson.virtualToolType === 'file-tree' && (
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <FolderTree className="w-4 h-4 text-cyan-600" />
                    <span>Cây thư mục tương tác (Folder Tree Simulator)</span>
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Thực hành tạo thư mục mới, xem cấu trúc cây thư mục cha – con
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Tên thư mục mới..."
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-800"
                  />
                  <button
                    onClick={handleCreateFolder}
                    className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>Tạo mới</span>
                  </button>
                </div>
              </div>

              {/* Tree view rendering */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                {folders.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-2 rounded-xl transition-colors ${
                      item.parent === null
                        ? 'bg-cyan-50 font-bold text-cyan-900 border border-cyan-200'
                        : 'ml-6 bg-slate-50 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs">
                      {item.isFolder ? (
                        <span className="text-amber-500 font-bold">📁</span>
                      ) : (
                        <FileText className="w-4 h-4 text-blue-500" />
                      )}
                      <span>{item.name}</span>
                      {item.parent === null && (
                        <span className="text-[10px] text-cyan-700">(Thư mục gốc)</span>
                      )}
                    </div>

                    {item.parent !== null && (
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Xóa tệp/thư mục này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Bài tập trắc nghiệm kiến thức số */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-600" />
              <span>Kiểm tra kiến thức & Quy tắc an toàn số</span>
            </h4>
            {drillSubmitted && (
              <span className="text-xs font-bold text-cyan-700">
                Đạt: {drillScore}/{currentLesson.drills.length} câu đúng
              </span>
            )}
          </div>

          <div className="space-y-3">
            {currentLesson.drills.map((drill, idx) => {
              const selected = drillAnswers[drill.id];
              const isCorrect = selected === drill.correctAnswer;

              return (
                <div key={drill.id} className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">{drill.question}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {drill.options.map((opt) => {
                      const isThisSelected = selected === opt;
                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-cyan-300';

                      if (drillSubmitted) {
                        if (opt === drill.correctAnswer) {
                          btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                        } else if (isThisSelected && !isCorrect) {
                          btnStyle = 'bg-rose-100 border-rose-500 text-rose-900 line-through';
                        }
                      } else if (isThisSelected) {
                        btnStyle = 'bg-cyan-600 border-cyan-600 text-white font-bold';
                      }

                      return (
                        <button
                          key={opt}
                          disabled={drillSubmitted}
                          onClick={() => {
                            if (!drillSubmitted) {
                              setDrillAnswers(prev => ({ ...prev, [drill.id]: opt }));
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-xs text-left transition-all ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {drillSubmitted && (
                    <div className="text-xs text-slate-600 pt-2 border-t border-slate-200">
                      <span className="font-bold text-cyan-700">Giải thích: </span>
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
                onClick={() => {
                  setDrillAnswers({});
                  setDrillSubmitted(false);
                  setDrillScore(0);
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm lại bài</span>
              </button>
            ) : (
              <button
                onClick={handleSubmitDrill}
                disabled={Object.keys(drillAnswers).length === 0}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white font-bold text-xs transition-colors shadow-md flex items-center gap-2"
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
            Giáo viên có toàn quyền thêm bớt câu hỏi, đổi tên thư mục mẫu, chỉnh sửa hình ảnh giao diện theo phần mềm thực tế
            được cài đặt tại phòng máy tính của trường Tiểu học Hoài Nhơn (Windows 10/11, MS PowerPoint, v.v.).
          </div>
        </div>
      </div>
    </div>
  );
};
