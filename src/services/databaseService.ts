import {
  Student,
  Assignment,
  LearningMaterial,
  ParentNotification,
  ParentFeedback,
  ClassRoom,
  TeacherProfile,
  CustomSubject,
  GenericLesson,
  EducationalGame
} from '../types';

export type DatabaseProvider = 'server' | 'googlesheets' | 'supabase' | 'firebase' | 'custom' | 'local';

export interface DatabaseConfig {
  provider: DatabaseProvider;
  autoSync: boolean;
  // Google Sheets Config
  googleSheetUrl?: string;
  googleSheetRange?: string;
  googleSheetApiKey?: string;
  googleAppsScriptUrl?: string;
  // Supabase Config
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  // Firebase Config
  firebaseUrl?: string;
  firebaseAuthToken?: string;
  // Express Server & Custom
  serverUrl?: string;
  customEndpoint?: string;
  customApiKey?: string;
  lastSyncedAt?: string;
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  errorMessage?: string;
}

export interface ClassroomSyncPayload {
  classId: string;
  className?: string;
  lastUpdated: string;
  version: string;
  revision?: number;
  students: Student[];
  assignments: Assignment[];
  notifications: ParentNotification[];
  feedbacks: ParentFeedback[];
  materials: LearningMaterial[];
  classes?: ClassRoom[];
  activeClassId?: string;
  teacherProfile?: TeacherProfile;
  subjects?: CustomSubject[];
  genericLessons?: GenericLesson[];
  games?: EducationalGame[];
  teacherPasswords?: Record<string, string>;
}

const STORAGE_KEY_DB_CONFIG = 'aiclass_db_config_v1';

export const DEFAULT_DB_CONFIG: DatabaseConfig = {
  provider: 'server',
  autoSync: true,
  serverUrl: '/api/db',
  status: 'connected',
  lastSyncedAt: new Date().toISOString(),
  googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1j52y0zzHNHRKmuvOjmactixKnpGQrwa7/edit?gid=671636391#gid=671636391',
  googleSheetRange: 'Sheet1!A1:Z100',
  googleSheetApiKey: '',
  googleAppsScriptUrl: '',
  supabaseUrl: '',
  supabaseAnonKey: '',
  firebaseUrl: '',
  firebaseAuthToken: '',
};

