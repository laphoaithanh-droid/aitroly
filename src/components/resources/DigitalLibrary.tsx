import React, { useState, useMemo, useEffect } from 'react';
import {
  FolderOpen,
  FileText,
  Video,
  Download,
  Plus,
  Filter,
  Sparkles,
  BookOpen,
  Music,
  ExternalLink,
  Check,
  Trash2,
  UploadCloud,
  FileUp,
  FileDown,
  Search,
  Eye,
  Bot,
  HelpCircle,
  CheckCircle2,
  X,
  Layers,
  FileSpreadsheet,
  PlusCircle,
  GraduationCap,
  School,
  Share2,
  Save
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LearningMaterial, MaterialQuestion } from '../../types';

export const DigitalLibrary: React.FC = () => {
  const {
    materials,
    addMaterial,
    deleteMaterial,
    bulkImportMaterials,
    createAssignmentFromMaterial,
    currentUser,
    activeClass,
    teacherProfile,
    subjects,
    setActiveView,
    triggerCelebration
  } = useApp();

  // Filters & Search
  const [selectedSubjectTab, setSelectedSubjectTab] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importTab, setImportTab] = useState<'manual' | 'file' | 'json' | 'packages'>('manual');
  const [viewingMaterial, setViewingMaterial] = useState<LearningMaterial | null>(null);
  const [viewerActiveTab, setViewerActiveTab] = useState<'content' | 'quiz' | 'info'>('content');

  // Quiz state inside viewer
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Manual Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSubject, setFormSubject] = useState<string>('english');
  const [formGrade, setFormGrade] = useState<number>(activeClass.grade || 3);
  const [formType, setFormType] = useState<'pptx' | 'docx' | 'pdf' | 'video' | 'audio' | 'link' | 'quiz'>('pptx');
  const [formUrl, setFormUrl] = useState('');
  const [formAuthor, setFormAuthor] = useState(teacherProfile.fullName || teacherProfile.name || 'Giáo viên');
  const [formDesc, setFormDesc] = useState('');

  // Synchronize author reactively with teacherProfile
  useEffect(() => {
    if (teacherProfile.name) {
      setFormAuthor(teacherProfile.fullName || teacherProfile.name);
    }
  }, [teacherProfile.name, teacherProfile.fullName]);
  const [formContent, setFormContent] = useState('');
  const [formKeyConcepts, setFormKeyConcepts] = useState('');
  const [formQuestions, setFormQuestions] = useState<MaterialQuestion[]>([
    {
      question: '',
      options: ['', '', '', ''],
      answer: '',
      explanation: ''
    }
  ]);

  // File Upload State
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');
  const [uploadedFileType, setUploadedFileType] = useState<'pptx' | 'docx' | 'pdf' | 'video' | 'audio'>('pdf');
  const [uploadedSubject, setUploadedSubject] = useState<string>('math');
  const [uploadedGrade, setUploadedGrade] = useState<number>(activeClass.grade || 3);

  // JSON Import State
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [jsonSuccess, setJsonSuccess] = useState('');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Materials
  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchSubject = selectedSubjectTab === 'all' || m.subject.toLowerCase() === selectedSubjectTab.toLowerCase();
      const matchGrade = selectedGrade === 'all' || m.grade.toString() === selectedGrade;
      const matchType = selectedType === 'all' || m.type === selectedType;
      const matchQuery =
        !searchQuery.trim() ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.content && m.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.tags && m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchSubject && matchGrade && matchType && matchQuery;
    });
  }, [materials, selectedSubjectTab, selectedGrade, selectedType, searchQuery]);

  // Material counts per subject
  const subjectCounts = useMemo(() => {
    const counts: Record<string, number> = { all: materials.length };
    materials.forEach(m => {
      const s = m.subject.toLowerCase();
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [materials]);

  // Handlers
  const handleAddQuestionField = () => {
    setFormQuestions(prev => [
      ...prev,
      { question: '', options: ['', '', '', ''], answer: '', explanation: '' }
    ]);
  };

  const handleUpdateQuestion = (index: number, field: keyof MaterialQuestion, value: any) => {
    setFormQuestions(prev =>
      prev.map((q, idx) => (idx === index ? { ...q, [field]: value } : q))
    );
  };

  const handleUpdateOption = (qIndex: number, optIndex: number, value: string) => {
    setFormQuestions(prev =>
      prev.map((q, idx) => {
        if (idx !== qIndex) return q;
        const newOpts = [...(q.options || ['', '', '', ''])];
        newOpts[optIndex] = value;
        return { ...q, options: newOpts };
      })
    );
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const validQuestions = formQuestions.filter(q => q.question.trim().length > 0);
    const keyConceptsArray = formKeyConcepts
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    addMaterial({
      title: formTitle.trim(),
      type: formType,
      subject: formSubject,
      grade: Number(formGrade) || 3,
      fileSize: formType === 'video' ? '25.0 MB' : formType === 'pptx' ? '8.5 MB' : '3.2 MB',
      url: formUrl.trim() || '#',
      author: formAuthor.trim() || teacherProfile.name,
      description: formDesc.trim() || `Học liệu số hỗ trợ bài học lớp ${activeClass.name} Trường TH Hoài Nhơn`,
      content: formContent.trim(),
      keyConcepts: keyConceptsArray.length > 0 ? keyConceptsArray : undefined,
      sampleQuestions: validQuestions.length > 0 ? validQuestions : undefined,
      tags: [formSubject, `Khối ${formGrade}`]
    });

    // Reset Form
    setFormTitle('');
    setFormDesc('');
    setFormContent('');
    setFormUrl('');
    setFormKeyConcepts('');
    setFormQuestions([{ question: '', options: ['', '', '', ''], answer: '', explanation: '' }]);
    setIsImportModalOpen(false);
    showToast(`Đã nạp thành công học liệu "${formTitle.trim()}" vào kho!`);
    triggerCelebration();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setUploadedFileSize(sizeInMb);

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pptx' || ext === 'ppt') setUploadedFileType('pptx');
    else if (ext === 'docx' || ext === 'doc') setUploadedFileType('docx');
    else if (ext === 'mp4' || ext === 'avi' || ext === 'mkv') setUploadedFileType('video');
    else if (ext === 'mp3' || ext === 'wav') setUploadedFileType('audio');
    else setUploadedFileType('pdf');
  };

  const handleSaveUploadedFile = () => {
    if (!uploadedFileName) return;

    addMaterial({
      title: uploadedFileName.replace(/\.[^/.]+$/, ''),
      type: uploadedFileType,
      subject: uploadedSubject,
      grade: uploadedGrade,
      fileSize: uploadedFileSize || '4.0 MB',
      url: '#',
      author: teacherProfile.name,
      description: `Học liệu số tải lên từ máy tính cho môn ${uploadedSubject} khối ${uploadedGrade}`,
      content: `Tệp học liệu số: ${uploadedFileName} (${uploadedFileSize}). Đã nạp vào kho học liệu số Trường Tiểu học Hoài Nhơn để phục vụ giảng dạy và bài tập.`,
      tags: [uploadedSubject, `Khối ${uploadedGrade}`, uploadedFileType]
    });

    setUploadedFileName('');
    setUploadedFileSize('');
    setIsImportModalOpen(false);
    showToast(`Đã nạp file "${uploadedFileName}" vào kho học liệu thành công!`);
    triggerCelebration();
  };

  const handleJsonSubmit = () => {
    setJsonError('');
    setJsonSuccess('');
    try {
      const parsed = JSON.parse(jsonInput);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      if (items.length === 0) throw new Error('Dữ liệu rỗng');

      bulkImportMaterials(items);
      setJsonSuccess(`Đã nạp thành công ${items.length} học liệu từ dữ liệu JSON!`);
      showToast(`Đã nạp thành công ${items.length} học liệu vào kho!`);
      setTimeout(() => {
        setIsImportModalOpen(false);
        setJsonInput('');
      }, 1200);
    } catch (err: any) {
      setJsonError(`Lỗi phân tích cú pháp JSON: ${err.message}`);
    }
  };

  const handleImportStandardPackage = (pkgSubject: string) => {
    const today = new Date().toISOString().split('T')[0];
    let packageMaterials: any[] = [];

    if (pkgSubject === 'english') {
      packageMaterials = [
        {
          title: 'Bài giảng Tiếng Anh 3: Unit 2 - My Family (Song ngữ)',
          type: 'pptx',
          subject: 'english',
          grade: 3,
          fileSize: '14.2 MB',
          url: '#',
          author: 'Tổ Ngoại ngữ - Trường TH Hoài Nhơn',
          description: 'Học từ vựng về các thành viên gia đình, mẫu câu "Who is this? - This is my mother."',
          content: 'Từ vựng: grandfather, grandmother, father, mother, brother, sister. Phát âm: âm /m/ trong mother, /b/ trong brother.',
          sampleQuestions: [
            { question: 'Điền từ còn thiếu: "This is my ______ (mẹ)."', options: ['father', 'mother', 'brother', 'sister'], answer: 'mother' }
          ]
        },
        {
          title: 'Phiếu luyện phát âm chuẩn AI: Phonics /i/ và /e/ Tiếng Anh 3',
          type: 'docx',
          subject: 'english',
          grade: 3,
          fileSize: '2.1 MB',
          url: '#',
          author: 'Tổ Ngoại ngữ - Trường TH Hoài Nhơn',
          description: 'Phiếu luyện ngữ âm phân biệt nguyên âm ngắn /i/ trong sit và /e/ trong set.'
        }
      ];
    } else if (pkgSubject === 'math') {
      packageMaterials = [
        {
          title: 'Chuyên đề: Bảng nhân 7, 8, 9 & Vận dụng giải toán thực tế',
          type: 'pptx',
          subject: 'math',
          grade: 3,
          fileSize: '8.4 MB',
          url: '#',
          author: 'Tổ Chuyên môn Khối 3 - TH Hoài Nhơn',
          description: 'Hệ thống bảng cửu chương trực quan kèm câu hỏi vận dụng nhanh cho tiết học khởi động.'
        },
        {
          title: 'Bài giảng: Hình vuông, hình chữ nhật và Chu vi các hình phẳng',
          type: 'pdf',
          subject: 'math',
          grade: 3,
          fileSize: '5.6 MB',
          url: '#',
          author: `Cô ${teacherProfile.fullName || teacherProfile.name} - TH Hoài Nhơn`,
          description: 'Quy tắc tính chu vi: (Dài + Rộng) x 2 đối với hình chữ nhật; Cạnh x 4 đối với hình vuông.'
        }
      ];
    } else if (pkgSubject === 'vietnamese') {
      packageMaterials = [
        {
          title: 'Ngữ liệu đọc hiểu: Bài thơ "Quạt cho bà ngủ" - Tiếng Việt 3',
          type: 'docx',
          subject: 'vietnamese',
          grade: 3,
          fileSize: '2.3 MB',
          url: '#',
          author: `Cô ${teacherProfile.fullName || teacherProfile.name} - TH Hoài Nhơn`,
          description: 'Văn bản bài thơ, câu hỏi đọc hiểu mức độ 1-2-3 và hướng dẫn viết đoạn văn bày tỏ tình cảm.'
        }
      ];
    }

    if (packageMaterials.length > 0) {
      bulkImportMaterials(packageMaterials);
      showToast(`Đã nạp gói học liệu môn ${pkgSubject} (${packageMaterials.length} bài) thành công!`);
      setIsImportModalOpen(false);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(materials, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Kho_Hoc_Lieu_So_TH_Hoai_Nhon_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Đã xuất toàn bộ danh mục học liệu số thành công!');
  };

  const handleCreateAssignment = (mat: LearningMaterial) => {
    createAssignmentFromMaterial(mat);
    showToast(`Đã tạo bài tập cho lớp ${activeClass.name} từ học liệu "${mat.title}"!`);
  };

  const handleAskAIAboutMaterial = (mat: LearningMaterial) => {
    setActiveView('aibuddy');
  };

  return (
    <div className="space-y-6 pb-14 max-w-7xl mx-auto animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-purple-500/30 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-bold border border-purple-400/30">
              <FolderOpen className="w-3.5 h-3.5 text-purple-300" />
              <span>KHO HỌC LIỆU SỐ TIỂU HỌC</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <School className="w-3.5 h-3.5" />
              <span>Trường Tiểu học Hoài Nhơn</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold">
              Lớp {activeClass.name} (Khối {activeClass.grade})
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Thư Viện Bài Giảng Số, Video & Ngân Hàng Câu Hỏi Tương Tác
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 max-w-2xl leading-relaxed">
            Học liệu được liên kết theo từng môn học, tự động đồng bộ vào hệ thống để giáo viên giao bài tập,
            học sinh tự học và Chatbot AI Buddy trích xuất kiến thức giải đáp.
          </p>

          <div className="flex items-center gap-4 pt-1 text-xs text-purple-200 font-medium">
            <span>📚 <strong>{materials.length}</strong> học liệu số</span>
            <span>•</span>
            <span>🎯 <strong>{subjects.length}</strong> môn học liên kết</span>
            <span>•</span>
            <span>🤖 Tích hợp Chatbot AI & Tự động tạo bài tập</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 z-10 shrink-0">
          {currentUser.role === 'teacher' && (
            <button
              onClick={() => {
                setIsImportModalOpen(true);
                setImportTab('manual');
              }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              title="Mở cửa sổ nạp học liệu số mới vào kho"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Nạp Dữ Liệu Vào Kho</span>
            </button>
          )}

          <button
            onClick={handleExportJson}
            className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-1.5"
            title="Tải toàn bộ kho học liệu dưới dạng file JSON"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xuất danh mục</span>
          </button>

          <button
            onClick={() => setActiveView('aibuddy')}
            className="px-3.5 py-2.5 rounded-2xl bg-emerald-600/80 hover:bg-emerald-600 text-white font-semibold text-xs border border-emerald-400/30 transition-all flex items-center gap-1.5"
            title="Mở Chatbot AI Buddy học tập"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Chatbot AI</span>
          </button>
        </div>
      </div>

      {/* Subject Filter Pills (Liên kết theo từng môn học) */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Layers className="w-4 h-4 text-purple-600" />
            <span>LIÊN KẾT THEO MÔN HỌC:</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Hiển thị {filteredMaterials.length} / {materials.length} học liệu
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedSubjectTab('all')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedSubjectTab === 'all'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Tất cả môn</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedSubjectTab === 'all' ? 'bg-purple-800 text-purple-100' : 'bg-slate-200 text-slate-700'}`}>
              {materials.length}
            </span>
          </button>

          {subjects.map(s => {
            const count = subjectCounts[s.id.toLowerCase()] || 0;
            const isSelected = selectedSubjectTab.toLowerCase() === s.id.toLowerCase();
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSubjectTab(s.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                <span>{s.name}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-purple-800 text-purple-100' : 'bg-slate-200 text-slate-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Toolbar */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Grade filter */}
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="font-semibold">Khối:</span>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="all">Tất cả khối lớp</option>
                <option value="1">Khối 1</option>
                <option value="2">Khối 2</option>
                <option value="3">Khối 3</option>
                <option value="4">Khối 4</option>
                <option value="5">Khối 5</option>
              </select>
            </div>

            {/* Type filter */}
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="font-semibold">Định dạng:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="all">Tất cả định dạng</option>
                <option value="pptx">Bài giảng PowerPoint (.pptx)</option>
                <option value="docx">Phiếu bài tập Word (.docx)</option>
                <option value="pdf">Tài liệu PDF (.pdf)</option>
                <option value="video">Video bài giảng (.mp4)</option>
                <option value="audio">Audio nghe phát âm (.mp3)</option>
                <option value="link">Liên kết tài nguyên số (.link)</option>
              </select>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 sm:max-w-xs min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài giảng, từ khóa..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy học liệu nào phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Chưa có tài liệu cho bộ lọc môn học này. Bạn có thể bấm "Nạp dữ liệu vào kho" để thêm tài liệu mới hoặc chọn môn học khác.
          </p>
          {currentUser.role === 'teacher' && (
            <button
              onClick={() => {
                setIsImportModalOpen(true);
                setImportTab('manual');
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm inline-flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Nạp dữ liệu ngay</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map((mat) => {
            const subjectObj = subjects.find(s => s.id.toLowerCase() === mat.subject.toLowerCase());
            const subjectDisplayName = subjectObj ? subjectObj.name : mat.subject;
            const hasQuestions = mat.sampleQuestions && mat.sampleQuestions.length > 0;

            return (
              <div
                key={mat.id}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-purple-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        mat.type === 'pptx'
                          ? 'bg-orange-100 text-orange-700 border border-orange-200'
                          : mat.type === 'docx'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : mat.type === 'pdf'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : mat.type === 'video'
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {mat.type.toUpperCase()} • {mat.fileSize || '3.5 MB'}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                      Khối {mat.grade}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-2 leading-snug">
                      {mat.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {mat.description}
                    </p>
                  </div>

                  {/* Subject & Author Info */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className="font-semibold text-purple-700">
                      Môn: {subjectDisplayName}
                    </span>
                    <span>Cập nhật: {mat.uploadedAt}</span>
                  </div>

                  {/* Badges for questions / content */}
                  {hasQuestions && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{mat.sampleQuestions?.length} câu hỏi bài tập đính kèm</span>
                    </div>
                  )}
                </div>

                {/* Card Actions Toolbar */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* View Details */}
                    <button
                      onClick={() => {
                        setViewingMaterial(mat);
                        setViewerActiveTab('content');
                        setUserAnswers({});
                        setQuizSubmitted(false);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                      title="Mở xem chi tiết học liệu và bài đọc"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem chi tiết</span>
                    </button>

                    {/* Ask Chatbot */}
                    <button
                      onClick={() => handleAskAIAboutMaterial(mat)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-colors"
                      title="Hỏi Chatbot AI Buddy về học liệu này"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Hỏi AI</span>
                    </button>

                    {/* Teacher: Delete */}
                    {currentUser.role === 'teacher' && (
                      <button
                        onClick={() => {
                          if (confirm(`Bạn có chắc muốn xóa học liệu "${mat.title}"?`)) {
                            deleteMaterial(mat.id);
                            showToast('Đã xóa học liệu khỏi kho.');
                          }
                        }}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Xóa học liệu này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Teacher: Create Assignment from Material */}
                  {currentUser.role === 'teacher' && (
                    <button
                      onClick={() => handleCreateAssignment(mat)}
                      className="w-full px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                      title="Tạo bài tập cho học sinh lớp đang chọn từ học liệu này"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Tự động tạo bài tập cho Lớp {activeClass.name}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==================== MODAL 1: NẠP DỮ LIỆU VÀO KHO ==================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">Nạp Dữ Liệu Vào Kho Học Liệu Số</h3>
                  <p className="text-xs text-purple-100">
                    Trường Tiểu học Hoài Nhơn • Tự động kết nối Môn học, Bài tập & AI Chatbot
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-1 overflow-x-auto text-xs font-bold">
              <button
                type="button"
                onClick={() => setImportTab('manual')}
                className={`py-2 px-3.5 rounded-t-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  importTab === 'manual'
                    ? 'bg-white text-purple-700 border-t-2 border-purple-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Nhập & Soạn bài mới</span>
              </button>

              <button
                type="button"
                onClick={() => setImportTab('file')}
                className={`py-2 px-3.5 rounded-t-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  importTab === 'file'
                    ? 'bg-white text-purple-700 border-t-2 border-purple-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>Tải tệp từ máy</span>
              </button>

              <button
                type="button"
                onClick={() => setImportTab('json')}
                className={`py-2 px-3.5 rounded-t-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  importTab === 'json'
                    ? 'bg-white text-purple-700 border-t-2 border-purple-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Nhập tệp JSON/CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setImportTab('packages')}
                className={`py-2 px-3.5 rounded-t-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  importTab === 'packages'
                    ? 'bg-white text-purple-700 border-t-2 border-purple-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gói chuẩn theo môn</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* TAB 1: MANUAL ENTRY */}
              {importTab === 'manual' && (
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Tên tài liệu / Tên bài giảng số <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Ví dụ: Bài giảng Tiếng Anh Unit 3, Phiếu ôn tập Toán cuối tuần..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Môn học liên kết</label>
                      <select
                        value={formSubject}
                        onChange={(e) => setFormSubject(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800"
                      >
                        {subjects.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Khối lớp</label>
                      <select
                        value={formGrade}
                        onChange={(e) => setFormGrade(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800"
                      >
                        <option value={1}>Khối 1</option>
                        <option value={2}>Khối 2</option>
                        <option value={3}>Khối 3</option>
                        <option value={4}>Khối 4</option>
                        <option value={5}>Khối 5</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Định dạng học liệu</label>
                      <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800"
                      >
                        <option value="pptx">PowerPoint (.pptx)</option>
                        <option value="docx">Word (.docx)</option>
                        <option value="pdf">Tài liệu PDF (.pdf)</option>
                        <option value="video">Video bài giảng (.mp4)</option>
                        <option value="audio">Audio phát âm (.mp3)</option>
                        <option value="link">Liên kết Drive / Web (.link)</option>
                        <option value="quiz">Phiếu trắc nghiệm (.quiz)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Tác giả / Nguồn biên soạn</label>
                      <input
                        type="text"
                        value={formAuthor}
                        onChange={(e) => setFormAuthor(e.target.value)}
                        placeholder={`Ví dụ: Cô ${teacherProfile.fullName || teacherProfile.name}...`}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Link URL tài liệu (nếu có)</label>
                      <input
                        type="text"
                        value={formUrl}
                        onChange={(e) => setFormUrl(e.target.value)}
                        placeholder="https://drive.google.com/... hoặc để trống"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Mô tả tóm tắt học liệu</label>
                    <textarea
                      rows={2}
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="Mục tiêu bài học, kỹ năng đạt được..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                    />
                  </div>

                  {/* Core Knowledge Text for Chatbot and Exercises */}
                  <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                    <label className="block text-purple-900 font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-purple-600" />
                        <span>Nội dung cốt lõi & Tóm tắt bài học (Tự động nạp cho Chatbot AI & Bài tập):</span>
                      </span>
                      <span className="text-[10px] text-purple-600 font-normal">Rất khuyến khích điền</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      placeholder="Nhập nội dung bài đọc, quy tắc toán học, từ vựng hoặc công thức... AI Chatbot sẽ đọc và ghi nhớ đoạn văn bản này để giải thích cho học sinh và trích xuất bài tập."
                      className="w-full px-3 py-2 rounded-xl border border-purple-300 bg-white text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-purple-800">Khái niệm cốt lõi:</span>
                      <input
                        type="text"
                        value={formKeyConcepts}
                        onChange={(e) => setFormKeyConcepts(e.target.value)}
                        placeholder="Các từ khóa ngăn cách bởi dấu phẩy, ví dụ: Phép nhân, Hai bước tính, Gấp lên nhiều lần"
                        className="flex-1 px-3 py-1.5 rounded-xl border border-purple-300 bg-white text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Sample Questions Builder */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-800 font-bold flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-emerald-600" />
                        <span>Bộ câu hỏi trắc nghiệm / Bài tập mẫu đính kèm:</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAddQuestionField}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[11px] flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Thêm câu hỏi</span>
                      </button>
                    </div>

                    {formQuestions.map((q, qIdx) => (
                      <div key={qIdx} className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700 text-xs">Câu {qIdx + 1}:</span>
                          {formQuestions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setFormQuestions(prev => prev.filter((_, i) => i !== qIdx))}
                              className="text-rose-500 hover:text-rose-700 text-[10px] font-semibold"
                            >
                              Xóa câu này
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => handleUpdateQuestion(qIdx, 'question', e.target.value)}
                          placeholder="Nhập nội dung câu hỏi..."
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800"
                        />
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {['A', 'B', 'C', 'D'].map((label, optIdx) => (
                            <div key={label} className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-500 text-[11px] w-4">{label}:</span>
                              <input
                                type="text"
                                value={q.options?.[optIdx] || ''}
                                onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                                placeholder={`Phương án ${label}`}
                                className="flex-1 px-2.5 py-1 rounded-lg border border-slate-200 text-xs"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <input
                            type="text"
                            value={q.answer}
                            onChange={(e) => handleUpdateQuestion(qIdx, 'answer', e.target.value)}
                            placeholder="Đáp án đúng (chính xác phương án)"
                            className="px-2.5 py-1 rounded-lg border border-emerald-300 bg-emerald-50 text-xs text-emerald-900 font-semibold"
                          />
                          <input
                            type="text"
                            value={q.explanation}
                            onChange={(e) => handleUpdateQuestion(qIdx, 'explanation', e.target.value)}
                            placeholder="Giải thích ngắn gọn lý do..."
                            className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsImportModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/25 flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Lưu & Nạp Vào Kho Học Liệu</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: FILE UPLOAD */}
              {importTab === 'file' && (
                <div className="space-y-4">
                  <div className="p-8 rounded-3xl border-2 border-dashed border-purple-300 bg-purple-50/50 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                      <FileUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Kéo thả tệp hoặc bấm để chọn tệp học liệu</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Hỗ trợ định dạng: PowerPoint (.pptx, .ppt), Word (.docx, .doc), PDF (.pdf), Video (.mp4), Audio (.mp3)
                      </p>
                    </div>
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-sm transition-all">
                      <span>Chọn tệp từ máy tính</span>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.pptx,.ppt,.docx,.doc,.mp4,.mp3"
                        className="hidden"
                      />
                    </label>
                  </div>

                  {uploadedFileName && (
                    <div className="p-4 rounded-2xl bg-white border border-purple-200 shadow-sm space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold text-slate-800">{uploadedFileName}</span>
                          <span className="text-[11px] text-slate-500">({uploadedFileSize})</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 uppercase">
                          {uploadedFileType}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Môn học liên kết:</label>
                          <select
                            value={uploadedSubject}
                            onChange={(e) => setUploadedSubject(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-semibold text-slate-800"
                          >
                            {subjects.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Khối lớp:</label>
                          <select
                            value={uploadedGrade}
                            onChange={(e) => setUploadedGrade(Number(e.target.value))}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-semibold text-slate-800"
                          >
                            <option value={1}>Khối 1</option>
                            <option value={2}>Khối 2</option>
                            <option value={3}>Khối 3</option>
                            <option value={4}>Khối 4</option>
                            <option value={5}>Khối 5</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={handleSaveUploadedFile}
                          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/25 flex items-center gap-1.5"
                        >
                          <UploadCloud className="w-4 h-4" />
                          <span>Nạp tệp này vào kho</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: JSON IMPORT */}
              {importTab === 'json' && (
                <div className="space-y-3">
                  <p className="text-slate-600">
                    Dán cấu trúc JSON danh mục học liệu số để nạp đồng loạt nhiều bài giảng, video và câu hỏi trắc nghiệm:
                  </p>
                  <textarea
                    rows={8}
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='[&#10;  {&#10;    "title": "Bài giảng Toán 3: Phép trừ có nhớ",&#10;    "type": "pptx",&#10;    "subject": "math",&#10;    "grade": 3,&#10;    "description": "Bài giảng phép trừ có nhớ trong phạm vi 10.000"&#10;  }&#10;]'
                    className="w-full p-3 font-mono text-[11px] rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />

                  {jsonError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                      {jsonError}
                    </div>
                  )}
                  {jsonSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                      {jsonSuccess}
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const sample = [
                          {
                            title: 'Bài giảng Tiếng Anh 3: Unit 3 - Our Friends',
                            type: 'pptx',
                            subject: 'english',
                            grade: 3,
                            author: `Cô ${teacherProfile.fullName || teacherProfile.name}`,
                            description: 'Giới thiệu các bạn trong lớp và mẫu câu hỏi tuổi.',
                            content: 'Cấu trúc: How old are you? - I am eight years old.'
                          }
                        ];
                        setJsonInput(JSON.stringify(sample, null, 2));
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                    >
                      Dán mẫu JSON
                    </button>
                    <button
                      type="button"
                      onClick={handleJsonSubmit}
                      disabled={!jsonInput.trim()}
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold shadow-md"
                    >
                      Nạp hàng loạt vào kho
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: PACKAGES */}
              {importTab === 'packages' && (
                <div className="space-y-3">
                  <p className="text-slate-600">
                    Bấm 1-click để nạp ngay các gói học liệu chuẩn theo chương trình Tiểu học Hoài Nhơn:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/50 space-y-2">
                      <div className="font-bold text-indigo-900 text-sm">Gói Tiếng Anh 3</div>
                      <p className="text-[11px] text-slate-600">
                        Bài giảng Unit 2 Family + Phiếu luyện phát âm chuẩn AI.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleImportStandardPackage('english')}
                        className="w-full py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors"
                      >
                        Nạp gói Tiếng Anh
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                      <div className="font-bold text-emerald-900 text-sm">Gói Toán 3</div>
                      <p className="text-[11px] text-slate-600">
                        Chuyên đề Bảng nhân 7, 8, 9 + Bài giảng Chu vi hình phẳng.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleImportStandardPackage('math')}
                        className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                      >
                        Nạp gói Toán học
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50 space-y-2">
                      <div className="font-bold text-rose-900 text-sm">Gói Tiếng Việt 3</div>
                      <p className="text-[11px] text-slate-600">
                        Ngữ liệu đọc hiểu bài thơ Quạt cho bà ngủ + Câu hỏi đọc hiểu.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleImportStandardPackage('vietnamese')}
                        className="w-full py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors"
                      >
                        Nạp gói Tiếng Việt
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 2: XEM CHI TIẾT HỌC LIỆU ==================== */}
      {viewingMaterial && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-purple-800 to-indigo-800 text-white flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 uppercase tracking-wider">
                    {viewingMaterial.type.toUpperCase()}
                  </span>
                  <span className="text-xs text-purple-200">
                    Khối {viewingMaterial.grade} • {viewingMaterial.uploadedAt}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold leading-snug">{viewingMaterial.title}</h3>
              </div>
              <button
                onClick={() => setViewingMaterial(null)}
                className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewer Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewerActiveTab('content')}
                className={`py-2 px-3.5 rounded-t-xl transition-colors flex items-center gap-1.5 ${
                  viewerActiveTab === 'content'
                    ? 'bg-white text-purple-700 border-t-2 border-purple-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Nội dung bài học</span>
              </button>

              {viewingMaterial.sampleQuestions && viewingMaterial.sampleQuestions.length > 0 && (
                <button
                  type="button"
                  onClick={() => setViewerActiveTab('quiz')}
                  className={`py-2 px-3.5 rounded-t-xl transition-colors flex items-center gap-1.5 ${
                    viewerActiveTab === 'quiz'
                      ? 'bg-white text-purple-700 border-t-2 border-purple-600 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Luyện tập trắc nghiệm ({viewingMaterial.sampleQuestions.length})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setViewerActiveTab('info')}
                className={`py-2 px-3.5 rounded-t-xl transition-colors flex items-center gap-1.5 ${
                  viewerActiveTab === 'info'
                    ? 'bg-white text-purple-700 border-t-2 border-purple-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <School className="w-3.5 h-3.5" />
                <span>Thông tin & Tác giả</span>
              </button>
            </div>

            {/* Viewer Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* TAB 1: CONTENT */}
              {viewerActiveTab === 'content' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 text-slate-700 text-xs leading-relaxed">
                    <strong className="text-purple-900 block mb-1">Mô tả bài học:</strong>
                    {viewingMaterial.description}
                  </div>

                  {viewingMaterial.content ? (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 space-y-2">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                        <BookOpen className="w-4 h-4 text-purple-600" />
                        <span>Nội dung kiến thức cốt lõi:</span>
                      </div>
                      <div className="whitespace-pre-line text-xs leading-relaxed font-sans text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                        {viewingMaterial.content}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-50 text-slate-500 italic text-center">
                      Tệp học liệu số sẵn sàng tải về hoặc mở trình chiếu trên lớp.
                    </div>
                  )}

                  {viewingMaterial.keyConcepts && viewingMaterial.keyConcepts.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="font-bold text-slate-700 text-xs">Từ khóa / Khái niệm cốt lõi:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {viewingMaterial.keyConcepts.map((k, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-semibold"
                          >
                            #{k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: INTERACTIVE PRACTICE QUIZ */}
              {viewerActiveTab === 'quiz' && viewingMaterial.sampleQuestions && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center justify-between">
                    <span>Luyện tập củng cố kiến thức theo bài học:</span>
                    <span className="text-[11px]">Tổng số: {viewingMaterial.sampleQuestions.length} câu</span>
                  </div>

                  {viewingMaterial.sampleQuestions.map((q, qIdx) => {
                    const selected = userAnswers[qIdx];
                    const isCorrect = selected && selected === q.answer;

                    return (
                      <div key={qIdx} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                        <div className="font-bold text-slate-900 text-xs flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 text-[11px]">
                            {qIdx + 1}
                          </span>
                          <span>{q.question}</span>
                        </div>

                        {q.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                            {q.options.map((opt, oIdx) => {
                              const isThisSelected = selected === opt;
                              let btnClass = 'bg-slate-50 hover:bg-purple-50 text-slate-700 border-slate-200';

                              if (quizSubmitted) {
                                if (opt === q.answer) {
                                  btnClass = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
                                } else if (isThisSelected && opt !== q.answer) {
                                  btnClass = 'bg-rose-100 text-rose-900 border-rose-300';
                                }
                              } else if (isThisSelected) {
                                btnClass = 'bg-purple-600 text-white border-purple-700 font-bold';
                              }

                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => setUserAnswers(prev => ({ ...prev, [qIdx]: opt }))}
                                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${btnClass}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {quizSubmitted && q.explanation && (
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                            <strong>Lời giải thích:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUserAnswers({});
                        setQuizSubmitted(false);
                      }}
                      className="text-slate-500 hover:text-slate-700 text-xs font-semibold"
                    >
                      Làm lại từ đầu
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setQuizSubmitted(true);
                        triggerCelebration();
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                    >
                      Kiểm tra kết quả
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: INFO */}
              {viewerActiveTab === 'info' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Tác giả / Biên tập:</span>
                      <strong className="text-slate-800 text-xs">{viewingMaterial.author || 'Tổ Chuyên môn'}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Trường học:</span>
                      <strong className="text-slate-800 text-xs">Trường Tiểu học Hoài Nhơn</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Dung lượng tệp:</span>
                      <strong className="text-slate-800 text-xs">{viewingMaterial.fileSize || '3.5 MB'}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Lượt tương tác:</span>
                      <strong className="text-slate-800 text-xs">{viewingMaterial.viewCount || 100} lượt</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Viewer Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    alert(`Đang mở học liệu "${viewingMaterial.title}" để trình chiếu / tải về máy.`);
                    triggerCelebration();
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải về / Trình chiếu</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setViewingMaterial(null);
                    setActiveView('aibuddy');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-300 flex items-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hỏi Chatbot AI</span>
                </button>
              </div>

              {currentUser.role === 'teacher' && (
                <button
                  type="button"
                  onClick={() => {
                    handleCreateAssignment(viewingMaterial);
                    setViewingMaterial(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Tạo bài tập cho lớp</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
