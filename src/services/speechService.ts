/**
 * Dịch vụ Text-to-Speech (Chuyển văn bản thành giọng đọc AI)
 * Quy tắc chuẩn:
 * 1. CHỈ phát âm Tiếng Anh (en-US) cho phân môn Tiếng Anh (EnglishWorld, từ vựng tiếng Anh).
 * 2. TẤT CẢ các phân môn và nội dung còn lại (Toán, Tiếng Việt, Tin học, Khoa học, AI Buddy, Lịch sử...)
 *    BẮT BUỘC đọc bằng Tiếng Việt (vi-VN) chuẩn giọng truyền cảm, tròn vành rõ chữ cho học sinh tiểu học.
 */

class SpeechService {
  private isSupported: boolean;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    if (this.isSupported) {
      this.loadVoices();
      if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices(): void {
    if (!this.isSupported) return;
    try {
      this.voices = window.speechSynthesis.getVoices() || [];
    } catch {
      this.voices = [];
    }
  }

  /**
   * Tìm giọng Tiếng Việt tự nhiên và chuẩn nhất trên hệ thống
   */
  private getBestVietnameseVoice(): SpeechSynthesisVoice | null {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }

    const viVoices = this.voices.filter((v) => {
      const lang = (v.lang || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      return (
        lang.startsWith('vi') ||
        lang.includes('vie') ||
        name.includes('vietnam') ||
        name.includes('tiếng việt') ||
        name.includes('hoaimy') ||
        name.includes('namminh')
      );
    });

    if (viVoices.length === 0) return null;

    // Ưu tiên 1: Microsoft Natural Voices (Hoài My, Nam Minh trên Edge/Windows 10/11)
    const naturalVi = viVoices.find(
      (v) =>
        v.name.includes('Natural') ||
        v.name.includes('Online') ||
        v.name.includes('HoaiMy') ||
        v.name.includes('NamMinh')
    );
    if (naturalVi) return naturalVi;

    // Ưu tiên 2: Google Tiếng Việt (trên Chrome/Android)
    const googleVi = viVoices.find((v) => v.name.includes('Google') || v.name.includes('Tiếng Việt'));
    if (googleVi) return googleVi;

    // Ưu tiên 3: Bất kỳ giọng tiếng Việt nào khả dụng
    return viVoices[0];
  }

  /**
   * Tìm giọng Tiếng Anh chuẩn (chỉ dùng riêng cho phân môn Tiếng Anh)
   */
  private getBestEnglishVoice(): SpeechSynthesisVoice | null {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }

    const enVoices = this.voices.filter((v) => {
      const lang = (v.lang || '').toLowerCase();
      return lang.startsWith('en');
    });

    if (enVoices.length === 0) return null;

    // Ưu tiên giọng US Natural/Google
    const bestEn =
      enVoices.find(
        (v) =>
          (v.lang.includes('en-US') || v.lang === 'en_US') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Jenny') ||
            v.name.includes('Guy') ||
            v.name.includes('Aria') ||
            v.name.includes('Samantha'))
      ) ||
      enVoices.find((v) => v.lang.includes('en-US')) ||
      enVoices[0];

