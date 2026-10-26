import React, { useState } from 'react';
import {
  X,
  School,
  Plus,
  Check,
  Edit2,
  Trash2,
  Users,
  FileSpreadsheet,
  GraduationCap,
  Calendar,
  Sparkles,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ClassRoom } from '../../types';

export const ClassModal: React.FC = () => {
  const {
    classes,
    activeClassId,
    setActiveClassId,
    addClass,
    updateClass,
    deleteClass,
    isClassModalOpen,
    setClassModalOpen,
    triggerCelebration,
    syncFromGoogleSheet,
    teacherProfile
  } = useApp();

  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit'>('list');
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);

  const defaultTeacherName = teacherProfile?.fullName || teacherProfile?.name || 'Giáo viên';

  // Form states
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<number>(3);
  const [schoolYear, setSchoolYear] = useState('2026–2027');
  const [schoolName, setSchoolName] = useState('Trường Tiểu học Hoài Nhơn');
  const [teacherName, setTeacherName] = useState(defaultTeacherName);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [initialStudentsCount, setInitialStudentsCount] = useState<number>(20);
  const [syncImmediately, setSyncImmediately] = useState<boolean>(true);

  if (!isClassModalOpen) return null;

  const handleOpenAdd = () => {
    setName('');
    setGrade(3);
    setSchoolYear('2026–2027');
    setSchoolName('Trường Tiểu học Hoài Nhơn');
    setTeacherName(defaultTeacherName);
    setGoogleSheetUrl('');
    setInitialStudentsCount(20);
    setActiveTab('add');
  };

  const handleOpenEdit = (c: ClassRoom) => {
    setEditingClass(c);
    setName(c.name);
    setGrade(c.grade);
    setSchoolYear(c.schoolYear);
    setSchoolName(c.schoolName);
    setTeacherName(c.teacherName);
    setGoogleSheetUrl(c.googleSheetUrl || '');
    setActiveTab('edit');
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Tạo danh sách học sinh mẫu ban đầu cho lớp mới nếu không có link Google Sheet
    const generatedStudents = Array.from({ length: initialStudentsCount }).map((_, i) => {
      const stt = i + 1;
      const sampleNames = [
        'Nguyễn Gia Bảo', 'Trần Thảo Linh', 'Lê Tuấn Kiệt', 'Phạm Quỳnh Anh',
        'Hoàng Minh Khang', 'Vũ Khánh Vy', 'Bùi Đức Trọng', 'Đỗ Thanh Trúc',
        'Đặng Nhật Nam', 'Dương Thảo My', 'Phan Văn Hậu', 'Lâm Gia Như',
        'Trịnh Quốc Huy', 'Hồ Diệu Linh', 'Ngô Hoàng Bách', 'Lý Ngọc Mai',
        'Võ Hải Đăng', 'Cao Phương Thảo', 'Mai Tiến Đạt', 'Lương Bảo Châu'
      ];
      const fullName = sampleNames[i % sampleNames.length] + (i >= sampleNames.length ? ` (${stt})` : '');
      const isFemale = fullName.includes('Linh') || fullName.includes('Vy') || fullName.includes('Anh') || fullName.includes('Trúc') || fullName.includes('My') || fullName.includes('Châu') || fullName.includes('Thảo') || fullName.includes('Mai');

      return {
        id: `s-${name.toLowerCase()}-${stt}`,
        stt,
        studentCode: `HS${name.toUpperCase().replace(/\s+/g, '')}${stt < 10 ? '0' + stt : stt}`,
        fullName,
        gender: isFemale ? ('Nữ' as const) : ('Nam' as const),
        birthDate: `201${9 - grade}-0${(stt % 9) + 1}-15`,
        className: name.trim().toUpperCase(),
        accountStatus: 'active' as const,
        attendanceStatus: 'present' as const,
        attendanceHistory: [{ date: '2026-10-16', status: 'present' as const }],
        activeTasksCount: 2,
        learningProgress: 85 + ((stt * 3) % 12),
        skills: {
          english: 82 + ((stt * 5) % 16),
          math: 85 + ((stt * 3) % 14),
          vietnamese: 84 + ((stt * 4) % 15),
          informatics: 86 + ((stt * 2) % 13)
        },
        supportGoal: 'Chăm chỉ phát biểu và rèn luyện kỹ năng toàn diện',
        badges: ['daily-learner'],
        parentName: `Phụ huynh em ${fullName}`,
        parentPhone: `09${Math.floor(10000000 + Math.random() * 89999999)}`,
        seatGroup: ((stt - 1) % 4) + 1,
        seatIndex: Math.floor((stt - 1) / 4) + 1
      };
    });

    addClass({
      name: name.trim().toUpperCase(),
      grade,
      schoolYear,
      schoolName,
      teacherName,
      googleSheetUrl: googleSheetUrl.trim(),
      students: generatedStudents
    });

    // Nếu người dùng nhập link Google Sheet và muốn đồng bộ ngay
    if (googleSheetUrl.trim() && syncImmediately) {
      setTimeout(() => {
        syncFromGoogleSheet(googleSheetUrl.trim());
      }, 300);
    }

    triggerCelebration();
    setActiveTab('list');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass || !name.trim()) return;

    updateClass(editingClass.id, {
      name: name.trim().toUpperCase(),
      grade,
      schoolYear,
      schoolName,
      teacherName,
      googleSheetUrl: googleSheetUrl.trim()
    });

    triggerCelebration();
    setActiveTab('list');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header Ribbon */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">Quản lý Lớp học & Đổi lớp giảng dạy</h3>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
                  {classes.length} Lớp
                </span>
              </div>
              <p className="text-xs text-purple-100">
                Chuyển đổi giữa nhiều lớp, đổi tên lớp, thay đổi khối lớp và danh sách học sinh
              </p>
            </div>
          </div>
          <button
            onClick={() => setClassModalOpen(false)}
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
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              Danh sách lớp ({classes.length})
            </button>
            <button
              onClick={handleOpenAdd}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'add'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm lớp mới</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: DANH SÁCH LỚP HỌC */}
          {activeTab === 'list' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Nhấp chọn để chuyển sang lớp học tương ứng:</span>
                <span className="font-semibold text-purple-700">Đang chọn: Lớp {classes.find(c => c.id === activeClassId)?.name}</span>
              </div>

              {classes.map((c) => {
                const isActive = c.id === activeClassId;
                return (
                  <div
                    key={c.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isActive
                        ? 'border-purple-400 bg-purple-50/70 shadow-xs ring-2 ring-purple-400/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                          isActive
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {c.name}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-sm">
                            Lớp {c.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold">
                            Khối {c.grade}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
                            {c.schoolYear}
                          </span>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Đang giảng dạy</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-3 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <strong>{c.students?.length || 0}</strong> học sinh
                          </span>
                          <span>• GVCN: {c.teacherName}</span>
                          <span>• {c.schoolName}</span>
                        </p>
                        {c.googleSheetUrl && (
                          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                            <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                            <span className="truncate max-w-[260px] sm:max-w-xs">Đã liên kết Google Sheet</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-2 rounded-xl text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors border border-transparent hover:border-purple-200"
                        title="Chỉnh sửa thông tin lớp"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {classes.length > 1 && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc muốn xóa Lớp ${c.name}? Dữ liệu lớp sẽ bị gỡ bỏ.`)) {
                              deleteClass(c.id);
                            }
                          }}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200"
                          title="Xóa lớp học"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      {!isActive && (
                        <button
                          onClick={() => {
                            setActiveClassId(c.id);
                            triggerCelebration();
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                        >
                          <span>Chọn lớp này</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2 & 3: FORM THÊM / SỬA LỚP HỌC */}
          {(activeTab === 'add' || activeTab === 'edit') && (
            <form onSubmit={activeTab === 'add' ? handleSaveAdd : handleSaveEdit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 flex items-center gap-2.5 text-xs text-purple-900">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span>
                  {activeTab === 'add'
                    ? 'Tạo lớp học mới: Cho phép quản lý danh sách học sinh riêng biệt cho từng lớp và khối học.'
                    : `Chỉnh sửa thông tin Lớp ${editingClass?.name}`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tên lớp */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên lớp học <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: 3A1, 4B2, 5C1..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-sm font-bold uppercase"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Ví dụ: 3A1, 3A2, 4A1, 5A2...</p>
                </div>

                {/* Khối lớp */}
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
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                        }`}
                      >
                        Khối {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Năm học */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Năm học
                  </label>
                  <input
                    type="text"
                    value={schoolYear}
                    onChange={(e) => setSchoolYear(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>

                {/* Tên giáo viên */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Giáo viên Chủ nhiệm
                  </label>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
              </div>

              {/* Tên trường học */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trường học
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>

              {/* Link Google Sheet cho lớp này */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Liên kết Google Sheet danh sách lớp (Tùy chọn)</span>
                  </span>
                  <span className="text-[11px] font-normal text-slate-500">Cho phép đồng bộ trực tuyến</span>
                </label>
                <input
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                  value={googleSheetUrl}
                  onChange={(e) => setGoogleSheetUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Dán link Google Sheet để tải danh sách học sinh riêng cho lớp này bất cứ lúc nào.
                </p>
              </div>

              {activeTab === 'add' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số lượng học sinh mẫu ban đầu (khi chưa nhập từ Sheet)
                  </label>
                  <select
                    value={initialStudentsCount}
                    onChange={(e) => setInitialStudentsCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-sm bg-white"
                  >
                    <option value={10}>10 học sinh mẫu</option>
                    <option value={20}>20 học sinh mẫu</option>
                    <option value={30}>30 học sinh mẫu</option>
                    <option value={0}>Để trống (Tự thêm học sinh sau)</option>
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{activeTab === 'add' ? 'Tạo lớp học' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
