import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Download,
  Upload,
  Eye,
  Edit2,
  Trash2,
  Sparkles,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  X,
  AlertTriangle,
  MoveUp,
  MoveDown,
  Database,
  FileSpreadsheet,
  KeyRound,
  Printer,
  Copy,
  CheckCheck,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';

export const StudentManagement: React.FC = () => {
  const {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    changeStudentStt,
    bulkImportStudents,
    badges,
    awardBadge,
    triggerCelebration,
    dbConfig,
    setDbModalOpen,
    activeClass,
    classes,
    setActiveClassId,
    setClassModalOpen,
    autoGenerateStudentAccounts,
    setTargetStudentForPasswordChange,
    setChangePasswordOpen,
    updateStudentAbilityTier,
    teacherProfile
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterAttendance, setFilterAttendance] = useState<string>('all');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'stt' | 'name' | 'progress'>('stt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAccountListModalOpen, setIsAccountListModalOpen] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [autoGenNotice, setAutoGenNotice] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Nam' as 'Nam' | 'Nữ',
    birthDate: '2018-05-15',
    username: '',
    password: '',
    supportGoal: '',
    parentName: '',
    parentPhone: '',
    learningProgress: 85,
    skills: { english: 85, math: 85, vietnamese: 85, informatics: 85 }
  });

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchesSearch =
          s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (s.username && s.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
          s.parentName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAttendance =
          filterAttendance === 'all' ? true : s.attendanceStatus === filterAttendance;
        
        const tier = s.abilityTier || (s.learningProgress >= 88 ? 'advanced' : s.learningProgress >= 70 ? 'proficient' : 'remedial');
        const matchesTier = filterTier === 'all' ? true : tier === filterTier;

        return matchesSearch && matchesAttendance && matchesTier;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'stt') comp = a.stt - b.stt;
        else if (sortBy === 'name') comp = a.fullName.localeCompare(b.fullName, 'vi');
        else if (sortBy === 'progress') comp = a.learningProgress - b.learningProgress;
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [students, searchTerm, filterAttendance, filterTier, sortBy, sortOrder]);

  const handleAutoGenerateAccounts = () => {
    const count = autoGenerateStudentAccounts();
    setAutoGenNotice(`Đã tự động tạo và cấp tài khoản (hs...) + mật khẩu mặc định (123456) thành công cho ${count} học sinh!`);
    triggerCelebration();
    setTimeout(() => setAutoGenNotice(''), 5000);
  };

  const handleCopyAccountList = () => {
    const content = students.map(s => {
      const u = s.username || `hs${s.className.toLowerCase()}${s.stt < 10 ? '0' + s.stt : s.stt}`;
      const p = s.password || '123456';
      const tierLabel = s.abilityTier === 'advanced' ? 'Hoàn thành Tốt' : s.abilityTier === 'remedial' ? 'Cần hỗ trợ' : 'Hoàn thành';
      return `${s.stt}. ${s.fullName} | Mã: ${s.studentCode} | TK: ${u} | MK: ${p} | Năng lực: ${tierLabel}`;
    }).join('\n');

    navigator.clipboard.writeText(`DANH SÁCH TÀI KHOẢN HỌC SINH LỚP ${activeClass.name} - TRƯỜNG TH HOÀI NHƠN\n${content}`);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  const handleOpenAdd = () => {
    const nextStt = students.length + 1;
    setFormData({
      fullName: '',
      gender: 'Nam',
      birthDate: '2018-05-15',
      username: `hs${activeClass.name.toLowerCase()}${nextStt < 10 ? '0' + nextStt : nextStt}`,
      password: '123456',
      supportGoal: 'Rèn luyện khả năng phát biểu tự tin và đọc hiểu tiếng Anh',
      parentName: '',
      parentPhone: '0900 123 456',
      learningProgress: 85,
      skills: { english: 85, math: 85, vietnamese: 85, informatics: 85 }
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (st: Student) => {
    setSelectedStudent(st);
    setFormData({
      fullName: st.fullName,
      gender: st.gender,
      birthDate: st.birthDate,
      username: st.username || `hs${st.className.toLowerCase()}${st.stt < 10 ? '0' + st.stt : st.stt}`,
      password: st.password || '123456',
      supportGoal: st.supportGoal,
      parentName: st.parentName,
      parentPhone: st.parentPhone,
      learningProgress: st.learningProgress,
      skills: { ...st.skills }
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    addStudent({
      fullName: formData.fullName.trim(),
      gender: formData.gender,
      birthDate: formData.birthDate,
      className: activeClass.name,
      username: formData.username.trim() || undefined,
      password: formData.password.trim() || '123456',
      accountStatus: 'active',
      attendanceStatus: 'present',
      attendanceHistory: [{ date: new Date().toISOString().split('T')[0], status: 'present' }],
      activeTasksCount: 2,
      learningProgress: Number(formData.learningProgress),
      skills: formData.skills,
      supportGoal: formData.supportGoal || 'Rèn luyện các kỹ năng học tập tích cực',
      badges: ['daily-learner'],
      parentName: formData.parentName || 'Phụ huynh học sinh',
      parentPhone: formData.parentPhone || '0900 000 000'
    });

    setIsAddModalOpen(false);
    triggerCelebration();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !formData.fullName.trim()) return;

    updateStudent(selectedStudent.id, {
      fullName: formData.fullName.trim(),
      gender: formData.gender,
      birthDate: formData.birthDate,
      username: formData.username.trim() || undefined,
      password: formData.password.trim() || '123456',
      supportGoal: formData.supportGoal,
      parentName: formData.parentName,
      parentPhone: formData.parentPhone,
      learningProgress: Number(formData.learningProgress),
      skills: formData.skills
    });

    setIsEditModalOpen(false);
    setSelectedStudent(null);
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
      setStudentToDelete(null);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['STT', 'Mã HS', 'Tên đăng nhập', 'Mật khẩu', 'Họ và tên', 'Giới tính', 'Lớp', 'Chuyên cần', 'Tiến độ (%)', 'Tiếng Anh', 'Toán', 'Tiếng Việt', 'Tin học', 'Mục tiêu hỗ trợ', 'Phụ huynh', 'Điện thoại'];
    const rows = students.map(s => [
      s.stt,
      s.studentCode,
      s.username || `hs${s.className.toLowerCase()}${s.stt < 10 ? '0' + s.stt : s.stt}`,
      s.password || '123456',
      `"${s.fullName}"`,
      s.gender,
      s.className,
      s.attendanceStatus,
      s.learningProgress,
      s.skills.english,
      s.skills.math,
      s.skills.vietnamese,
      s.skills.informatics,
      `"${s.supportGoal}"`,
      `"${s.parentName}"`,
      s.parentPhone
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Danh_sach_hoc_sinh_Lop_${activeClass.name}_Khoi_${activeClass.grade}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Stats Ribbon */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>HỒ SƠ HỌC SINH LỚP {activeClass.name} (KHỐI {activeClass.grade})</span>
            </div>

            {/* Quick Class Switcher Dropdown */}
            <select
              value={activeClass.id}
              onChange={(e) => setActiveClassId(e.target.value)}
              className="text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 rounded-lg px-2.5 py-1 cursor-pointer hover:bg-purple-100 transition-colors"
              title="Chuyển sang lớp khác"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Lớp {c.name} - Khối {c.grade} ({c.students?.length || 0} HS)
                </option>
              ))}
            </select>

            <button
              onClick={() => setClassModalOpen(true)}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 underline ml-1"
            >
              Quản lý danh sách lớp
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Danh sách & Dữ liệu Theo dõi Cá nhân hóa
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi sự tiến bộ, đánh giá 4 năng lực môn học và hỗ trợ từng học sinh theo mục tiêu riêng
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-[11px] text-amber-800 font-medium">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Dữ liệu hồ sơ học sinh lớp {activeClass.name} (kết nối trực tuyến Google Sheet, cho phép thêm, sửa, đổi STT, xóa và xuất file)</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleAutoGenerateAccounts}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
            title="Tự động cấp tài khoản hs<lớp><stt> và mật khẩu mặc định (123456) cho toàn bộ học sinh"
          >
            <Zap className="w-4 h-4 fill-white text-white" />
            <span>Cấp TK tự động</span>
          </button>
          <button
            onClick={() => setIsAccountListModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors flex items-center gap-1.5 border border-indigo-200"
            title="Xem danh sách tài khoản, mật khẩu học sinh; in thẻ hoặc sao chép gửi phụ huynh"
          >
            <KeyRound className="w-4 h-4 text-indigo-600" />
            <span>Danh sách TK & In thẻ</span>
          </button>
          <button
            onClick={() => setDbModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors flex items-center gap-2 border border-emerald-300 shadow-2xs"
            title={`Kết nối và đồng bộ trực tuyến danh sách lớp ${activeClass.name} từ Google Sheets`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Google Sheet Lớp {activeClass.name}</span>
            <span
              className={`w-2 h-2 rounded-full ${
                dbConfig.provider === 'googlesheets' && dbConfig.status === 'connected'
                  ? 'bg-emerald-500 animate-pulse'
                  : 'bg-amber-400'
              }`}
            />
          </button>
          <button
            onClick={() => setDbModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs transition-colors flex items-center gap-2 border border-purple-200"
            title="Mở bảng điều khiển Cơ sở Dữ liệu Trực tuyến"
          >
            <Database className="w-4 h-4 text-purple-600" />
            <span>CSDL Đám mây</span>
            <span
              className={`w-2 h-2 rounded-full ${
                dbConfig.status === 'connected' ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
            />
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Xuất file Excel/CSV</span>
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Nhập dữ liệu</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-[#5538F5] hover:bg-[#6738FF] text-white font-bold text-xs transition-colors shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm học sinh</span>
          </button>
        </div>
      </div>

      {/* Auto Gen Notification Banner */}
      {autoGenNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-900 text-xs font-semibold animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <CheckCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{autoGenNotice}</span>
          </div>
          <button
            onClick={() => setAutoGenNotice('')}
            className="text-emerald-700 hover:text-emerald-900 text-xs underline font-normal"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Search, Filters, Sorting Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên, mã HS, phụ huynh..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Chuyên cần:</span>
            <select
              value={filterAttendance}
              onChange={(e) => setFilterAttendance(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="all">Tất cả ({students.length})</option>
              <option value="present">Có mặt</option>
              <option value="late">Đi muộn</option>
              <option value="excused">Nghỉ có phép</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Năng lực TT27:</span>
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="all">Tất cả nhóm</option>
              <option value="advanced">🌟 Tốt (Nâng cao)</option>
              <option value="proficient">✅ Đạt (Cốt lõi)</option>
              <option value="remedial">🔶 Cần hỗ trợ (Phụ đạo)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="stt">Theo STT</option>
              <option value="name">Theo Họ tên</option>
              <option value="progress">Theo Tiến độ học tập</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              title="Đổi chiều sắp xếp"
            >
              {sortOrder === 'asc' ? 'A→Z (Tăng)' : 'Z→A (Giảm)'}
            </button>
          </div>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/90 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 w-16 text-center">STT / Đổi</th>
                <th className="py-3 px-3">Mã HS / TK</th>
                <th className="py-3 px-4">Họ và tên</th>
                <th className="py-3 px-3 text-center">Năng lực TT27</th>
                <th className="py-3 px-3 text-center">Giới tính</th>
                <th className="py-3 px-3 text-center">Chuyên cần</th>
                <th className="py-3 px-3 text-center">Nhiệm vụ</th>
                <th className="py-3 px-3 text-center">Tiến độ</th>
                <th className="py-3 px-3 text-center">4 Kỹ năng (E/M/V/I)</th>
                <th className="py-3 px-4">Mục tiêu cần hỗ trợ</th>
                <th className="py-3 px-3 text-center">Huy hiệu</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-400">
                    Không tìm thấy học sinh nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr
                    key={st.id}
                    className="hover:bg-purple-50/40 transition-colors group"
                  >
                    {/* STT & Quick Reorder Controls */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[11px]">
                          {st.stt}
                        </span>
                        <div className="flex flex-col">
                          <button
                            onClick={() => changeStudentStt(st.id, Math.max(1, st.stt - 1))}
                            disabled={st.stt === 1}
                            className="text-slate-400 hover:text-purple-600 disabled:opacity-20 p-0.5"
                            title="Chuyển lên"
                          >
                            <MoveUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => changeStudentStt(st.id, Math.min(students.length, st.stt + 1))}
                            disabled={st.stt === students.length}
                            className="text-slate-400 hover:text-purple-600 disabled:opacity-20 p-0.5"
                            title="Chuyển xuống"
                          >
                            <MoveDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-semibold text-purple-700">
                      <div>{st.studentCode}</div>
                      {st.username && (
                        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 font-normal" title={`Mật khẩu: ${st.password || '123456'}`}>
                          <span className="text-slate-400">TK:</span> {st.username}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {st.fullName}
                      <div className="text-[10px] text-slate-400 font-normal">
                        PH: {st.parentName} ({st.parentPhone})
                      </div>
                    </td>

                    {/* Năng lực TT27 */}
                    <td className="py-3 px-3 text-center">
                      <select
                        value={st.abilityTier || (st.learningProgress >= 88 ? 'advanced' : st.learningProgress >= 70 ? 'proficient' : 'remedial')}
                        onChange={(e) => updateStudentAbilityTier(st.id, e.target.value as any)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border cursor-pointer ${
                          (st.abilityTier || (st.learningProgress >= 88 ? 'advanced' : st.learningProgress >= 70 ? 'proficient' : 'remedial')) === 'advanced'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : (st.abilityTier || (st.learningProgress >= 88 ? 'advanced' : st.learningProgress >= 70 ? 'proficient' : 'remedial')) === 'proficient'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                        title="Phân nhóm năng lực TT27 (Click để chuyển nhóm)"
                      >
                        <option value="advanced">🌟 Tốt</option>
                        <option value="proficient">✅ Đạt</option>
                        <option value="remedial">🔶 Hỗ trợ</option>
                      </select>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          st.gender === 'Nữ'
                            ? 'bg-pink-100 text-pink-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {st.gender}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      {st.attendanceStatus === 'present' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium text-[11px]">
                          <CheckCircle className="w-3 h-3" />
                          <span>Có mặt</span>
                        </span>
                      )}
                      {st.attendanceStatus === 'late' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-medium text-[11px]">
                          <Clock className="w-3 h-3" />
                          <span>Đi muộn</span>
                        </span>
                      )}
                      {st.attendanceStatus === 'excused' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-medium text-[11px]">
                          <span>Có phép</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center font-semibold text-slate-700">
                      {st.activeTasksCount} đang làm
                    </td>

                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-1.5 font-bold text-slate-900">
                        <span>{st.learningProgress}%</span>
                      </div>
                      <div className="w-16 mx-auto bg-slate-100 rounded-full h-1 mt-1 overflow-hidden">
                        <div
                          className="bg-purple-600 h-1 rounded-full"
                          style={{ width: `${st.learningProgress}%` }}
                        />
                      </div>
                    </td>

                    {/* 4 skills miniature badges */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-[10px] font-bold">
                        <span className="px-1 py-0.5 rounded bg-indigo-50 text-indigo-700" title="Tiếng Anh">
                          E:{st.skills.english}
                        </span>
                        <span className="px-1 py-0.5 rounded bg-emerald-50 text-emerald-700" title="Toán">
                          M:{st.skills.math}
                        </span>
                        <span className="px-1 py-0.5 rounded bg-rose-50 text-rose-700" title="Tiếng Việt">
                          V:{st.skills.vietnamese}
                        </span>
                        <span className="px-1 py-0.5 rounded bg-cyan-50 text-cyan-700" title="Tin học">
                          I:{st.skills.informatics}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs truncate text-slate-600" title={st.supportGoal}>
                      {st.supportGoal}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200 text-[10px]">
                        <Award className="w-3 h-3 text-amber-500" />
                        <span>{st.badges?.length || 0}</span>
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedStudent(st)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                          title="Xem hồ sơ chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setTargetStudentForPasswordChange(st);
                            setChangePasswordOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title={`Cấp / Đổi mật khẩu học sinh (${st.fullName})`}
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(st)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Sửa thông tin"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setStudentToDelete(st)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Xóa học sinh"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div>
            Tổng số: <span className="font-bold text-slate-900">{students.length}</span> học sinh lớp {activeClass.name}
          </div>
          <div className="text-[11px] italic">
            Giáo viên phụ trách: {activeClass.teacherName} • {activeClass.schoolName || 'Trường Tiểu học Hoài Nhơn'}
          </div>
        </div>
      </div>

      {/* Modal 1: Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
                  {selectedStudent.stt}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedStudent.fullName} ({selectedStudent.studentCode})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lớp {activeClass.name} • {activeClass.schoolName || 'Trường Tiểu học Hoài Nhơn'} • Ngày sinh: {selectedStudent.birthDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4 Skills Competency Bars */}
            <div className="space-y-3 bg-slate-50 rounded-2xl p-4 border border-slate-200/70">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Năng lực 4 môn học cốt lõi</span>
              </h4>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>🇬🇧 Tiếng Anh (English)</span>
                    <span className="text-indigo-600 font-bold">{selectedStudent.skills.english}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${selectedStudent.skills.english}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>📐 Toán học (Math)</span>
                    <span className="text-emerald-600 font-bold">{selectedStudent.skills.math}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${selectedStudent.skills.math}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>📖 Tiếng Việt (Vietnamese)</span>
                    <span className="text-rose-600 font-bold">{selectedStudent.skills.vietnamese}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-rose-600 h-2 rounded-full" style={{ width: `${selectedStudent.skills.vietnamese}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>💻 Tin học (Informatics)</span>
                    <span className="text-cyan-600 font-bold">{selectedStudent.skills.informatics}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-cyan-600 h-2 rounded-full" style={{ width: `${selectedStudent.skills.informatics}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Goal */}
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200 text-xs space-y-1">
              <div className="font-bold text-purple-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <span>Mục tiêu rèn luyện cá nhân hóa của cô {teacherProfile?.fullName || teacherProfile?.name || 'Giáo viên'}:</span>
              </div>
              <p className="text-purple-800 leading-relaxed font-medium">
                {selectedStudent.supportGoal}
              </p>
            </div>

            {/* Badges Earned */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Huy hiệu tích cực đã đạt được ({selectedStudent.badges?.length || 0})
                </h4>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400">Trao thêm:</span>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        awardBadge(selectedStudent.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="bg-slate-50 border border-slate-200 rounded text-[11px] px-2 py-0.5 text-purple-700 font-medium"
                  >
                    <option value="">+ Trao huy hiệu...</option>
                    {badges.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.englishName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedStudent.badges.map((bId) => {
                  const b = badges.find(x => x.id === bId);
                  if (!b) return null;
                  return (
                    <div
                      key={b.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-900 text-xs font-bold border border-purple-200 shadow-2xs"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>{b.name}</span>
                      <span className="text-[10px] text-purple-600 font-normal">({b.englishName})</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Account Info (Google Sheet / System) */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">
                  Tài khoản đăng nhập App (Đồng bộ Google Sheet)
                </span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {selectedStudent.username || `hs${activeClass.name.toLowerCase().replace(/\s+/g, '')}${String(selectedStudent.stt).padStart(2, '0')}`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Mật khẩu</span>
                <span className="font-mono font-bold text-purple-900 bg-white px-2.5 py-1 rounded-lg border border-purple-200 shadow-2xs inline-block">
                  {selectedStudent.password || '123456'}
                </span>
              </div>
            </div>

            {/* Parent & Attendance info */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-[10px]">Phụ huynh học sinh</span>
                <span className="font-bold text-slate-900">{selectedStudent.parentName}</span>
                <span className="text-slate-500 block">{selectedStudent.parentPhone}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-[10px]">Vị trí ngồi</span>
                <span className="font-bold text-slate-900">
                  Tổ {selectedStudent.seatGroup || 1} • Bàn {selectedStudent.seatIndex || 1}
                </span>
                <span className="text-emerald-600 font-medium block">
                  Trạng thái: {selectedStudent.attendanceStatus}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" />
                <span>Thêm học sinh mới vào lớp {activeClass.name}</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Họ và tên học sinh *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ví dụ: Lê Gia Bảo"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Student App Credentials */}
              <div className="grid grid-cols-2 gap-3 p-2.5 rounded-2xl bg-purple-50/70 border border-purple-200">
                <div>
                  <label className="block text-purple-950 font-semibold mb-1">
                    Tên đăng nhập (Học sinh)
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder={`vd: hs${(activeClass?.name || '3c1').toLowerCase().replace(/[^a-z0-9]/g, '')}01 (hoặc kéo từ Sheet)`}
                    className="w-full px-3 py-2 rounded-xl border border-purple-300 bg-white text-slate-900 font-mono text-xs focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-purple-950 font-semibold mb-1">
                    Mật khẩu đăng nhập
                  </label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Mặc định: 123456"
                    className="w-full px-3 py-2 rounded-xl border border-purple-300 bg-white text-slate-900 font-mono text-xs focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Giới tính</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Họ tên Phụ huynh</label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="Bố/Mẹ học sinh"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Số điện thoại liên hệ</label>
                  <input
                    type="text"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    placeholder="0912 xxx xxx"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Mục tiêu cần hỗ trợ / Điểm cần lưu ý
                </label>
                <textarea
                  rows={2}
                  value={formData.supportGoal}
                  onChange={(e) => setFormData({ ...formData, supportGoal: e.target.value })}
                  placeholder="Ví dụ: Rèn luyện khả năng phát âm từ vựng tiếng Anh chủ đề Friends..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md"
                >
                  Lưu học sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Edit Student Modal */}
      {isEditModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                <span>Chỉnh sửa hồ sơ: {selectedStudent.fullName} ({selectedStudent.studentCode})</span>
              </h3>
              <button onClick={() => setIsEditModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Họ và tên học sinh *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Student App Credentials */}
              <div className="grid grid-cols-2 gap-3 p-2.5 rounded-2xl bg-blue-50/70 border border-blue-200">
                <div>
                  <label className="block text-blue-950 font-semibold mb-1">
                    Tên đăng nhập (Học sinh)
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-blue-300 bg-white text-slate-900 font-mono text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-blue-950 font-semibold mb-1">
                    Mật khẩu đăng nhập
                  </label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-blue-300 bg-white text-slate-900 font-mono text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Giới tính</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phụ huynh</label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mục tiêu cần hỗ trợ</label>
                <textarea
                  rows={2}
                  value={formData.supportGoal}
                  onChange={(e) => setFormData({ ...formData, supportGoal: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
                >
                  Cập nhật thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Xác nhận xóa học sinh khỏi danh sách lớp {activeClass.name}
              </h3>
              <p className="text-xs text-slate-600">
                Bạn có chắc chắn muốn xóa học sinh{' '}
                <span className="font-bold text-rose-600">{studentToDelete.fullName}</span> ({studentToDelete.studentCode})?
                Hành động này sẽ cập nhật lại số thứ tự tự động cho toàn lớp.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: Import CSV / Sample data */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-600" />
                <span>Nhập danh sách học sinh từ file</span>
              </h3>
              <button onClick={() => setIsImportModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có thể tải lên file .csv hoặc bấm nạp nhanh học sinh mẫu để kiểm thử chức năng quản lý lớp {activeClass.name}.
            </p>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-emerald-950">Đồng bộ trực tiếp từ Google Sheets</div>
                  <div className="text-emerald-700 text-[11px]">Dán link bảng tính để kéo cả lớp tự động</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setDbModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs shrink-0"
              >
                Mở Google Sheet
              </button>
            </div>

            <div className="p-4 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 text-center space-y-2">
              <Upload className="w-8 h-8 text-purple-500 mx-auto" />
              <div className="text-xs font-semibold text-purple-900">
                Kéo thả file .csv hoặc chọn từ máy tính
              </div>
              <input
                type="file"
                accept=".csv"
                className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    // Demo upload feedback
                    alert('Đã nhận diện file: ' + e.target.files[0].name + '. Đang xử lý bóc tách danh sách...');
                    setIsImportModalOpen(false);
                  }
                }}
              />
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => {
                  bulkImportStudents([
                    { fullName: 'Lê Hoàng Long', gender: 'Nam', supportGoal: 'Rèn luyện thêm tính toán có lời văn', parentName: 'Lê Văn Phú', parentPhone: '0911 222 333' },
                    { fullName: 'Đỗ Thục Quyên', gender: 'Nữ', supportGoal: 'Bồi dưỡng viết đoạn văn ngắn sáng tạo', parentName: 'Đỗ Văn Thành', parentPhone: '0988 333 444' }
                  ]);
                  setIsImportModalOpen(false);
                  triggerCelebration();
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs font-semibold"
              >
                + Nạp nhanh 2 học sinh mẫu
              </button>

              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 6: Student Account List & Print Credentials Modal */}
      {isAccountListModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-amber-200 text-[11px] font-bold">
                    TRƯỜNG TIỂU HỌC HOÀI NHƠN
                  </span>
                  <span className="text-white/60 text-xs">|</span>
                  <span className="text-white/90 text-xs font-semibold">Lớp {activeClass.name}</span>
                </div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-300" />
                  <span>Danh Sách Tài Khoản & Mật Khẩu Học Sinh</span>
                </h3>
                <p className="text-xs text-indigo-200 mt-0.5">
                  Tổng cộng {students.length} học sinh. Dùng để gửi phiếu thông tin cho học sinh và phụ huynh.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/20"
                  title="In danh sách tài khoản"
                >
                  <Printer className="w-4 h-4" />
                  <span>In danh sách</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyAccountList}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Sao chép toàn bộ danh sách để gửi Zalo"
                >
                  {copiedNotice ? <CheckCheck className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedNotice ? 'Đã sao chép!' : 'Sao chép Zalo/Excel'}</span>
                </button>
                <button
                  onClick={() => setIsAccountListModalOpen(false)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Note banner */}
            <div className="p-4 bg-purple-50 border-b border-purple-100 flex items-center justify-between text-xs text-purple-900 gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                <span>
                  Quy tắc tài khoản: <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-purple-800">hs&lt;tên lớp&gt;&lt;stt&gt;</code> (VD: <strong>hs{activeClass.name.toLowerCase()}01</strong>). Mật khẩu mặc định là <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-emerald-700">123456</code>.
                </span>
              </div>
              <button
                type="button"
                onClick={handleAutoGenerateAccounts}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] flex items-center gap-1"
              >
                <Zap className="w-3.5 h-3.5" />
                Cập nhật lại toàn bộ
              </button>
            </div>

            {/* Accounts Table */}
            <div className="p-5 overflow-y-auto flex-1">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-12">STT</th>
                    <th className="py-2.5 px-3">Mã học sinh</th>
                    <th className="py-2.5 px-4">Họ và tên</th>
                    <th className="py-2.5 px-3 font-mono">Tên đăng nhập</th>
                    <th className="py-2.5 px-3 font-mono">Mật khẩu</th>
                    <th className="py-2.5 px-3 text-center">Năng lực TT27</th>
                    <th className="py-2.5 px-3 text-center">Đổi MK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((st) => {
                    const u = st.username || `hs${st.className.toLowerCase()}${st.stt < 10 ? '0' + st.stt : st.stt}`;
                    const p = st.password || '123456';
                    const tier = st.abilityTier || (st.learningProgress >= 88 ? 'advanced' : st.learningProgress >= 70 ? 'proficient' : 'remedial');
                    return (
                      <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 text-center font-bold text-slate-500">{st.stt}</td>
                        <td className="py-2.5 px-3 font-semibold text-purple-700">{st.studentCode}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">{st.fullName}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-indigo-700 bg-indigo-50/40 rounded">
                          {u}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-700 bg-emerald-50/40 rounded">
                          {p}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tier === 'advanced'
                              ? 'bg-purple-100 text-purple-700'
                              : tier === 'remedial'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {tier === 'advanced' ? '🌟 Tốt (Nâng cao)' : tier === 'remedial' ? '🔶 Cần hỗ trợ' : '✅ Hoàn thành'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setTargetStudentForPasswordChange(st);
                              setChangePasswordOpen(true);
                            }}
                            className="p-1 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                            title={`Đổi mật khẩu cho em ${st.fullName}`}
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                * Học sinh đăng nhập bằng Tên đăng nhập và Mật khẩu ở trên, sau đó có thể tự đổi mật khẩu cá nhân.
              </span>
              <button
                type="button"
                onClick={() => setIsAccountListModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
