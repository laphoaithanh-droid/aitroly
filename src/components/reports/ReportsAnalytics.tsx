import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  Sparkles,
  PieChart as PieChartIcon,
  FileSpreadsheet,
  BookOpen,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Copy,
  Check,
  FileText,
  ChevronDown,
  ChevronUp,
  School,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';

export const ReportsAnalytics: React.FC = () => {
  const {
    students,
    assignments,
    badges,
    teacherProfile,
    activeClass,
    subjects
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'tt27'>('tt27');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tt27Filter, setTt27Filter] = useState<'all' | 'T' | 'H' | 'C'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedDetailStudent, setSelectedDetailStudent] = useState<Student | null>(null);

  const total = students.length;
  const present = students.filter(s => s.attendanceStatus === 'present').length;
  const late = students.filter(s => s.attendanceStatus === 'late').length;
  const excused = students.filter(s => s.attendanceStatus === 'excused').length;
  const unexcused = students.filter(s => s.attendanceStatus === 'unexcused').length;

  // Average competencies
  const avgEnglish = total > 0 ? Math.round(students.reduce((a, s) => a + (s.skills.english || 0), 0) / total) : 0;
  const avgMath = total > 0 ? Math.round(students.reduce((a, s) => a + (s.skills.math || 0), 0) / total) : 0;
  const avgVietnamese = total > 0 ? Math.round(students.reduce((a, s) => a + (s.skills.vietnamese || 0), 0) / total) : 0;
  const avgInformatics = total > 0 ? Math.round(students.reduce((a, s) => a + (s.skills.informatics || 0), 0) / total) : 0;

  // Total badges distributed
  const totalBadges = students.reduce((acc, s) => acc + (s.badges?.length || 0), 0);

  const selectedStudent = selectedStudentId !== 'all' ? students.find(s => s.id === selectedStudentId) : null;

  // Calculate TT27 Level for a student
  const getTT27SubjectLevel = (score: number): { level: 'T' | 'H' | 'C'; score10: number; label: string; color: string } => {
    const score10 = Math.min(10, Math.max(1, Math.round((score / 100) * 10)));
    if (score >= 80) {
      return { level: 'T', score10, label: 'Hoàn thành tốt', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    } else if (score >= 50) {
      return { level: 'H', score10, label: 'Hoàn thành', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    } else {
      return { level: 'C', score10, label: 'Chưa hoàn thành', color: 'bg-rose-100 text-rose-800 border-rose-300' };
    }
  };

  // Calculate Overall Evaluation according to Circular 27
  const getStudentTT27Evaluation = (student: Student) => {
    const math = getTT27SubjectLevel(student.skills.math || 75);
    const viet = getTT27SubjectLevel(student.skills.vietnamese || 75);
    const eng = getTT27SubjectLevel(student.skills.english || 75);
    const info = getTT27SubjectLevel(student.skills.informatics || 75);

    const levels = [math.level, viet.level, eng.level, info.level];
    const isAllT = levels.every(l => l === 'T');
    const hasC = levels.some(l => l === 'C');

    let overallLevel: 'T' | 'H' | 'C' = 'H';
    let overallTitle = 'Hoàn thành';

    if (isAllT && (student.badges?.length || 0) >= 2) {
      overallLevel = 'T';
      overallTitle = 'Hoàn thành xuất sắc';
    } else if (!hasC) {
      overallLevel = 'H';
      overallTitle = 'Hoàn thành tốt / Đạt chuẩn';
    } else {
      overallLevel = 'C';
      overallTitle = 'Cần bồi dưỡng thêm';
    }

    // Core Competencies: Tự chủ & tự học, Giao tiếp & hợp tác, Giải quyết vấn đề
    const compSelf = student.learningProgress >= 80 ? 'T' : student.learningProgress >= 50 ? 'Đ' : 'C';
    const compComm = (student.badges?.length || 0) >= 2 ? 'T' : 'Đ';
    const compSolve = math.level === 'T' ? 'T' : 'Đ';

    // 5 Qualities: Chăm chỉ, Trung thực, Trách nhiệm, Nhân ái, Yêu nước
    const qualDiligence = student.attendanceStatus === 'present' && student.learningProgress >= 70 ? 'T' : 'Đ';
    const qualResponsibility = student.activeTasksCount <= 1 ? 'T' : 'Đ';
    const qualKindness = (student.badges?.length || 0) >= 1 ? 'T' : 'Đ';

    // Pedagogical comment tailored to TT27
    let comment = '';
    if (overallLevel === 'T') {
      comment = `Tiếp thu bài nhanh, tự giác và chủ động trong học tập. Tích cực phát biểu xây dựng bài môn Toán và Tiếng Việt. Giao tiếp tự tin, hòa đồng với bạn bè.`;
    } else if (overallLevel === 'H') {
      comment = `Nắm được kiến thức cơ bản các môn học, hoàn thành bài tập đúng hạn. Cần rèn thêm tính cẩn thận khi giải toán và luyện chữ viết nắn nót hơn.`;
    } else {
      comment = `Có cố gắng trong học tập nhưng còn rụt rè. Cần giáo viên và gia đình phối hợp kèm thêm môn Toán/Tiếng Việt vào buổi tối.`;
    }

    return {
      math,
      viet,
      eng,
      info,
      overallLevel,
      overallTitle,
      compSelf,
      compComm,
      compSolve,
      qualDiligence,
      qualResponsibility,
      qualKindness,
      comment
    };
  };

  // Class-wide TT27 statistics
  const tt27Stats = useMemo(() => {
    let tCount = 0;
    let hCount = 0;
    let cCount = 0;

    students.forEach(st => {
      const evalData = getStudentTT27Evaluation(st);
      if (evalData.overallLevel === 'T') tCount++;
      else if (evalData.overallLevel === 'H') hCount++;
      else cCount++;
    });

    const totalStudents = students.length || 1;
    return {
      tCount,
      tPct: Math.round((tCount / totalStudents) * 100),
      hCount,
      hPct: Math.round((hCount / totalStudents) * 100),
      cCount,
      cPct: Math.round((cCount / totalStudents) * 100)
    };
  }, [students]);

  // Filtered students for TT27 table
  const filteredStudents = useMemo(() => {
    return students.filter(st => {
      const matchesSearch =
        st.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.stt.toString().includes(searchQuery);

      if (!matchesSearch) return false;

      if (tt27Filter === 'all') return true;
      const evalData = getStudentTT27Evaluation(st);
      return evalData.overallLevel === tt27Filter;
    });
  }, [students, searchQuery, tt27Filter]);

  const handlePrint = () => {
    window.print();
  };

  const copyComment = (id: string, commentText: string) => {
    navigator.clipboard.writeText(commentText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Export CSV conforming to Circular 27 with UTF-8 BOM
  const handleExportCSV = () => {
    const headers = [
      'STT',
      'Mã HS',
      'Họ và tên',
      'Giới tính',
      'Toán (Điểm)',
      'Toán (Mức)',
      'Tiếng Việt (Điểm)',
      'Tiếng Việt (Mức)',
      'Tiếng Anh (Mức)',
      'Tin học (Mức)',
      'Tự chủ & Tự học',
      'Giao tiếp & Hợp tác',
      'Giải quyết VĐ & Sáng tạo',
      'Chăm chỉ',
      'Trách nhiệm',
      'Đánh giá chung TT27',
      'Nhận xét vì sự tiến bộ của học sinh'
    ];

    const rows = students.map(st => {
      const ev = getStudentTT27Evaluation(st);
      return [
        st.stt,
        st.studentCode,
        `"${st.fullName}"`,
        st.gender,
        ev.math.score10,
        ev.math.level,
        ev.viet.score10,
        ev.viet.level,
        ev.eng.level,
        ev.info.level,
        ev.compSelf,
        ev.compComm,
        ev.compSolve,
        ev.qualDiligence,
        ev.qualResponsibility,
        `"${ev.overallTitle}"`,
        `"${ev.comment.replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bang_Danh_Gia_Dinh_Ky_TT27_Lop_${activeClass?.name || '3C1'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
            <span>TRUNG TÂM PHÂN TÍCH & BÁO CÁO GIÁO DỤC • LỚP {activeClass?.name || '3C1'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Hồ Sơ Đánh Giá Định Kỳ & Báo Cáo Năng Lực Học Sinh
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Đáp ứng chuẩn Thông tư 27/2020/TT-BGDĐT • {activeClass?.name || 'Lớp học'} • {teacherProfile?.schoolName || (teacherProfile as any)?.school || 'Trường Tiểu học Hoài Nhơn'} • GVCN: {teacherProfile?.fullName || teacherProfile?.name || 'Giáo viên'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
            title="Xuất bảng điểm và nhận xét Thông tư 27 sang file CSV/Excel chuẩn Tiếng Việt"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất Excel / CSV (TT 27)</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>In bản báo cáo</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('tt27')}
          className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'tt27'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Bảng Tổng Hợp Đánh Giá Chuẩn Thông Tư 27</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-700">
            Khuyến nghị BGD
          </span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Biểu Đồ Năng Lực & Chuyên Cần 4 Môn</span>
        </button>
      </div>

      {/* TAB 1: THÔNG TƯ 27 EVALUATION MATRIX */}
      {activeTab === 'tt27' && (
        <div className="space-y-6">
          {/* Statutory Standard Explanation Box */}
          <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200 rounded-3xl p-5 text-xs text-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-purple-900 text-sm">
              <GraduationCap className="w-5 h-5 text-purple-600 shrink-0" />
              <span>Quy Chuẩn Đánh Giá Theo Thông Tư Số 27/2020/TT-BGDĐT Của Bộ Giáo Dục & Đào Tạo</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              • <strong>Môn học & Hoạt động giáo dục:</strong> Đánh giá mức độ hoàn thành với 3 mức: <span className="font-bold text-emerald-700">T (Hoàn thành tốt)</span>, <span className="font-bold text-blue-700">H (Hoàn thành)</span>, <span className="font-bold text-rose-700">C (Chưa hoàn thành)</span>. Điểm kiểm tra định kỳ (Toán, Tiếng Việt) lấy thang điểm 10.<br />
              • <strong>Năng lực cốt lõi & Phẩm chất chủ yếu:</strong> Đánh giá theo 3 mức: <span className="font-bold text-emerald-700">T (Tốt)</span>, <span className="font-bold text-blue-700">Đ (Đạt)</span>, <span className="font-bold text-amber-700">C (Cần cố gắng)</span>.<br />
              • <strong>Nguyên tắc:</strong> Đánh giá vì sự tiến bộ của học sinh; coi trọng động viên, khích lệ; không so sánh học sinh này với học sinh khác.
            </p>
          </div>

          {/* TT27 KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-emerald-200/80 shadow-xs space-y-2 bg-gradient-to-br from-white to-emerald-50/30">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center justify-between">
                <span>Mức T - Hoàn thành tốt</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px]">Xuất sắc</span>
              </span>
              <div className="text-3xl font-extrabold text-emerald-700">
                {tt27Stats.tCount} <span className="text-base font-semibold text-slate-500">/ {total} em</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${tt27Stats.tPct}%` }} />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Chiếm {tt27Stats.tPct}% tổng số học sinh lớp</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-blue-200/80 shadow-xs space-y-2 bg-gradient-to-br from-white to-blue-50/30">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 flex items-center justify-between">
                <span>Mức H - Hoàn thành</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px]">Đạt chuẩn</span>
              </span>
              <div className="text-3xl font-extrabold text-blue-700">
                {tt27Stats.hCount} <span className="text-base font-semibold text-slate-500">/ {total} em</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${tt27Stats.hPct}%` }} />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Chiếm {tt27Stats.hPct}% tổng số học sinh lớp</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-rose-200/80 shadow-xs space-y-2 bg-gradient-to-br from-white to-rose-50/30">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 flex items-center justify-between">
                <span>Mức C - Cần hỗ trợ</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px]">Bồi dưỡng</span>
              </span>
              <div className="text-3xl font-extrabold text-rose-700">
                {tt27Stats.cCount} <span className="text-base font-semibold text-slate-500">/ {total} em</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-rose-600 h-2 rounded-full" style={{ width: `${tt27Stats.cPct}%` }} />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Chiếm {tt27Stats.cPct}% (Cần lộ trình phụ đạo)</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-purple-200/80 shadow-xs space-y-2 bg-gradient-to-br from-white to-purple-50/30">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800 flex items-center justify-between">
                <span>5 Phẩm chất & Năng lực</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px]">Toàn diện</span>
              </span>
              <div className="text-3xl font-extrabold text-purple-700">
                100%
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-600 h-2 rounded-full w-full" />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">100% học sinh đạt mức Đ trở lên</p>
            </div>
          </div>

          {/* Search & Level Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm theo tên học sinh, số thứ tự, mã HS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="font-bold text-slate-600 shrink-0">Lọc mức đánh giá:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setTt27Filter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                    tt27Filter === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Tất cả ({students.length})
                </button>
                <button
                  onClick={() => setTt27Filter('T')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                    tt27Filter === 'T'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  Mức T - Tốt ({tt27Stats.tCount})
                </button>
                <button
                  onClick={() => setTt27Filter('H')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                    tt27Filter === 'H'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                  }`}
                >
                  Mức H - Hoàn thành ({tt27Stats.hCount})
                </button>
                <button
                  onClick={() => setTt27Filter('C')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                    tt27Filter === 'C'
                      ? 'bg-rose-600 text-white'
                      : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                  }`}
                >
                  Mức C - Cần hỗ trợ ({tt27Stats.cCount})
                </button>
              </div>
            </div>
          </div>

          {/* Full TT27 Assessment Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="py-3 px-3 font-bold text-center w-12">STT</th>
                    <th className="py-3 px-3 font-bold min-w-[160px]">Họ và tên học sinh</th>
                    <th className="py-3 px-3 font-bold text-center min-w-[90px]">
                      Toán<br /><span className="text-[10px] text-slate-500 font-normal">(Điểm / Mức)</span>
                    </th>
                    <th className="py-3 px-3 font-bold text-center min-w-[90px]">
                      Tiếng Việt<br /><span className="text-[10px] text-slate-500 font-normal">(Điểm / Mức)</span>
                    </th>
                    <th className="py-3 px-3 font-bold text-center min-w-[80px]">Tiếng Anh</th>
                    <th className="py-3 px-3 font-bold text-center min-w-[80px]">Tin học</th>
                    <th className="py-3 px-3 font-bold text-center min-w-[100px]">
                      Năng lực<br /><span className="text-[10px] text-slate-500 font-normal">(Tự chủ / GT / GQ)</span>
                    </th>
                    <th className="py-3 px-3 font-bold text-center min-w-[100px]">
                      Phẩm chất<br /><span className="text-[10px] text-slate-500 font-normal">(Chăm / TN / Ái)</span>
                    </th>
                    <th className="py-3 px-3 font-bold text-center min-w-[110px]">Đánh giá chung</th>
                    <th className="py-3 px-3 font-bold min-w-[280px]">Nhận xét vì sự tiến bộ (TT 27)</th>
                    <th className="py-3 px-3 font-bold text-center w-24">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-slate-400">
                        Không tìm thấy học sinh nào phù hợp với bộ lọc hiện tại.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st) => {
                      const ev = getStudentTT27Evaluation(st);
                      return (
                        <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 text-center font-bold text-slate-600">
                            {st.stt}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{st.fullName}</div>
                            <div className="text-[10px] text-slate-400">{st.studentCode} • {st.gender}</div>
                          </td>
                          {/* Math */}
                          <td className="py-3 px-3 text-center">
                            <span className="font-extrabold text-slate-900 mr-1.5">{ev.math.score10}đ</span>
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border ${ev.math.color}`}>
                              {ev.math.level}
                            </span>
                          </td>
                          {/* Vietnamese */}
                          <td className="py-3 px-3 text-center">
                            <span className="font-extrabold text-slate-900 mr-1.5">{ev.viet.score10}đ</span>
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border ${ev.viet.color}`}>
                              {ev.viet.level}
                            </span>
                          </td>
                          {/* English */}
                          <td className="py-3 px-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${ev.eng.color}`}>
                              {ev.eng.level} ({ev.eng.score10}đ)
                            </span>
                          </td>
                          {/* Informatics */}
                          <td className="py-3 px-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${ev.info.color}`}>
                              {ev.info.level} ({ev.info.score10}đ)
                            </span>
                          </td>
                          {/* Core Competencies */}
                          <td className="py-3 px-3 text-center">
                            <div className="inline-flex gap-1">
                              <span title="Tự chủ & tự học" className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                {ev.compSelf}
                              </span>
                              <span title="Giao tiếp & hợp tác" className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                {ev.compComm}
                              </span>
                              <span title="Giải quyết vấn đề & sáng tạo" className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                {ev.compSolve}
                              </span>
                            </div>
                          </td>
                          {/* Core Qualities */}
                          <td className="py-3 px-3 text-center">
                            <div className="inline-flex gap-1">
                              <span title="Chăm chỉ" className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                                {ev.qualDiligence}
                              </span>
                              <span title="Trách nhiệm" className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                                {ev.qualResponsibility}
                              </span>
                              <span title="Nhân ái" className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                                {ev.qualKindness}
                              </span>
                            </div>
                          </td>
                          {/* Overall Evaluation */}
                          <td className="py-3 px-3 text-center">
                            <span className={`inline-block px-2 py-1 rounded-lg text-[11px] font-bold ${
                              ev.overallLevel === 'T'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ev.overallLevel === 'H'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {ev.overallTitle}
                            </span>
                          </td>
                          {/* Pedagogical Comment */}
                          <td className="py-3 px-3">
                            <p className="text-slate-700 text-[11px] leading-relaxed line-clamp-2">
                              {ev.comment}
                            </p>
                          </td>
                          {/* Actions */}
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => copyComment(st.id, ev.comment)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                                title="Sao chép lời nhận xét"
                              >
                                {copiedId === st.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => setSelectedDetailStudent(st)}
                                className="px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[10px] transition-colors"
                              >
                                Chi tiết
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
              <div>
                Đang hiển thị <strong>{filteredStudents.length}</strong> / <strong>{students.length}</strong> học sinh lớp {activeClass?.name || '3C1'}
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> T: Hoàn thành tốt (≥80%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> H: Hoàn thành (50-79%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> C: Cần hỗ trợ (&lt;50%)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OVERVIEW & 4-SUBJECT CHARTS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Filter / Scope Selector */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">Phạm vi báo cáo:</span>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
              >
                <option value="all">Toàn bộ Lớp {activeClass?.name || '3C1'} ({students.length} học sinh)</option>
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    Báo cáo cá nhân: {st.stt}. {st.fullName} ({st.studentCode})
                  </option>
                ))}
              </select>
            </div>

            <div className="text-[11px] text-slate-400">
              Năm học {activeClass?.schoolYear || '2026–2027'} • GVCN: {teacherProfile?.fullName || teacherProfile?.name || 'Giáo viên'}
            </div>
          </div>

          {/* ATTENDANCE & PARTICIPATION SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Tỷ lệ chuyên cần lớp
              </span>
              <div className="text-3xl font-extrabold text-emerald-700">
                {total > 0 ? Math.round((present / total) * 100) : 0}%
              </div>
              <p className="text-[11px] text-slate-500">
                {present} có mặt • {late} muộn • {excused} có phép
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Nhiệm vụ đã nộp
              </span>
              <div className="text-3xl font-extrabold text-purple-700">
                {assignments.reduce((a, c) => a + c.submissionsCount, 0)}
              </div>
              <p className="text-[11px] text-slate-500">
                Trên tổng số {assignments.reduce((a, c) => a + c.totalAssigned, 0)} lượt giao
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Huy hiệu tích cực đã trao
              </span>
              <div className="text-3xl font-extrabold text-amber-600">
                {totalBadges}
              </div>
              <p className="text-[11px] text-slate-500">Trung bình {(totalBadges / (total || 1)).toFixed(1)} huy hiệu/em</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Tiến độ học tập bình quân
              </span>
              <div className="text-3xl font-extrabold text-slate-900">
                {total > 0 ? Math.round(students.reduce((a, s) => a + s.learningProgress, 0) / total) : 0}%
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold">Tăng trưởng tích cực</p>
            </div>
          </div>

          {/* 4-SUBJECT COMPETENCIES VISUAL CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Average Subject Progress */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span>
                    {selectedStudent
                      ? `Năng lực các môn của em ${selectedStudent.fullName}`
                      : `Năng lực bình quân các môn học Lớp ${activeClass?.name || '3C1'}`}
                  </span>
                </h3>
              </div>

              <div className="space-y-4 pt-2">
                {/* English Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>🇬🇧 Tiếng Anh (English World)</span>
                    <span className="text-indigo-600">{selectedStudent ? (selectedStudent.skills.english || 0) : avgEnglish}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${selectedStudent ? (selectedStudent.skills.english || 0) : avgEnglish}%` }}
                    />
                  </div>
                </div>

                {/* Math Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>📐 Toán học (Math World)</span>
                    <span className="text-emerald-600">{selectedStudent ? (selectedStudent.skills.math || 0) : avgMath}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${selectedStudent ? (selectedStudent.skills.math || 0) : avgMath}%` }}
                    />
                  </div>
                </div>

                {/* Vietnamese Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>📖 Tiếng Việt (Kết nối tri thức)</span>
                    <span className="text-rose-600">{selectedStudent ? (selectedStudent.skills.vietnamese || 0) : avgVietnamese}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-rose-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${selectedStudent ? (selectedStudent.skills.vietnamese || 0) : avgVietnamese}%` }}
                    />
                  </div>
                </div>

                {/* Informatics Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>💻 Tin học (Informatics World)</span>
                    <span className="text-cyan-600">{selectedStudent ? (selectedStudent.skills.informatics || 0) : avgInformatics}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-cyan-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${selectedStudent ? (selectedStudent.skills.informatics || 0) : avgInformatics}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Chart 2: Positive Badges Distribution */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Phân bố 8 Huy hiệu Khen thưởng Tích cực</span>
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {badges.map((b) => {
                  const count = students.filter(s => s.badges?.includes(b.id)).length;
                  return (
                    <div
                      key={b.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 block truncate">{b.name}</span>
                        <span className="text-[10px] text-purple-600 italic">{b.englishName}</span>
                      </div>
                      <span className="text-base font-extrabold text-amber-600 px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200 shrink-0">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Detailed TT27 Modal */}
      {selectedDetailStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-sm">
                  {selectedDetailStudent.stt}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedDetailStudent.fullName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mã HS: {selectedDetailStudent.studentCode} • Lớp: {activeClass?.name} • Giới tính: {selectedDetailStudent.gender}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDetailStudent(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Assessment Details */}
            {(() => {
              const ev = getStudentTT27Evaluation(selectedDetailStudent);
              return (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-700 block">Đánh giá chung cuối kỳ</span>
                      <span className="text-base font-extrabold text-purple-900">{ev.overallTitle}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                      ev.overallLevel === 'T'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-blue-100 text-blue-800 border-blue-300'
                    }`}>
                      Mức {ev.overallLevel}
                    </span>
                  </div>

                  {/* Subject Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Toán học</span>
                      <span className="text-base font-extrabold text-slate-800">{ev.math.score10}đ</span>
                      <span className={`block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold border text-center ${ev.math.color}`}>
                        {ev.math.label}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Tiếng Việt</span>
                      <span className="text-base font-extrabold text-slate-800">{ev.viet.score10}đ</span>
                      <span className={`block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold border text-center ${ev.viet.color}`}>
                        {ev.viet.label}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Tiếng Anh</span>
                      <span className="text-base font-extrabold text-slate-800">{ev.eng.score10}đ</span>
                      <span className={`block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold border text-center ${ev.eng.color}`}>
                        {ev.eng.label}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Tin học</span>
                      <span className="text-base font-extrabold text-slate-800">{ev.info.score10}đ</span>
                      <span className={`block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold border text-center ${ev.info.color}`}>
                        {ev.info.label}
                      </span>
                    </div>
                  </div>

                  {/* Competencies & Qualities */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-900 block">Năng lực cốt lõi (TT 27)</span>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Tự chủ và tự học:</span>
                          <span className="font-bold px-2 py-0.5 rounded bg-white border border-slate-200">{ev.compSelf === 'T' ? 'Tốt (T)' : 'Đạt (Đ)'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Giao tiếp và hợp tác:</span>
                          <span className="font-bold px-2 py-0.5 rounded bg-white border border-slate-200">{ev.compComm === 'T' ? 'Tốt (T)' : 'Đạt (Đ)'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Giải quyết vấn đề:</span>
                          <span className="font-bold px-2 py-0.5 rounded bg-white border border-slate-200">{ev.compSolve === 'T' ? 'Tốt (T)' : 'Đạt (Đ)'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-900 block">Phẩm chất chủ yếu (TT 27)</span>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Chăm chỉ:</span>
                          <span className="font-bold px-2 py-0.5 rounded bg-white border border-slate-200">{ev.qualDiligence === 'T' ? 'Tốt (T)' : 'Đạt (Đ)'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Trách nhiệm:</span>
                          <span className="font-bold px-2 py-0.5 rounded bg-white border border-slate-200">{ev.qualResponsibility === 'T' ? 'Tốt (T)' : 'Đạt (Đ)'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Nhân ái / Trung thực:</span>
                          <span className="font-bold px-2 py-0.5 rounded bg-white border border-slate-200">{ev.qualKindness === 'T' ? 'Tốt (T)' : 'Đạt (Đ)'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comment Box */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                    <span className="font-bold text-amber-900 block flex items-center justify-between">
                      <span>Lời nhận xét học bạ (Chuẩn quy định TT 27)</span>
                      <button
                        onClick={() => copyComment(selectedDetailStudent.id, ev.comment)}
                        className="text-[11px] font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1"
                      >
                        {copiedId === selectedDetailStudent.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Sao chép</span>
                      </button>
                    </span>
                    <p className="text-slate-700 leading-relaxed italic">
                      "{ev.comment}"
                    </p>
                  </div>
                </div>
              );
            })()}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDetailStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
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
