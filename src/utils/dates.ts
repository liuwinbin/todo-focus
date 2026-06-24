// ============================================================
// 日期工具函数
// ============================================================

/** 返回 YYYY-MM-DD 格式的日期字符串 */
export function formatDate(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 解析 YYYY-MM-DD 到 Date */
export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** 日期加减天数 */
export function addDays(dateStr: string, days: number): string {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

/** 两个日期之间的天数差 */
export function daysBetween(a: string, b: string): number {
  const da = parseDate(a);
  const db = parseDate(b);
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

/** 获取本周一的日期 */
export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // 周一为一周开始
  d.setDate(d.getDate() + diff);
  return formatDate(d);
}

/** 生成一个简单的唯一 ID */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

/** 格式化分钟为人类可读字符串 */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} 分钟`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} 小时 ${m} 分钟` : `${h} 小时`;
}

/** 格式化秒为 MM:SS */
export function formatSeconds(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** 获取指定月份的天数 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** 获取指定月份第一天是星期几（0=周日, 1=周一, ..., 6=周六） */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

/** 判断日期字符串是否为今天 */
export function isToday(dateStr: string): boolean {
  return dateStr === formatDate(new Date());
}

/** 判断两个日期字符串是否同一天 */
export function isSameDay(a: string, b: string): boolean {
  return a === b;
}

/** 格式化年月为中文 */
export function formatMonthYear(year: number, month: number): string {
  return `${year}年${month}月`;
}

/** 格式化日期为友好中文（如 "6月24日 周二"） */
export function formatFriendlyDate(dateStr: string): string {
  const d = parseDate(dateStr);
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${d.getMonth() + 1}月${d.getDate()}日 ${dayNames[d.getDay()]}`;
}

/** 格式化时间 HH:mm 为显示字符串 */
export function formatTimeDisplay(time?: string): string {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
