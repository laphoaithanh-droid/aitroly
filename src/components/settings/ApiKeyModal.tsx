import React, { useState, useEffect } from 'react';
import { Key, Sparkles, Check, ExternalLink, X, Shield, Cpu, RefreshCw } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (key: string, model: string) => void;
}

const AVAILABLE_MODELS = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash (Khuyên dùng)',
    tag: 'Mặc định - Chuẩn xác & Phản hồi nhanh',
    description: 'Phiên bản mới tối ưu hóa phản hồi siêu nhanh cho lớp học, phù hợp trợ lý học tập AI Buddy.',
    recommended: true
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    tag: 'Tư duy sư phạm chuyên sâu',
    description: 'Thích hợp soạn kế hoạch bài dạy chuyên sâu, phân tích năng lực học sinh đa chiều.',
    recommended: false
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    tag: 'Dự phòng siêu ổn định',
    description: 'Model dự phòng ổn định, phản hồi nhẹ và tiết kiệm quota tối đa.',
    recommended: false
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    tag: 'Tối ưu tốc độ thời gian thực',
    description: 'Thế hệ mô hình cân bằng tốc độ và khả năng suy luận logic sư phạm.',
    recommended: false
  }
];

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key') || '';
    let savedModel = localStorage.getItem('gemini_selected_model') || 'gemini-2.5-flash';
    if (savedModel.includes('gemini-3')) {
      savedModel = 'gemini-2.5-flash';
      localStorage.setItem('gemini_selected_model', 'gemini-2.5-flash');
    }
    setApiKey(savedKey);
    setSelectedModel(savedModel);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!apiKey.trim()) {
      localStorage.removeItem('gemini_api_key');
      localStorage.setItem('gemini_selected_model', selectedModel);
      if (onSave) onSave('', selectedModel);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 800);
      return;
    }
    localStorage.setItem('gemini_api_key', apiKey.trim());
    localStorage.setItem('gemini_selected_model', selectedModel);
    if (onSave) onSave(apiKey.trim(), selectedModel);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleUseWithoutKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    if (onSave) onSave('', selectedModel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Thiết lập Model AI & Gemini API Key (Tùy chọn)</h2>
              <p className="text-xs text-purple-200">
                Ứng dụng vào trực tiếp và sử dụng được ngay. Chỉ nhập API Key nếu muốn kết nối hạn mức riêng.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Guide banner */}
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-start justify-between gap-3">
            <div>
              <div className="font-bold text-purple-950 mb-0.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Vào trực tiếp app – Không bắt buộc phải có API Key:</span>
              </div>
              <p className="text-purple-800 leading-relaxed">
                Hệ thống đã tích hợp sẵn kho dữ liệu sư phạm chuẩn Thông tư 27 & Công văn 2345. Nếu Thầy/Cô có API Key cá nhân từ Google AI Studio, có thể dán vào đây để mở rộng hạn mức tạo bài tự do.
              </p>
            </div>
            <a
              href="https://aistudio.google.com/api-keys"
              target="_blank"
              rel="noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-xs"
            >
              <span>Lấy API Key</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* API Key Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Google Gemini API Key <span className="text-slate-400 font-normal">(Không bắt buộc)</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy... (Bỏ trống nếu dùng chế độ có sẵn)"
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 focus:bg-white"
              />
              <Key className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              API key được lưu an toàn trong trình duyệt của bạn (localStorage), không chia sẻ ra ngoài.
            </p>
          </div>

          {/* Model selection cards */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Chọn Model AI Vận Hành
            </label>
            <div className="space-y-2.5">
              {AVAILABLE_MODELS.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    selectedModel === m.id
                      ? 'border-purple-600 bg-purple-50/70 shadow-xs ring-2 ring-purple-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    selectedModel === m.id ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-slate-900">{m.name}</div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                        {m.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Hệ thống tự động chuyển sang model dự phòng nếu vượt hạn mức</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleUseWithoutKey}
              className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
            >
              Vào app trực tiếp (Không cần key)
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  Đã cập nhật!
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Lưu thiết lập
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
