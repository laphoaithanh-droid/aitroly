import React from 'react';
import {
  Trophy,
  Sparkles,
  Award,
  BookOpen,
  Bot,
  Gamepad2,
  Users,
  ShieldCheck,
  Compass,
  ArrowRight,
  School,
  Languages,
  Calculator,
  Laptop,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CompetitionShowcase: React.FC = () => {
  const { teacherProfile, activeClass, setActiveView } = useApp();

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* 1. Official Competition Presentation Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1428] via-[#1E1B4B] to-[#5538F5] text-white p-8 sm:p-12 shadow-2xl border border-indigo-900/60 text-center space-y-4">
        {/* Glow circles */}
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
          {/* Main Contest Identity Ribbon */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400/25 to-purple-400/25 border border-amber-300/40 text-amber-200 text-xs sm:text-sm font-extrabold tracking-wide shadow-md backdrop-blur-md">
            <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>SẢN PHẨM DỰ THI ĐỔI MỚI SÁNG TẠO ỨNG DỤNG AI TRONG GIÁO DỤC</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {teacherProfile?.schoolName || 'TRƯỜNG TIỂU HỌC HOÀI NHƠN'} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-200 to-amber-200">
              AI CLASSROOM – TRỢ LÝ GIẢNG DẠY & QUẢN LÝ LỚP HỌC THÔNG MINH
            </span>
          </h1>

          <p className="text-sm sm:text-base font-semibold text-purple-200 italic">
            “Mô hình chuyển đổi số và ứng dụng AI sư phạm: Chuẩn hoá Kế hoạch bài dạy CV 2345, Đánh giá TT 27, Đồng bộ Google Sheet và Kỹ năng sống SEL.”
          </p>

          <div className="text-xs sm:text-sm font-extrabold text-amber-300 tracking-wider">
            Slogan: Smart AI – Happy Classroom – Digital Future.
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-indigo-100">
            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 font-bold">
              Giáo viên phụ trách: {teacherProfile?.fullName || teacherProfile?.name || 'Giáo viên'}
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 font-bold">
              Lớp đang phụ trách: {activeClass?.name || '3C1'} (Khối {activeClass?.grade || 3})
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
              Năm học: {activeClass?.schoolYear || '2026–2027'}
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => setActiveView('dashboard')}
              className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs sm:text-sm shadow-xl flex items-center gap-2 transition-all hover:scale-102"
            >
              <Compass className="w-4 h-4 text-purple-600" />
              <span>Trải nghiệm trực tiếp hệ thống</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Mục tiêu dự án & Giá trị sư phạm */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <span>Mục tiêu xây dựng hệ sinh thái</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Ứng dụng được thiết kế nhằm xây dựng một hệ sinh thái số toàn diện hỗ trợ giáo viên chủ nhiệm
          quản lý lớp học thông minh, theo dõi quá trình rèn luyện, tổ chức các hoạt động học tập sáng tạo,
          kết nối chặt chẽ giữa <strong>Giáo viên – Học sinh – Phụ huynh</strong> và phát triển năng lực ngôn ngữ,
          tư duy số cho học sinh tiểu học, lấy học sinh <strong>lớp {activeClass?.name || '3C1'}</strong> làm trọng tâm thực nghiệm.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
            <span className="text-xs font-bold text-purple-900 block">1. Quản lý thông minh</span>
            <p className="text-xs text-purple-800">
              Điểm danh 1 chạm, sơ đồ lớp hoán đổi linh hoạt và hồ sơ học sinh bảo mật.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="text-xs font-bold text-emerald-900 block">2. Cá nhân hóa học tập</span>
            <p className="text-xs text-emerald-800">
              Giao nhiệm vụ theo nhóm năng lực (ẩn danh sư phạm), gợi ý giải bài không lộ đáp án.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
            <span className="text-xs font-bold text-blue-900 block">3. Kết nối yêu thương</span>
            <p className="text-xs text-blue-800">
              Sổ liên lạc 2 chiều, khen thưởng 8 huy hiệu tích cực, tạo môi trường học tập hạnh phúc.
            </p>
          </div>
        </div>
      </div>

      {/* 3. 9 Điểm nổi bật vượt trội của sản phẩm */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>9 Điểm nổi bật và sáng tạo của mô hình</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Feature 1 */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">1. Trợ lý AI cho Giáo viên</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tự động gợi ý kế hoạch bài dạy 4 bước, soạn thông báo phụ huynh song ngữ và lời nhận xét theo năng lực thực tế.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <School className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">2. Quản lý lớp & Sơ đồ bàn ghế</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trực quan hóa 4 tổ bàn ghế, hỗ trợ kéo thả hoán đổi chỗ ngồi học sinh và lưu phương án linh hoạt.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Languages className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">3. AI English World 3</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              6 Chủ đề tiếng Anh song ngữ tích hợp Web Speech AI Audio phát âm chuẩn bản xứ, mẫu câu và hội thoại tương tác.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">4. Math World Trực Quan</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Đầy đủ 8 thành phần trực quan: Bàn tính, tia số, giải toán bằng hai bước tính, phân tích "Cho biết gì? Hỏi gì?".
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">5. Tiếng Việt Kết Nối Tri Thức</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bám sát mạch 6 chủ điểm SGK: Đọc hiểu, mở rộng vốn từ, biện pháp so sánh, nhân hóa và góc Writing Lab.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
              <Laptop className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">6. Tin học & Kỹ năng số</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mô phỏng bàn phím ảo 3D nhận diện phím gờ F/J, chuột ảo và cây thư mục tương tác theo 6 chủ đề SGK.
            </p>
          </div>

          {/* Feature 7 */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">7. 10 Game Sư phạm & Tạo từ File</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              10 trò chơi sư phạm cốt lõi kết hợp công cụ thông minh tự động bóc tách câu hỏi từ file PowerPoint, Word, PDF.
            </p>
          </div>

          {/* Feature 8 */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">8. Khen thưởng 8 Huy hiệu Tích cực</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tôn vinh nỗ lực của từng em (Kind Friend, English Star, Green Hero...). Tuyệt đối không dán nhãn tiêu cực.
            </p>
          </div>

          {/* Feature 9 */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">9. An toàn số & Trách nhiệm AI</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bảo mật phân quyền, không thu thập dữ liệu riêng tư, tuân thủ đạo đức ứng dụng AI cho lứa tuổi tiểu học.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Tuyên bố trung thực & Trách nhiệm */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="font-bold text-slate-800">
          Cam kết tính trung thực & sư phạm của sản phẩm dự thi:
        </div>
        <p className="leading-relaxed">
          Sản phẩm được phát triển nhằm mục đích nghiên cứu, ứng dụng thực tế và tham gia dự thi chuyên môn.
          Toàn bộ các số liệu thống kê được tính toán từ các bản ghi lưu trữ thực tế trong hệ sinh thái.
          Hệ thống không tự tạo giải thưởng, danh hiệu hay số liệu ảo để tạo ấn tượng khi chưa có minh chứng.
        </p>
        <div className="text-[11px] text-slate-400 italic">
          Tác giả: Giáo viên {teacherProfile?.fullName || teacherProfile?.name || 'Giáo viên'} • {teacherProfile?.schoolName || (teacherProfile as any)?.school || 'Trường Tiểu học Hoài Nhơn'} • Lớp phụ trách: {activeClass?.name || '3C1'}
        </div>
      </div>
    </div>
  );
};
