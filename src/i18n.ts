const vi = {
  pageTitle: 'Đấu trường · Bản thử nghiệm',
  prototype: 'BẢN THỬ NGHIỆM',
  title: 'ĐẤU TRƯỜNG',
  subtitle: 'Bước vào vòng ấn',
  stage: '01 / KHỞI ĐẦU',
  arena: 'Vòng ấn',
  arenaLabel: 'Đấu trường hình học. Dùng WASD để di chuyển và chuột để ngắm.',
  ready: 'SẴN SÀNG',
  playing: 'ĐANG KHÁM PHÁ',
  paused: 'TẠM DỪNG',
  welcomeTitle: 'Đánh thức vòng ấn.',
  welcomeBody: 'Di chuyển trong đấu trường. Làm quen với nhịp bước và hướng ngắm của bạn.',
  scope: 'Bản thử nghiệm di chuyển · Chưa có chiến đấu',
  start: 'Bắt đầu',
  pause: 'Tạm dừng',
  resume: 'Tiếp tục',
  pauseTitle: 'Một nhịp nghỉ.',
  pauseBody: 'Đấu trường đang chờ. Tiếp tục khi bạn sẵn sàng.',
  move: 'Di chuyển',
  aim: 'Ngắm',
  mouse: 'CHUỘT',
  pauseHint: 'Tạm dừng / tiếp tục',
  controls: 'ĐIỀU KHIỂN',
  moveKey: 'W A S D',
  pauseKey: 'ESC',
  language: 'Ngôn ngữ',
  vi: 'Tiếng Việt',
  en: 'English',
  desktop: 'Dành cho máy tính · Bàn phím + chuột',
  signature: 'HÌNH HỌC / HUYỀN THUẬT',
} as const;

export type TranslationKey = keyof typeof vi;
export type Locale = 'vi' | 'en';

const en: Record<TranslationKey, string> = {
  pageTitle: 'Arena · Prototype',
  prototype: 'PROTOTYPE',
  title: 'THE ARENA',
  subtitle: 'Enter the sigil',
  stage: '01 / BEGINNING',
  arena: 'The sigil',
  arenaLabel: 'Geometric arena. Use WASD to move and the mouse to aim.',
  ready: 'READY',
  playing: 'EXPLORING',
  paused: 'PAUSED',
  welcomeTitle: 'Awaken the sigil.',
  welcomeBody: 'Move through the arena. Find your footing and get a feel for your aim.',
  scope: 'Movement prototype · Combat not yet available',
  start: 'Begin',
  pause: 'Pause',
  resume: 'Resume',
  pauseTitle: 'Take a breath.',
  pauseBody: 'The arena can wait. Continue when you are ready.',
  move: 'Move',
  aim: 'Aim',
  mouse: 'MOUSE',
  pauseHint: 'Pause / resume',
  controls: 'CONTROLS',
  moveKey: 'W A S D',
  pauseKey: 'ESC',
  language: 'Language',
  vi: 'Tiếng Việt',
  en: 'English',
  desktop: 'For desktop · Keyboard + mouse',
  signature: 'GEOMETRY / THE OCCULT',
};

let locale: Locale = 'vi';
export const t = (key: TranslationKey): string => ({ vi, en })[locale][key];
export function setLocale(value: Locale): void {
  locale = value;
  document.documentElement.lang = value;
}
