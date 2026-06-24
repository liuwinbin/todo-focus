// ============================================================
// 农历计算 — 纯 JS 实现（基于寿星万年历算法）
// 参考: https://github.com/jjonline/calendar.js
// ============================================================

// 农历数据 1900-2100（每个数字表示一年，bit 位编码）
// [0-3]: 闰月月份（0=无闰月）
// [4-15]: 12个月大小月（1=30天, 0=29天）
// [16-19]: 闰月大小（1=30天, 0=29天）
const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63,
];

// 天干
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 地支
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// 生肖
const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
// 农历月份
const LUNAR_MONTHS = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
// 农历日期
const LUNAR_DAYS = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
];
// 农历节日
const LUNAR_FESTIVALS: Record<string, string> = {
  '1-1': '春节',
  '1-15': '元宵节',
  '5-5': '端午节',
  '7-7': '七夕',
  '7-15': '中元节',
  '8-15': '中秋节',
  '9-9': '重阳节',
  '12-30': '除夕',
  '12-29': '除夕', // 小月
};

// 公历节日
const SOLAR_FESTIVALS: Record<string, string> = {
  '1-1': '元旦',
  '2-14': '情人节',
  '3-8': '妇女节',
  '3-12': '植树节',
  '4-1': '愚人节',
  '5-1': '劳动节',
  '5-4': '青年节',
  '6-1': '儿童节',
  '7-1': '建党节',
  '8-1': '建军节',
  '9-10': '教师节',
  '10-1': '国庆节',
  '12-25': '圣诞节',
};

/** 公历转农历结果 */
export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
  monthName: string;    // 农历月名 e.g. "正月"
  dayName: string;      // 农历日名 e.g. "初一"
  yearName: string;     // 干支纪年 e.g. "甲辰"
  zodiac: string;       // 生肖 e.g. "龙"
  festival?: string;    // 农历节日
  solarFestival?: string; // 公历节日
}

/** 获取某年的农历信息 */
function getLunarYearInfo(year: number): number {
  return LUNAR_INFO[year - 1900] ?? 0;
}

/** 获取农历年闰月月份（0=无闰月） */
function getLeapMonth(year: number): number {
  return getLunarYearInfo(year) & 0xf;
}

/** 获取农历年总天数 */
function getLunarYearDays(year: number): number {
  let sum = 348; // 12 * 29
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (getLunarYearInfo(year) & i) ? 1 : 0;
  }
  const leap = getLeapMonth(year);
  if (leap) {
    sum += (getLunarYearInfo(year) & 0x10000) ? 30 : 29;
  }
  return sum;
}

/** 获取农历月天数 */
function getLunarMonthDays(year: number, month: number): number {
  return (getLunarYearInfo(year) & (0x10000 >> month)) ? 30 : 29;
}

/** 公历转农历 */
export function solarToLunar(date: Date): LunarDate {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 1900年1月31日是农历庚子年正月初一
  const baseDate = new Date(1900, 0, 31);
  let offset = Math.floor((date.getTime() - baseDate.getTime()) / 86400000);

  // 查找农历年
  let lunarYear = 1900;
  let daysInYear = getLunarYearDays(lunarYear);
  while (lunarYear < 2100 && offset >= daysInYear) {
    offset -= daysInYear;
    lunarYear++;
    daysInYear = getLunarYearDays(lunarYear);
  }

  // 查找农历月
  const leap = getLeapMonth(lunarYear);
  let lunarMonth = 1;
  let isLeap = false;

  for (let m = 1; m <= 12; m++) {
    if (leap > 0 && m === leap + 1) {
      // 处理闰月
      if (offset < (getLunarYearInfo(lunarYear) & 0x10000 ? 30 : 29)) {
        lunarMonth = leap;
        isLeap = true;
        break;
      }
      offset -= getLunarYearInfo(lunarYear) & 0x10000 ? 30 : 29;
    }

    const monthDays = getLunarMonthDays(lunarYear, m);
    if (offset < monthDays) {
      lunarMonth = m;
      break;
    }
    offset -= monthDays;
  }

  const lunarDay = offset + 1;

  // 干支纪年
  const tianGanIdx = (lunarYear - 4) % 10;
  const diZhiIdx = (lunarYear - 4) % 12;
  const yearName = `${TIAN_GAN[tianGanIdx]}${DI_ZHI[diZhiIdx]}`;
  const zodiac = SHENG_XIAO[diZhiIdx];

  // 节日
  const lunarKey = `${lunarMonth}-${lunarDay}`;
  const solarKey = `${month}-${day}`;
  const festival = LUNAR_FESTIVALS[lunarKey];
  const solarFestival = SOLAR_FESTIVALS[solarKey];

  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    isLeap,
    monthName: (isLeap ? '闰' : '') + LUNAR_MONTHS[lunarMonth - 1],
    dayName: LUNAR_DAYS[lunarDay - 1],
    yearName,
    zodiac,
    festival,
    solarFestival,
  };
}

/** 获取今日农历信息 */
export function getTodayLunar(): LunarDate {
  return solarToLunar(new Date());
}

/** 计算两个日期之间的天数差 */
export function daysBetween(a: Date, b: Date): number {
  const oneDay = 86400000;
  const aStart = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bStart = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((bStart.getTime() - aStart.getTime()) / oneDay);
}

/** 格式化日期显示（e.g. "2024年1月15日"） */
export function formatDateCN(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

/** 获取星期几的中文名 */
export function getDayOfWeekCN(date: Date): string {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  return `星期${days[date.getDay()]}`;
}