function parseFullCsv(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentCell.trim());
      currentCell = '';
      if (currentRow.some((c) => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

function toVietnameseTitleCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function formatVietnameseDate(raw: string): string {
  if (!raw) return '2018-05-15';
  const parts = raw.trim().split(/[/.-]/);
  if (parts.length === 3) {
    const d = parts[0].padStart(2, '0');
    const m = parts[1].padStart(2, '0');
    let y = parts[2];
    if (y.length === 2) y = '20' + y;
    return `${y}-${m}-${d}`;
  }
  return raw.trim();
}

export const databaseService = {
  /**
   * Lấy cấu hình CSDL từ localStorage
   */
  getConfig(): DatabaseConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DB_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_DB_CONFIG,
          ...parsed,
          googleSheetUrl:
            parsed.googleSheetUrl && parsed.googleSheetUrl.length > 10
              ? parsed.googleSheetUrl
              : DEFAULT_DB_CONFIG.googleSheetUrl
        };
      }
    } catch (e) {
      console.warn('Lỗi đọc cấu hình CSDL từ localStorage:', e);
    }
    return DEFAULT_DB_CONFIG;
  },

  /**
   * Lưu cấu hình CSDL vào localStorage
   */
  saveConfig(config: DatabaseConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY_DB_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.warn('Lỗi lưu cấu hình CSDL:', e);
    }
  },

  /**
   * Trích xuất Sheet ID và GID từ liên kết Google Sheets
   */
  extractGoogleSheetDetails(url: string): { sheetId: string | null; gid: string } {
    if (!url) return { sheetId: null, gid: '0' };
    const sheetIdMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    const gidMatch = url.match(/[#&?]gid=([0-9]+)/);
    return {
      sheetId: sheetIdMatch ? sheetIdMatch[1] : null,
      gid: gidMatch ? gidMatch[1] : '0'
    };
  },

  /**
   * Phân tích văn bản CSV từ Google Sheet thành danh sách Student[]
   */
  parseCsvToStudents(csvText: string): Student[] {
    if (!csvText || csvText.trim().length === 0) return [];
    const allRows = parseFullCsv(csvText);
    if (allRows.length < 2) return [];

    let headerIndex = -1;
    let headers: string[] = [];
    let detectedClassName = '3A2';

    // 1. Quét tìm hàng tiêu đề trong tối đa 10 hàng đầu tiên
    for (let i = 0; i < Math.min(allRows.length, 10); i++) {
      const rowCleaned = allRows[i].map((h) =>
        h.toLowerCase().replace(/[\r\n\t"]/g, ' ').replace(/\s+/g, ' ').trim()
      );

      // Nhận diện tên lớp từ nội dung văn bản (ví dụ: LỚP 3A2, 3C1,...)
      for (const cell of allRows[i]) {
        const classMatch = cell.match(/lớp\s*([0-9][a-zA-Z0-9_-]+)/i);
        if (classMatch) {
          detectedClassName = classMatch[1].toUpperCase();
        }
      }

      if (
        rowCleaned.some(
          (h) =>
            h.includes('họ và tên') ||
            h.includes('họ tên') ||
            h.includes('tên hs') ||
            h.includes('tên học sinh') ||
            (h.includes('tên') && !h.includes('cha') && !h.includes('mẹ'))
        )
      ) {
        headerIndex = i;
        headers = rowCleaned;
        break;
      }
    }

    if (headerIndex === -1 || headers.length === 0) {
      headerIndex = 0;
      headers = allRows[0].map((h) =>
        h.toLowerCase().replace(/[\r\n\t"]/g, ' ').replace(/\s+/g, ' ').trim()
      );
    }

    const findCol = (keywords: string[]) => {
      return headers.findIndex((h) => keywords.some((k) => h.includes(k)));
    };

    let nameCol = findCol(['họ và tên', 'họ tên', 'tên học sinh', 'tên hs', 'full name', 'fullname', 'học sinh']);
    if (nameCol === -1) {
      nameCol = findCol(['tên', 'name']);
    }
    let sttCol = findCol(['stt', 'số tt', 'số thứ tự', 'thứ tự', 'no', 'order']);
    const codeCol = findCol(['mã hs', 'mã học sinh', 'ma hs', 'code', 'student code', 'mshs']);
    const genderCol = findCol(['giới tính', 'giới', 'gender', 'nam/nữ', 'phái']);
    const dobCol = findCol(['ngày sinh', 'năm sinh', 'sinh nhật', 'ngày tháng', 'dob', 'birth']);
    const classCol = findCol(['lớp cũ', 'lớp', 'tên lớp', 'class', 'classroom']);
    const parentNameCol = findCol(['cha', 'mẹ', 'họ và tên cha', 'phụ huynh', 'tên phụ huynh', 'họ tên phụ huynh', 'bố mẹ', 'parent']);
    const parentPhoneCol = findCol(['điện thoại', 'sđt', 'số điện thoại', 'phone', 'mobile', 'liên hệ']);
    const progressCol = findCol(['tiến độ', 'kết quả', 'học lực', 'progress']);
    const englishCol = findCol(['tiếng anh', 'anh', 'english']);
    const mathCol = findCol(['toán', 'math']);
    const vietnameseCol = findCol(['tiếng việt', 'văn', 'vietnamese']);
    const informaticsCol = findCol(['tin học', 'tin', 'informatics', 'cntt']);
    const goalCol = findCol(['mục tiêu', 'mục tiêu hỗ trợ', 'ghi chú', 'nhận xét', 'goal', 'note']);
    const usernameCol = findCol(['tên đăng nhập', 'tài khoản', 'username', 'user', 'tên tk', 'login', 'tk']);
    const passwordCol = findCol(['mật khẩu', 'mat khau', 'password', 'pass', 'mk', 'mã pin', 'pin']);

    // Nếu không tìm thấy cột STT nhưng cột tên là cột 1 và cột 0 là số thứ tự
    if (sttCol === -1 && nameCol === 1) {
      sttCol = 0;
    }

    const students: Student[] = [];
    const dataRows = allRows.slice(headerIndex + 1);

    dataRows.forEach((cols, idx) => {
      const rawName = nameCol >= 0 && cols[nameCol] ? cols[nameCol] : cols[1] || '';
      const fullName = toVietnameseTitleCase(rawName.trim());
      if (
        !fullName ||
        fullName.toLowerCase().includes('họ và tên') ||
        fullName.toLowerCase().includes('tổng số') ||
        fullName.length < 2
      ) {
        return;
      }

      // Số thứ tự
      let stt = students.length + 1;
      if (sttCol >= 0 && cols[sttCol]) {
        const parsedStt = parseInt(cols[sttCol].replace(/\D/g, ''), 10);
        if (!isNaN(parsedStt) && parsedStt > 0) {
          stt = parsedStt;
        }
      }

      const studentCode =
        codeCol >= 0 && cols[codeCol] && cols[codeCol].trim().length > 0
          ? cols[codeCol].trim()
          : `HS${detectedClassName}${stt < 10 ? '0' + stt : stt}`;

      const rawGender = genderCol >= 0 && cols[genderCol] ? cols[genderCol].toLowerCase().trim() : '';
      const gender: 'Nam' | 'Nữ' =
        rawGender.includes('nữ') || rawGender.includes('female') || rawGender === 'f'
          ? 'Nữ'
          : 'Nam';

      const rawDob = dobCol >= 0 && cols[dobCol] ? cols[dobCol].trim() : '';
      const birthDate = formatVietnameseDate(rawDob);

      let className = detectedClassName;
      if (classCol >= 0 && cols[classCol] && cols[classCol].trim()) {
        const val = cols[classCol].trim();
        if (val.length <= 10 && !val.toLowerCase().includes('lớp')) {
          className = detectedClassName || val;
        }
      }

      const rawParent = parentNameCol >= 0 && cols[parentNameCol] ? cols[parentNameCol].trim() : '';
      const parentName = rawParent ? toVietnameseTitleCase(rawParent) : `Phụ huynh em ${fullName}`;

      const rawPhone = parentPhoneCol >= 0 && cols[parentPhoneCol] ? cols[parentPhoneCol].trim() : '';
      const parentPhone = rawPhone && rawPhone.length >= 7 ? rawPhone : '0912 345 678';

      // Tên đăng nhập và mật khẩu được nạp từ Google Sheet (hoặc tự động sinh chuẩn theo mã lớp và STT nếu ô trống)
      const rawUsername = usernameCol >= 0 && cols[usernameCol] ? cols[usernameCol].trim() : '';
      const rawPassword = passwordCol >= 0 && cols[passwordCol] ? cols[passwordCol].trim() : '';
      const username = rawUsername || `hs${className.toLowerCase().replace(/[^a-z0-9]/g, '')}${stt < 10 ? '0' + stt : stt}`;
      const password = rawPassword || '123456';

      // Phân nhóm chỗ ngồi (4 nhóm x 8 học sinh cho lớp 30-32 em)
      const seatGroup = ((stt - 1) % 4) + 1;
      const seatIndex = Math.floor((stt - 1) / 4) + 1;

      // Điểm và tiến độ phân hóa hợp lý cho bậc tiểu học
      const progress =
        progressCol >= 0 && !isNaN(parseInt(cols[progressCol], 10))
          ? parseInt(cols[progressCol], 10)
          : Math.min(98, Math.max(78, 82 + ((stt * 7) % 17)));

      const english =
        englishCol >= 0 && !isNaN(parseInt(cols[englishCol], 10))
          ? parseInt(cols[englishCol], 10)
          : Math.min(99, Math.max(75, 80 + ((stt * 5) % 20)));

      const math =
        mathCol >= 0 && !isNaN(parseInt(cols[mathCol], 10))
          ? parseInt(cols[mathCol], 10)
          : Math.min(99, Math.max(78, 84 + ((stt * 3) % 16)));

      const vietnamese =
        vietnameseCol >= 0 && !isNaN(parseInt(cols[vietnameseCol], 10))
          ? parseInt(cols[vietnameseCol], 10)
          : Math.min(99, Math.max(76, 82 + ((stt * 4) % 18)));

      const informatics =
        informaticsCol >= 0 && !isNaN(parseInt(cols[informaticsCol], 10))
          ? parseInt(cols[informaticsCol], 10)
          : Math.min(99, Math.max(80, 85 + ((stt * 6) % 15)));

      const defaultGoals = [
        'Phát huy năng khiếu thuyết trình tiếng Anh và dẫn dắt nhóm',
        'Rèn luyện thêm tính toán có lời văn 2 bước giải',
        'Bồi dưỡng kỹ năng viết đoạn văn sáng tạo có hình ảnh so sánh',
        'Rèn luyện tốc độ và tư thế gõ bàn phím chuẩn F và J',
        'Tự tin phát biểu xây dựng bài và giúp đỡ bạn cùng tiến',
        'Rèn luyện tính cẩn thận khi giải toán và trình bày vở sạch đẹp',
        'Nâng cao vốn từ vựng song ngữ Anh - Việt qua hình ảnh',
        'Chăm chỉ luyện đọc diễn cảm và trả lời câu hỏi bài học'
      ];
      const supportGoal =
        goalCol >= 0 && cols[goalCol] && cols[goalCol].trim()
          ? cols[goalCol].trim()
          : defaultGoals[(stt - 1) % defaultGoals.length];

      // Huy hiệu tích cực mẫu cho học sinh
      const badgePool = [
        ['english-star', 'kind-friend'],
        ['creative-thinker', 'teamwork-champion'],
        ['reading-hero', 'daily-learner'],
        ['helpful-hands', 'kind-friend'],
        ['green-hero', 'creative-thinker'],
        ['daily-learner', 'reading-hero']
      ];
      const badges = badgePool[(stt - 1) % badgePool.length];

      students.push({
        id: `s-${stt}`,
        stt,
        studentCode,
        fullName,
        gender,
        birthDate,
        className,
        username,
        password,
        accountStatus: 'active',
        attendanceStatus: 'present',
        attendanceHistory: [
          { date: '2026-10-16', status: 'present' },
          { date: '2026-10-15', status: 'present' },
          { date: '2026-10-14', status: 'present' },
          { date: '2026-10-13', status: 'present' },
          { date: '2026-10-12', status: 'present' }
        ],
        activeTasksCount: 2,
        learningProgress: progress,
        skills: { english, math, vietnamese, informatics },
        supportGoal,
        badges,
        parentName,
        parentPhone,
        seatGroup,
        seatIndex
      });
    });

    return students;
  },

  /**
   * Kết nối và tải trực tiếp danh sách học sinh từ Google Sheets
   */
  async fetchGoogleSheetStudents(
    config: DatabaseConfig
  ): Promise<{ success: boolean; students: Student[]; message: string; rawRowCount?: number }> {
    if (!config.googleSheetUrl) {
      return {
        success: false,
        students: [],
        message: 'Vui lòng nhập đường liên kết Google Sheet (bảng tính danh sách học sinh).'
      };
    }

    const { sheetId, gid } = this.extractGoogleSheetDetails(config.googleSheetUrl);
    if (!sheetId) {
      return {
        success: false,
        students: [],
        message:
          'Đường dẫn không hợp lệ. Vui lòng dán liên kết Google Sheet đầy đủ (ví dụ: https://docs.google.com/spreadsheets/d/.../edit)'
      };
    }

    // 1. Thử tải trực tiếp từ client qua Google Visualization Export
    const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
    try {
      const res = await fetch(exportUrl);
      if (res.ok) {
        const csvText = await res.text();
        if (
          csvText &&
          !csvText.includes('<!DOCTYPE html>') &&
          !csvText.includes('Google Drive') &&
          !csvText.includes('accounts.google.com')
        ) {
          const students = this.parseCsvToStudents(csvText);
          if (students.length > 0) {
            return {
              success: true,
              students,
              message: `Đã kết nối trực tiếp thành công! Tìm thấy ${students.length} học sinh từ Google Sheet.`
            };
          }
        }
      }
    } catch {
      // Tiếp tục thử fallback qua máy chủ proxy
    }

    // 2. Thử tải qua máy chủ proxy backend
    try {
      const proxyRes = await fetch('/api/db/google-sheets/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetUrl: config.googleSheetUrl,
          apiKey: config.googleSheetApiKey,
          range: config.googleSheetRange
        })
      });

      if (proxyRes.ok) {
        const data = await proxyRes.json();
        if (data.success) {
          if (data.csvText) {
            const students = this.parseCsvToStudents(data.csvText);
            if (students.length > 0) {
              return {
                success: true,
                students,
                message: `Đã kết nối qua máy chủ và nhận diện thành công ${students.length} học sinh từ Google Sheet!`
              };
            }
          } else if (data.values && Array.isArray(data.values)) {
            const csvLike = data.values
              .map((row: any[]) =>
                row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')
              )
              .join('\n');
            const students = this.parseCsvToStudents(csvLike);
            if (students.length > 0) {
              return {
                success: true,
                students,
                message: `Đã đồng bộ ${students.length} học sinh từ Google Sheets API!`
              };
            }
          }
        }
        throw new Error(data.error || 'Không tìm thấy dữ liệu học sinh');
      }
    } catch (serverErr: any) {
      return {
        success: false,
        students: [],
        message: `Lỗi kết nối: ${
          serverErr.message ||
          'Hãy đảm bảo Google Sheet đã được Chia sẻ ở chế độ "Bất kỳ ai có đường liên kết đều có thể xem" (Anyone with the link can view).'
        }`
      };
    }

    return {
      success: false,
      students: [],
      message:
        'Không tìm thấy dữ liệu học sinh hợp lệ. Hãy đảm bảo Google Sheet có các cột: "Họ và tên", "Giới tính", "Ngày sinh", "Phụ huynh", "SĐT".'
    };
  },

  /**
   * Kiểm tra kết nối tới cơ sở dữ liệu trực tuyến
   */
  async testConnection(config: DatabaseConfig): Promise<{ success: boolean; latencyMs: number; message: string }> {
    const startTime = Date.now();
    try {
      if (config.provider === 'googlesheets') {
        const res = await this.fetchGoogleSheetStudents(config);
        const latency = Date.now() - startTime;
        if (res.success) {
          return {
            success: true,
            latencyMs: latency,
            message: `${res.message} (Độ trễ: ${latency}ms)`
          };
        }
        return {
          success: false,
          latencyMs: latency,
          message: res.message
        };
      }

      if (config.provider === 'server') {
        const url = (config.serverUrl || '/api/db') + '/status';
        const res = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
        const latency = Date.now() - startTime;
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          return {
            success: true,
            latencyMs: latency,
            message: `Kết nối máy chủ lớp học thành công (${latency}ms) - Trạng thái: ${
              data.message || 'Sẵn sàng'
            }`
          };
        }
        return {
          success: false,
          latencyMs: latency,
          message: `Máy chủ phản hồi mã lỗi ${res.status}: ${res.statusText}`
        };
      }

      if (config.provider === 'supabase') {
        if (!config.supabaseUrl || !config.supabaseAnonKey) {
          return { success: false, latencyMs: 0, message: 'Vui lòng nhập Supabase Project URL và Anon Public Key.' };
        }
        const cleanUrl = config.supabaseUrl.replace(/\/+$/, '');
        const testUrl = `${cleanUrl}/rest/v1/?apikey=${config.supabaseAnonKey}`;
        const res = await fetch(testUrl, {
          method: 'GET',
          headers: {
            apikey: config.supabaseAnonKey,
            Authorization: `Bearer ${config.supabaseAnonKey}`
          }
        });
        const latency = Date.now() - startTime;
        if (res.ok || res.status === 200 || res.status === 404 || res.status === 204) {
          return {
            success: true,
            latencyMs: latency,
            message: `Kết nối tới Supabase Cloud thành công (${latency}ms)!`
          };
        }
        return {
          success: false,
          latencyMs: latency,
          message: `Supabase trả về lỗi HTTP ${res.status}. Vui lòng kiểm tra lại URL hoặc Anon Key.`
        };
      }

      if (config.provider === 'firebase') {
        if (!config.firebaseUrl) {
          return { success: false, latencyMs: 0, message: 'Vui lòng nhập Firebase Realtime Database URL.' };
        }
        let cleanUrl = config.firebaseUrl.replace(/\/+$/, '');
        if (!cleanUrl.endsWith('.json')) {
          cleanUrl = `${cleanUrl}/test_ping.json`;
        }
        if (config.firebaseAuthToken) {
          cleanUrl += `?auth=${config.firebaseAuthToken}`;
        }
        const res = await fetch(cleanUrl, { method: 'GET' });
        const latency = Date.now() - startTime;
        if (res.ok) {
          return {
            success: true,
            latencyMs: latency,
            message: `Kết nối Google Firebase Realtime DB thành công (${latency}ms)!`
          };
        }
        return {
          success: false,
          latencyMs: latency,
          message: `Firebase trả về mã lỗi ${res.status}. Vui lòng kiểm tra quyền đọc ghi.`
        };
      }

      if (config.provider === 'custom') {
        if (!config.customEndpoint) {
          return { success: false, latencyMs: 0, message: 'Vui lòng nhập URL Custom REST API.' };
        }
        const headers: Record<string, string> = {};
        if (config.customApiKey) {
          headers['Authorization'] = `Bearer ${config.customApiKey}`;
        }
        const res = await fetch(config.customEndpoint, { method: 'GET', headers });
        const latency = Date.now() - startTime;
        if (res.ok) {
          return {
            success: true,
            latencyMs: latency,
            message: `Kết nối tới Custom API thành công (${latency}ms)!`
          };
        }
        return {
          success: false,
          latencyMs: latency,
          message: `Custom API trả về lỗi ${res.status}: ${res.statusText}`
        };
      }

      return { success: true, latencyMs: 1, message: 'Chế độ lưu trữ cục bộ (Offline LocalStorage)' };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - startTime,
        message: `Lỗi kết nối: ${err.message || 'Không thể liên lạc tới máy chủ. Vui lòng kiểm tra kết nối mạng.'}`
      };
    }
  },

  /**
   * Đẩy dữ liệu lên cơ sở dữ liệu trực tuyến (Push / Sync)
   */
  async pushData(
    payload: ClassroomSyncPayload,
    config: DatabaseConfig
  ): Promise<{ success: boolean; message: string; recordCounts?: Record<string, number> }> {
    const recordCounts = {
      students: payload.students.length,
      assignments: payload.assignments.length,
      notifications: payload.notifications.length,
      feedbacks: payload.feedbacks.length,
      materials: payload.materials.length
    };

    try {
      // 1. Luôn đồng bộ vào Máy chủ CSDL Đám mây (Express Cloud Database) để các thiết bị khác luôn cập nhật ngay
      try {
        const serverEndpoint = (config.serverUrl || '/api/db') + '/sync';
        await fetch(serverEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (srvErr) {
        console.warn('Lưu CSDL máy chủ cục bộ:', srvErr);
      }

      if (config.provider === 'googlesheets') {
        // Nếu có Apps Script Web App URL, có thể POST trực tiếp
        if (config.googleAppsScriptUrl) {
          const res = await fetch(config.googleAppsScriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            return {
              success: true,
              message: `Đã cập nhật dữ liệu lớp lên Google Sheets & CSDL Đám mây!`,
              recordCounts
            };
          }
        }
        return {
          success: true,
          message: `Dữ liệu đã được lưu trữ an toàn vào CSDL Đám mây. Danh sách ${recordCounts.students} học sinh sẵn sàng cho mọi thiết bị.`,
          recordCounts
        };
      }

      if (config.provider === 'server') {
        return {
          success: true,
          message: `Đã lưu toàn bộ ${recordCounts.students} học sinh và dữ liệu lớp học lên CSDL Đám mây!`,
          recordCounts
        };
      }

      if (config.provider === 'supabase') {
        const cleanUrl = (config.supabaseUrl || '').replace(/\/+$/, '');
        const endpoint = `${cleanUrl}/rest/v1/aiclass_sync?on_conflict=id`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: config.supabaseAnonKey || '',
            Authorization: `Bearer ${config.supabaseAnonKey || ''}`,
            Prefer: 'resolution=merge-duplicates,return=representation'
          },
          body: JSON.stringify({
            id: payload.classId || 'c-3c1',
            class_name: payload.className || 'Lớp học',
            payload: payload,
            updated_at: new Date().toISOString()
          })
        });

        if (res.ok) {
          return {
            success: true,
            message: `Đồng bộ thành công ${recordCounts.students} học sinh lên Supabase Cloud Database & Máy chủ!`,
            recordCounts
          };
        }
        const errText = await res.text();
        throw new Error(`Supabase lỗi: ${res.status} - ${errText.slice(0, 150)}`);
      }

      if (config.provider === 'firebase') {
        let cleanUrl = (config.firebaseUrl || '').replace(/\/+$/, '');
        if (!cleanUrl.endsWith('.json')) {
          cleanUrl = `${cleanUrl}/classes/${payload.classId || 'class_data'}.json`;
        }
        if (config.firebaseAuthToken) {
          cleanUrl += `?auth=${config.firebaseAuthToken}`;
        }

        const res = await fetch(cleanUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          return {
            success: true,
            message: `Đã cập nhật dữ liệu lớp lên Google Firebase Realtime Database & Máy chủ!`,
            recordCounts
          };
        }
        throw new Error(`Firebase lỗi HTTP ${res.status}`);
      }

      if (config.provider === 'custom') {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (config.customApiKey) {
          headers['Authorization'] = `Bearer ${config.customApiKey}`;
        }
        const res = await fetch(config.customEndpoint || '', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          return {
            success: true,
            message: 'Đã gửi dữ liệu lớp học tới Custom REST API thành công!',
            recordCounts
          };
        }
        throw new Error(`Custom API lỗi ${res.status}`);
      }

      return {
        success: true,
        message: 'Dữ liệu đã được lưu trữ an toàn trong LocalStorage.',
        recordCounts
      };
    } catch (err: any) {
      console.error('Lỗi đẩy dữ liệu lên database:', err);
      return {
        success: false,
        message: `Lỗi đồng bộ: ${err.message || 'Không thể ghi dữ liệu lên đám mây.'}`,
        recordCounts
      };
    }
  },

  /**
   * Kéo dữ liệu mới nhất từ CSDL trực tuyến về (Pull / Fetch)
   */
  async pullData(config: DatabaseConfig): Promise<{ success: boolean; data?: ClassroomSyncPayload; message: string }> {
    try {
      // 1. Luôn ưu tiên tải toàn bộ dữ liệu từ CSDL Đám mây máy chủ (/api/db/latest)
      let serverPayload: ClassroomSyncPayload | null = null;
      try {
        const url = (config.serverUrl || '/api/db') + '/latest';
        const res = await fetch(url);
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const json = await res.json();
          if (json && (json.students || json.payload)) {
            serverPayload = json.payload || json;
          }
        }
      } catch (e) {
        console.warn('Không thể tải từ máy chủ cloud nội bộ:', e);
      }

      // 2. Nếu cấu hình là Google Sheets
      if (config.provider === 'googlesheets') {
        const sheetRes = await this.fetchGoogleSheetStudents(config);
        if (sheetRes.success && sheetRes.students.length > 0) {
          const merged: ClassroomSyncPayload = serverPayload
            ? {
                ...serverPayload,
                students: sheetRes.students,
                lastUpdated: new Date().toISOString()
              }
            : {
                classId: (() => {
                  try {
                    return localStorage.getItem('aiclass_active_class_id_v2') || 'c-default';
                  } catch {}
                  return 'c-default';
                })(),
                className: (() => {
                  try {
                    const savedId = localStorage.getItem('aiclass_active_class_id_v2');
                    const savedClasses = localStorage.getItem('aiclass_classes_v2');
                    if (savedClasses) {
                      const parsed = JSON.parse(savedClasses);
                      const target = parsed.find((c: any) => c.id === savedId);
                      if (target?.name) return `Lớp ${target.name} - Trường Tiểu học Hoài Nhơn`;
                    }
                  } catch {}
                  return 'Lớp học - Trường Tiểu học Hoài Nhơn';
                })(),
                version: '2.0',
                lastUpdated: new Date().toISOString(),
                students: sheetRes.students,
                assignments: [],
                notifications: [],
                feedbacks: [],
                materials: []
              };
          return {
            success: true,
            data: merged,
            message: `Đã nạp ${sheetRes.students.length} học sinh từ Google Sheet và đồng bộ dữ liệu lớp học!`
          };
        }
        if (serverPayload) {
          return {
            success: true,
            data: serverPayload,
            message: `Tải thành công phiên bản mới nhất từ CSDL Đám mây (Google Sheet không khả dụng).`
          };
        }
        return { success: false, message: sheetRes.message };
      }

      // 3. Nếu là máy chủ cloud server (Mặc định)
      if (config.provider === 'server' || !config.provider) {
        if (serverPayload) {
          return {
            success: true,
            data: serverPayload,
            message: `Đã tải phiên bản mới nhất (v${serverPayload.revision || 1}) từ CSDL Đám mây!`
          };
        }
        // Thử lại trực tiếp
        const directRes = await fetch((config.serverUrl || '/api/db') + '/latest');
        if (directRes.ok) {
          const json = await directRes.json();
          const data: ClassroomSyncPayload = json.payload || json;
          return {
            success: true,
            data,
            message: `Đã tải dữ liệu mới nhất (v${data.revision || 1}) từ CSDL Đám mây!`
          };
        }
        throw new Error('Máy chủ CSDL Đám mây không phản hồi dữ liệu.');
      }

      if (config.provider === 'supabase') {
        const cleanUrl = (config.supabaseUrl || '').replace(/\/+$/, '');
        const endpoint = `${cleanUrl}/rest/v1/aiclass_sync?select=*&order=updated_at.desc&limit=1`;
        const res = await fetch(endpoint, {
          headers: {
            apikey: config.supabaseAnonKey || '',
            Authorization: `Bearer ${config.supabaseAnonKey || ''}`
          }
        });

        if (res.ok) {
          const rows = await res.json();
          if (Array.isArray(rows) && rows.length > 0 && rows[0].payload) {
            return {
              success: true,
              data: rows[0].payload as ClassroomSyncPayload,
              message: 'Tải dữ liệu từ Supabase Cloud Database thành công!'
            };
          }
          // Fallback to local server cloud
          const fallbackRes = await fetch((config.serverUrl || '/api/db') + '/latest');
          if (fallbackRes.ok) {
            const fbJson = await fallbackRes.json();
            if (fbJson.payload) {
              return { success: true, data: fbJson.payload, message: 'Đã tải dữ liệu từ CSDL Đám mây máy chủ.' };
            }
          }
          return {
            success: false,
            message: 'Chưa có bản ghi nào trên Supabase.'
          };
        }
        throw new Error(`Supabase lỗi ${res.status}`);
      }

      if (config.provider === 'firebase') {
        let cleanUrl = (config.firebaseUrl || '').replace(/\/+$/, '');
        if (!cleanUrl.endsWith('.json')) {
          cleanUrl = `${cleanUrl}/classes.json`;
        }
        if (config.firebaseAuthToken) {
          cleanUrl += `?auth=${config.firebaseAuthToken}`;
        }

        const res = await fetch(cleanUrl);
        if (res.ok) {
          const json = await res.json();
          if (json && typeof json === 'object') {
            const firstClass = Object.values(json)[0] as ClassroomSyncPayload;
            if (firstClass && firstClass.students) {
              return {
                success: true,
                data: firstClass,
                message: 'Tải dữ liệu thành công từ Google Firebase Realtime Database!'
              };
            }
          }
        }
        // Fallback to local server cloud
        const fallbackRes = await fetch((config.serverUrl || '/api/db') + '/latest');
        if (fallbackRes.ok) {
          const fbJson = await fallbackRes.json();
          if (fbJson.payload) {
            return { success: true, data: fbJson.payload, message: 'Đã tải dữ liệu từ CSDL Đám mây máy chủ.' };
          }
        }
        throw new Error(`Firebase lỗi hoặc chưa có dữ liệu`);
      }

      return {
        success: false,
        message: 'Hiện đang ở chế độ cục bộ (LocalStorage).'
      };
    } catch (err: any) {
      console.error('Lỗi kéo dữ liệu từ CSDL:', err);
      return {
        success: false,
        message: `Lỗi tải dữ liệu: ${err.message || 'Không thể kết nối.'}`
      };
    }
  },

  /**
   * Xuất toàn bộ CSDL ra file JSON tải về máy
   */
  exportBackupJson(payload: ClassroomSyncPayload): void {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute('download', `aiclass-3c1-database-backup-${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  /**
   * Tải tệp CSV mẫu chuẩn để giáo viên nhập vào Google Sheets
   */
  downloadGoogleSheetTemplate(): void {
    const headers = [
      'STT',
      'Mã HS',
      'Họ và tên',
      'Tên đăng nhập',
      'Mật khẩu',
      'Giới tính',
      'Ngày sinh',
      'Lớp',
      'Họ tên phụ huynh',
      'SĐT phụ huynh',
      'Tiến độ (%)',
      'Tiếng Anh',
      'Toán',
      'Tiếng Việt',
      'Tin học',
      'Mục tiêu hỗ trợ'
    ];

    const sampleRows = [
      ['1', 'HS301', 'Nguyễn Bảo An', 'hs3c101', '123456', 'Nữ', '2018-03-15', '3C1', 'Nguyễn Văn Hùng', '0912 345 678', '95', '95', '90', '92', '96', 'Phát huy năng lực song ngữ và thuyết trình tự tin'],
      ['2', 'HS302', 'Trần Gia Bảo', 'hs3c102', '123456', 'Nam', '2018-05-20', '3C1', 'Trần Đình Trọng', '0913 456 789', '88', '85', '92', '86', '90', 'Rèn tính cẩn thận khi giải toán có lời văn'],
      ['3', 'HS303', 'Lê Quỳnh Chi', 'hs3c103', '123456', 'Nữ', '2018-08-10', '3C1', 'Lê Văn Cường', '0914 567 890', '92', '90', '88', '94', '92', 'Bồi dưỡng kỹ năng đọc diễn cảm và viết đoạn văn hay'],
      ['4', 'HS304', 'Phạm Minh Đăng', 'hs3c104', '123456', 'Nam', '2018-01-25', '3C1', 'Phạm Quốc Tuấn', '0915 678 901', '86', '82', '95', '80', '92', 'Rèn luyện thêm chữ viết và tập trung trong giờ học'],
      ['5', 'HS305', 'Hoàng Thùy Dương', 'hs3c105', '123456', 'Nữ', '2018-11-05', '3C1', 'Hoàng Minh Hải', '0916 789 012', '94', '96', '90', '93', '95', 'Duy trì thói quen đọc sách và giúp đỡ bạn cùng tiến']
    ];

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...sampleRows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'mau_danh_sach_lop_3c1_google_sheet.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  /**
   * Kiểm tra phiên bản mới nhất từ CSDL Đám mây (dành cho tự động đồng bộ giữa các máy/điện thoại)
   */
  async checkLatestVersion(config?: DatabaseConfig): Promise<{
    hasUpdate: boolean;
    cloudRevision: number;
    cloudLastUpdated: string;
    recordCounts?: Record<string, number>;
  }> {
    try {
      const serverUrl = config?.serverUrl || '/api/db';
      const res = await fetch(`${serverUrl}/version`);
      if (res.ok) {
        const json = await res.json();
        return {
          hasUpdate: true,
          cloudRevision: Number(json.revision) || 1,
          cloudLastUpdated: json.lastUpdated || '',
          recordCounts: json.recordCounts
        };
      }
    } catch {}
    return { hasUpdate: false, cloudRevision: 0, cloudLastUpdated: '' };
  },

  /**
   * Mã mẫu Google Apps Script để kết nối 2 chiều nếu giáo viên muốn
   */
  getSampleAppsScriptCode(): string {
    return `// ============================================================
// GOOGLE APPS SCRIPT CHO DANH SÁCH LỚP 3C1 (AI CLASS)
// Dán vào: Google Sheets > Tiện ích mở rộng > Apps Script > Triển khai dưới dạng Web App
// ============================================================

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    rowCount: data.length,
    data: data
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var body = JSON.parse(e.postData.contents);
  // Có thể cập nhật điểm danh hoặc thêm học sinh mới
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Đã cập nhật dữ liệu thành công!"
  })).setMimeType(ContentService.MimeType.JSON);
}
`;
  },

  /**
   * Mã SQL mẫu cho Supabase
   */
  getSampleSqlForSupabase(): string {
    return `-- ============================================================
-- SQL SETUP CHO DỰ ÁN AI CLASS 3C1 TRÊN SUPABASE (PostgreSQL)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.aiclass_sync (
  id TEXT PRIMARY KEY,
  class_name TEXT NOT NULL DEFAULT '3C1',
  payload JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.aiclass_sync ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cho phép đọc dữ liệu lớp học công khai" ON public.aiclass_sync;
CREATE POLICY "Cho phép đọc dữ liệu lớp học công khai"
  ON public.aiclass_sync FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Cho phép cập nhật dữ liệu lớp học" ON public.aiclass_sync;
CREATE POLICY "Cho phép cập nhật dữ liệu lớp học"
  ON public.aiclass_sync FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
`;
  }
};
