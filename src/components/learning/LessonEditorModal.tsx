import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Check,
  Plus,
  Trash2,
  Sparkles,
  HelpCircle,
  FileText,
  Volume2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GenericLesson } from '../../types';

export const LessonEditorModal: React.FC = () => {
  const {
    isLessonEditorOpen,
    setLessonEditorOpen,
    editingLesson,
    setEditingLesson,
    addGenericLesson,
    updateGenericLesson,
    subjects,
    activeSubjectId,
    selectedGrade,
    triggerCelebration
  } = useApp();

  const [subjectId, setSubjectId] = useState(activeSubjectId || 'science');
  const [grade, setGrade] = useState<number>(selectedGrade || 3);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [chapter, setChapter] = useState('Chủ đề 1');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [practicalApplication, setPracticalApplication] = useState('');
  const [audioText, setAudioText] = useState('');

  // Key terms
  const [keyTerms, setKeyTerms] = useState<{ term: string; explanation: string }[]>([
    { term: '', explanation: '' }
  ]);

  // Drills
  const [drills, setDrills] = useState<
    { id: string; question: string; options: string[]; correctAnswer: string; hint: string; explanation: string }[]
  >([
    {
      id: `q-${Date.now()}-1`,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      hint: '',
      explanation: ''
    }
  ]);

  useEffect(() => {
    if (editingLesson) {
      setSubjectId(editingLesson.subjectId);
      setGrade(editingLesson.grade);
      setTitle(editingLesson.title);
      setSubtitle(editingLesson.subtitle || '');
      setChapter(editingLesson.chapter || 'Chủ đề 1');
      setSummary(editingLesson.summary || '');
      setContent(editingLesson.contentParagraphs ? editingLesson.contentParagraphs.join('\n\n') : '');
      setPracticalApplication(editingLesson.practicalApplication || '');
      setAudioText(editingLesson.audioText || '');
      setKeyTerms(editingLesson.keyTerms?.length ? editingLesson.keyTerms : [{ term: '', explanation: '' }]);
      setDrills(editingLesson.drills?.length ? editingLesson.drills : [
        { id: `q-${Date.now()}-1`, question: '', options: ['', '', '', ''], correctAnswer: '', hint: '', explanation: '' }
      ]);
    } else {
      setSubjectId(activeSubjectId || 'science');
      setGrade(selectedGrade || 3);
      setTitle('');
      setSubtitle('');
      setChapter('Chủ đề 1');
      setSummary('');
      setContent('');
      setPracticalApplication('');
      setAudioText('');
      setKeyTerms([{ term: '', explanation: '' }]);
      setDrills([
        { id: `q-${Date.now()}-1`, question: '', options: ['', '', '', ''], correctAnswer: '', hint: '', explanation: '' }
      ]);
    }
  }, [editingLesson, isLessonEditorOpen, activeSubjectId, selectedGrade]);

  if (!isLessonEditorOpen) return null;

  const handleAddTerm = () => {
    setKeyTerms(prev => [...prev, { term: '', explanation: '' }]);
  };

  const handleRemoveTerm = (index: number) => {
    setKeyTerms(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddDrill = () => {
    setDrills(prev => [
      ...prev,
      {
        id: `q-${Date.now()}-${prev.length + 1}`,
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        hint: '',
        explanation: ''
      }
    ]);
  };

  const handleRemoveDrill = (index: number) => {
    setDrills(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const contentParagraphs = content
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const validKeyTerms = keyTerms.filter(t => t.term.trim().length > 0);

    const validDrills = drills
      .filter(d => d.question.trim().length > 0)
      .map(d => ({
        ...d,
        correctAnswer: d.correctAnswer || d.options[0] || 'Đáp án đúng'
      }));

    const lessonData: GenericLesson = {
      id: editingLesson ? editingLesson.id : `lesson-${subjectId}-${grade}-${Date.now()}`,
      subjectId,
      grade,
      chapter: chapter.trim() || 'Chủ đề',
      title: title.trim(),
      subtitle: subtitle.trim(),
      summary: summary.trim(),
      contentParagraphs: contentParagraphs.length > 0 ? contentParagraphs : [summary.trim()],
      keyTerms: validKeyTerms,
      practicalApplication: practicalApplication.trim(),
      audioText: audioText.trim() || summary.trim(),
      drills: validDrills
    };

    if (editingLesson) {
      updateGenericLesson(editingLesson.id, lessonData);
    } else {
      addGenericLesson(lessonData);
    }

    triggerCelebration();
    setLessonEditorOpen(false);
    setEditingLesson(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                {editingLesson ? 'Chỉnh sửa bài học' : 'Biên soạn bài học mới'}
              </h3>
              <p className="text-xs text-emerald-100">
                Tùy chỉnh nội dung bài giảng, thuật ngữ, câu hỏi trắc nghiệm tương tác cho khối lớp đang dạy
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setLessonEditorOpen(false);
              setEditingLesson(null);
            }}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Môn học & Khối lớp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Môn học <span className="text-red-500">*</span>
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm font-semibold bg-white"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Khối lớp giảng dạy <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      grade === g
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    Khối {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tiêu đề & Chương / Chủ đề */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Chương / Chủ đề
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Chủ đề 1: Chất..."
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên bài học <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Nước và sự chuyển thể của nước trong tự nhiên..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Phụ đề / Mục tiêu bài học
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Khám phá ba thể của nước và vòng tuần hoàn nước..."
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          {/* Tóm tắt & Nội dung bài giảng */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tóm tắt bài học ngắn gọn (Hiển thị đầu bài học)
            </label>
            <textarea
              rows={2}
              placeholder="Tóm tắt 2-3 câu trọng tâm của bài học..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nội dung bài giảng chi tiết (Phân tách mỗi đoạn bằng một dòng trống)
            </label>
            <textarea
              rows={4}
              placeholder="Nhập nội dung các phần bài học: 1. Khái niệm...&#10;&#10;2. Đặc điểm...&#10;&#10;3. Ý nghĩa..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs text-slate-800 leading-relaxed font-sans"
            />
          </div>

          {/* Thuật ngữ then chốt */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Thuật ngữ / Từ khóa then chốt của bài học</span>
              </label>
              <button
                type="button"
                onClick={handleAddTerm}
                className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Thêm thuật ngữ</span>
              </button>
            </div>

            {keyTerms.map((term, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Thuật ngữ (Ví dụ: Bay hơi)"
                  value={term.term}
                  onChange={(e) => {
                    const updated = [...keyTerms];
                    updated[idx].term = e.target.value;
                    setKeyTerms(updated);
                  }}
                  className="w-1/3 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                />
                <input
                  type="text"
                  placeholder="Giải thích ngắn gọn, dễ hiểu..."
                  value={term.explanation}
                  onChange={(e) => {
                    const updated = [...keyTerms];
                    updated[idx].explanation = e.target.value;
                    setKeyTerms(updated);
                  }}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
                {keyTerms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTerm(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Ứng dụng & Giọng đọc AI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ứng dụng thực tế đời sống
              </label>
              <textarea
                rows={2}
                placeholder="Liên hệ thực tế đời sống xung quanh học sinh..."
                value={practicalApplication}
                onChange={(e) => setPracticalApplication(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Văn bản đọc bằng giọng AI (Text-to-Speech)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Văn bản cô giáo AI đọc dẫn dắt cho học sinh khi bấm nút nghe..."
                value={audioText}
                onChange={(e) => setAudioText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs"
              />
            </div>
          </div>

          {/* Bộ câu hỏi trắc nghiệm tương tác */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  <span>Bộ câu hỏi luyện tập trắc nghiệm ({drills.length} câu)</span>
                </h4>
                <p className="text-[11px] text-emerald-800">
                  Học sinh sẽ làm bài trực tiếp, nhận chấm điểm tức thì và gợi ý học tập
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddDrill}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm câu hỏi</span>
              </button>
            </div>

            {drills.map((drill, qIdx) => (
              <div key={drill.id || qIdx} className="p-3.5 rounded-2xl bg-white border border-emerald-200/80 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-emerald-800">
                    Câu hỏi {qIdx + 1}
                  </span>
                  {drills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDrill(qIdx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                      title="Xóa câu hỏi này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Nội dung câu hỏi..."
                  value={drill.question}
                  onChange={(e) => {
                    const updated = [...drills];
                    updated[qIdx].question = e.target.value;
                    setDrills(updated);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[0, 1, 2, 3].map((optIdx) => (
                    <div key={optIdx} className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <input
                        type="text"
                        placeholder={`Lựa chọn ${String.fromCharCode(65 + optIdx)}`}
                        value={drill.options[optIdx] || ''}
                        onChange={(e) => {
                          const updated = [...drills];
                          updated[qIdx].options[optIdx] = e.target.value;
                          setDrills(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-900 mb-0.5">
                      Đáp án chính xác:
                    </label>
                    <input
                      type="text"
                      placeholder="Sao chép đúng chữ của đáp án đúng..."
                      value={drill.correctAnswer}
                      onChange={(e) => {
                        const updated = [...drills];
                        updated[qIdx].correctAnswer = e.target.value;
                        setDrills(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-emerald-400 bg-emerald-50/50 text-xs font-bold text-emerald-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Gợi ý trả lời (Hint):
                    </label>
                    <input
                      type="text"
                      placeholder="Gợi ý giúp học sinh tự tìm ra câu trả lời..."
                      value={drill.hint}
                      onChange={(e) => {
                        const updated = [...drills];
                        updated[qIdx].hint = e.target.value;
                        setDrills(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                    Lời giải thích chi tiết:
                  </label>
                  <input
                    type="text"
                    placeholder="Giải thích vì sao đáp án đó chính xác..."
                    value={drill.explanation}
                    onChange={(e) => {
                      const updated = [...drills];
                      updated[qIdx].explanation = e.target.value;
                      setDrills(updated);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => {
                setLessonEditorOpen(false);
                setEditingLesson(null);
              }}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{editingLesson ? 'Lưu thay đổi bài học' : 'Lưu bài học vào môn'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
