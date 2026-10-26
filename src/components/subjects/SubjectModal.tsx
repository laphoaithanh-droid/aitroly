import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Plus,
  Check,
  Edit2,
  Trash2,
  Sparkles,
  Layers,
  GraduationCap,
  FlaskConical,
  Compass,
  Trees,
  HeartHandshake,
  Cpu,
  Palette,
  Music,
  Activity,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CustomSubject } from '../../types';

export const SubjectModal: React.FC = () => {
  const {
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    isSubjectModalOpen,
    setSubjectModalOpen,
    triggerCelebration,
    setActiveSubjectId,
    setActiveView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');

  // Form states
  const [name, setName] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGrades, setSelectedGrades] = useState<number[]>([1, 2, 3, 4, 5]);
  const [selectedColor, setSelectedColor] = useState('from-cyan-500 to-blue-600');
  const [selectedBadgeColor, setSelectedBadgeColor] = useState('bg-cyan-600 text-white');
  const [selectedIcon, setSelectedIcon] = useState('BookOpen');

  if (!isSubjectModalOpen) return null;

  const COLOR_OPTIONS = [
    { label: 'Xanh dương - Lam', color: 'from-cyan-500 to-blue-600', badge: 'bg-cyan-600 text-white' },
    { label: 'Xanh lá - Ngọc', color: 'from-emerald-500 to-teal-700', badge: 'bg-emerald-600 text-white' },
    { label: 'Cam - Đất nung', color: 'from-amber-500 to-orange-700', badge: 'bg-orange-600 text-white' },
    { label: 'Tím - Thạch anh', color: 'from-purple-500 to-indigo-700', badge: 'bg-purple-600 text-white' },
    { label: 'Hồng - Sen thắm', color: 'from-pink-500 to-rose-600', badge: 'bg-pink-600 text-white' },
    { label: 'Đỏ - Năng lượng', color: 'from-red-500 to-rose-700', badge: 'bg-red-600 text-white' },
    { label: 'Xanh ngọc - Biển', color: 'from-teal-500 to-cyan-700', badge: 'bg-teal-600 text-white' }
  ];

  const ICON_OPTIONS = [
    { id: 'FlaskConical', label: 'Khoa học (Bình thí nghiệm)', icon: FlaskConical },
    { id: 'Compass', label: 'Địa lý (La bàn)', icon: Compass },
    { id: 'Trees', label: 'Tự nhiên (Cây xanh)', icon: Trees },
    { id: 'HeartHandshake', label: 'Đạo đức (Trái tim & Bắt tay)', icon: HeartHandshake },
    { id: 'Cpu', label: 'Công nghệ (Vi mạch)', icon: Cpu },
    { id: 'Palette', label: 'Mỹ thuật (Bảng màu)', icon: Palette },
    { id: 'Music', label: 'Âm nhạc (Nốt nhạc)', icon: Music },
    { id: 'Activity', label: 'Thể chất (Vận động)', icon: Activity },
    { id: 'Globe', label: 'Toàn cầu (Địa cầu)', icon: Globe },
    { id: 'BookOpen', label: 'Sách giáo khoa (Quyển sách)', icon: BookOpen }
  ];

  const handleToggleGrade = (grade: number) => {
    setSelectedGrades(prev =>
      prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade].sort()
    );
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addSubject({
      name: name.trim(),
      englishName: englishName.trim() || `${name} World`,
      code: code.trim().toUpperCase() || name.slice(0, 3).toUpperCase(),
      description: description.trim() || `Chương trình môn học ${name} dành cho học sinh tiểu học.`,
      grades: selectedGrades.length > 0 ? selectedGrades : [1, 2, 3, 4, 5],
      color: selectedColor,
      badgeColor: selectedBadgeColor,
      icon: selectedIcon,
      isCore: false,
      enabled: true
    });

    triggerCelebration();
    setActiveTab('list');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header Ribbon */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">Quản lý Môn học & Thêm môn mới</h3>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
                  {subjects.length} Môn
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Môn học mới được cấu hình đầy đủ tính năng: Bài giảng, giọng đọc AI, bài tập trắc nghiệm và giao bài
              </p>
            </div>
          </div>
          <button
            onClick={() => setSubjectModalOpen(false)}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 pt-3 pb-1 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'list'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              Danh sách môn học ({subjects.length})
            </button>
            <button
              onClick={() => {
                setName('');
                setEnglishName('');
                setCode('');
                setDescription('');
                setSelectedGrades([1, 2, 3, 4, 5]);
                setActiveTab('add');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'add'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm môn học mới</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: DANH SÁCH MÔN HỌC */}
          {activeTab === 'list' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 mb-1 flex items-center justify-between">
                <span>Bật/tắt các môn hiển thị trên thanh điều hướng hoặc mở xem bài học:</span>
                <span className="font-semibold text-blue-600">{subjects.filter(s => s.enabled).length} môn đang bật</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subjects.map((sub) => {
                  const isCore = sub.isCore;
                  return (
                    <div
                      key={sub.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                        sub.enabled
                          ? 'border-slate-200 bg-white hover:border-blue-300 shadow-2xs'
                          : 'border-slate-200 bg-slate-50/70 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-black uppercase ${sub.badgeColor || 'bg-slate-700 text-white'}`}>
                              {sub.code}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm">
                              {sub.name}
                            </h4>
                          </div>

                          {/* Toggle enabled switch */}
                          <button
                            onClick={() => updateSubject(sub.id, { enabled: !sub.enabled })}
                            className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                              sub.enabled ? 'bg-blue-600' : 'bg-slate-300'
                            }`}
                            title={sub.enabled ? 'Đang bật hiển thị' : 'Đang ẩn'}
                          >
                            <span
                              className={`block w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                                sub.enabled ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                          {sub.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-400 font-medium">
                          Khối: {sub.grades.join(', ')}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {!isCore && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Bạn có chắc muốn xóa môn học "${sub.name}"?`)) {
                                  deleteSubject(sub.id);
                                }
                              }}
                              className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                              title="Xóa môn học này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setActiveSubjectId(sub.id);
                              if (sub.id === 'english') setActiveView('english');
                              else if (sub.id === 'math') setActiveView('math');
                              else if (sub.id === 'vietnamese') setActiveView('vietnamese');
                              else if (sub.id === 'informatics') setActiveView('informatics');
                              else setActiveView('subject-world');
                              setSubjectModalOpen(false);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition-colors"
                          >
                            Xem bài học
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: THÊM MÔN HỌC MỚI */}
          {activeTab === 'add' && (
            <form onSubmit={handleSaveAdd} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-2.5 text-xs text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Môn học mới được tích hợp sẵn <strong>bộ câu hỏi trắc nghiệm tương tác, giọng đọc AI, chế độ giao bài cho học sinh</strong> và phân loại theo từng khối lớp!
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tên môn học */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên môn học tiếng Việt <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Khoa học, Lịch sử, Âm nhạc..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                  />
                </div>

                {/* Tên tiếng Anh */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên môn học tiếng Anh (Song ngữ)
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Science World, Music..."
                    value={englishName}
                    onChange={(e) => setEnglishName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Mã môn học */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mã môn viết tắt <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: KH, LS, AN, MT, STEM..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm uppercase font-bold"
                  />
                </div>

                {/* Khối lớp áp dụng */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Áp dụng cho khối lớp:
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[1, 2, 3, 4, 5].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => handleToggleGrade(g)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          selectedGrades.includes(g)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-300'
                        }`}
                      >
                        Khối {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mô tả môn học */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô tả / Mục tiêu giảng dạy
                </label>
                <textarea
                  rows={2}
                  placeholder="Mô tả nội dung chương trình giảng dạy của môn học..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-xs text-slate-700"
                />
              </div>

              {/* Chọn màu sắc đại diện */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Màu sắc chủ đề của môn học:
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {COLOR_OPTIONS.map((c, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedColor(c.color);
                        setSelectedBadgeColor(c.badge);
                      }}
                      className={`h-8 px-3 rounded-xl bg-gradient-to-r ${c.color} text-white text-[11px] font-bold shadow-xs border-2 transition-transform ${
                        selectedColor === c.color ? 'border-slate-900 scale-105 ring-2 ring-blue-400' : 'border-transparent opacity-85 hover:opacity-100'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chọn biểu tượng */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Biểu tượng môn học:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {ICON_OPTIONS.map((item) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedIcon(item.id)}
                        className={`p-2 rounded-xl border flex items-center gap-2 text-xs transition-all ${
                          selectedIcon === item.id
                            ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <IconComp className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate">{item.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Thêm môn học vào hệ thống</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