    return bestEn;
  }

  /**
   * Làm sạch văn bản trước khi đọc (bỏ markdown, icon, emoji, đường link, ký tự đặc biệt)
   */
  private cleanTextForSpeech(rawText: string): string {
    if (!rawText) return '';
    return rawText
      // Bỏ code block
      .replace(/```[\s\S]*?```/g, ' ')
      // Bỏ đường link URL
      .replace(/https?:\/\/\S+/g, ' ')
      // Bỏ ký tự markdown định dạng
      .replace(/[*#_~`>[\]()]/g, ' ')
      // Bỏ đường viền trang trí dạng ━━━━━━━━
      .replace(/[━─═-]{3,}/g, ' ')
      // Bỏ các ký hiệu icon emoji để tránh đọc thành "mặt cười", "ngôi sao"...
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ' ')
      // Chuẩn hóa khoảng trắng
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Tách đoạn văn bản dài thành các câu nhỏ để tránh lỗi trình duyệt Chrome/Edge bị dừng giữa chừng
   */
  private splitIntoSentences(text: string): string[] {
    const cleaned = this.cleanTextForSpeech(text);
    if (!cleaned) return [];
    if (cleaned.length < 160) return [cleaned];

    // Tách theo dấu chấm, dấu hỏi, chấm than hoặc xuống dòng
    const rawSentences = cleaned.match(/[^.!?\n]+[.!?\n]*/g) || [cleaned];
    const result: string[] = [];
    let currentChunk = '';

    for (const s of rawSentences) {
      const trimmed = s.trim();
      if (!trimmed) continue;
      if (currentChunk.length + trimmed.length < 150) {
        currentChunk = currentChunk ? `${currentChunk} ${trimmed}` : trimmed;
      } else {
        if (currentChunk) result.push(currentChunk);
        currentChunk = trimmed;
      }
    }
    if (currentChunk) result.push(currentChunk);
    return result;
  }

  /**
   * Phát âm văn bản
   * @param text Văn bản cần đọc
   * @param lang Ngôn ngữ: MẶC ĐỊNH LÀ 'vi-VN' (chỉ 'en-US' khi gọi từ phân môn Tiếng Anh)
   * @param rate Tốc độ đọc (0.9 cho tiếng Việt, 0.85 cho tiếng Anh học sinh lớp 3)
   * @param onEnd Callback sau khi hoàn thành
   */
  public speak(
    text: string,
    lang: 'vi-VN' | 'en-US' = 'vi-VN',
    rate?: number,
    onEnd?: () => void
  ) {
    if (!this.isSupported) {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.stop();

      // Quy tắc bảo đảm: Chỉ chấp nhận en-US khi thật sự là Tiếng Anh, còn lại luôn là vi-VN
      const isEnglish = lang === 'en-US';
      const targetLang = isEnglish ? 'en-US' : 'vi-VN';
      const targetRate = rate ?? (isEnglish ? 0.85 : 0.9);

      const sentences = this.splitIntoSentences(text);
      if (sentences.length === 0) {
        if (onEnd) onEnd();
        return;
      }

      // Chọn giọng đọc tối ưu
      const preferredVoice = isEnglish ? this.getBestEnglishVoice() : this.getBestVietnameseVoice();

      let currentIndex = 0;

      const speakNextChunk = () => {
        if (currentIndex >= sentences.length) {
          this.currentUtterance = null;
          if (onEnd) onEnd();
          return;
        }

        const chunkText = sentences[currentIndex];
        currentIndex++;

        const utterance = new SpeechSynthesisUtterance(chunkText);
        utterance.lang = targetLang;
        utterance.rate = targetRate;
        utterance.pitch = 1.0;

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onend = () => {
          speakNextChunk();
        };

        utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
          if (e.error === 'interrupted' || e.error === 'canceled') {
            return;
          }
          console.warn('[SpeechService] Thông báo phát âm:', e.error);
          speakNextChunk();
        };

        this.currentUtterance = utterance;
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.speak(utterance);
      };

      speakNextChunk();
    } catch (err) {
      console.error('[SpeechService] Lỗi phát âm:', err);
      if (onEnd) onEnd();
    }
  }

  /**
   * Phát âm dựa theo phân môn môn học:
   * - Phân môn 'english' -> Đọc tiếng Anh chuẩn (en-US, rate 0.85).
   * - Tất cả phân môn khác ('vietnamese', 'math', 'informatics', 'science', 'general'...) -> Đọc tiếng Việt (vi-VN, rate 0.9).
   */
  public speakSubject(
    text: string,
    subject: string = 'general',
    onEnd?: () => void
  ) {
    const isEnglishSubject = subject.toLowerCase() === 'english';
    this.speak(text, isEnglishSubject ? 'en-US' : 'vi-VN', isEnglishSubject ? 0.85 : 0.9, onEnd);
  }

  /**
   * Dừng giọng đọc ngay lập tức
   */
  public stop() {
    if (this.isSupported) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
      this.currentUtterance = null;
    }
  }
}

export const speechService = new SpeechService();
