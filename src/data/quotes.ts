// ============================================================
// 鼓励语料库 — 30+ 条温暖治愈的鼓励消息
// ============================================================

export type QuoteCategory =
  | 'morning'
  | 'focus'
  | 'break'
  | 'completion'
  | 'streak'
  | 'idle'
  | 'general';

export interface Quote {
  text: string;
  category: QuoteCategory;
  minStreak?: number;   // 触发所需的最小连续天数
}

export const quotes: Quote[] = [
  // ---- 清晨 ----
  { text: '新的一天，从第一个番茄开始吧 🌅', category: 'morning' },
  { text: '早上好！今天的你，比昨天更有力量 💪', category: 'morning' },
  { text: '清晨的专注力最珍贵，好好利用它 ✨', category: 'morning' },

  // ---- 专注中 ----
  { text: '每一次专注，都是对自己的承诺 🌱', category: 'focus' },
  { text: '25 分钟不长，但足够改变点什么 🍅', category: 'focus' },
  { text: '放下杂念，就 25 分钟，你可以的', category: 'focus' },
  { text: '专心的你，在闪闪发光 ✨', category: 'focus' },
  { text: '一步一个番茄，慢慢来反而比较快 🐢', category: 'focus' },

  // ---- 休息 ----
  { text: '休息是为了走更远的路，喝口水吧 ☕', category: 'break' },
  { text: '站起来活动一下，看看窗外 🌿', category: 'break' },
  { text: '闭眼深呼吸三次，让大脑放松 🧘', category: 'break' },

  // ---- 完成 ----
  { text: '太棒了！你又完成了一次专注 🎉', category: 'completion' },
  { text: '每完成一个番茄，都离目标更近一步 ⭐', category: 'completion' },
  { text: '今天的你，比昨天多了一份成就感 💫', category: 'completion' },
  { text: '看，其实没那么难，你已经做到了！', category: 'completion' },

  // ---- 连续天数 ----
  { text: '连续坚持的你，真的很了不起 🔥', category: 'streak', minStreak: 3 },
  { text: '习惯正在慢慢养成，继续加油！💪', category: 'streak', minStreak: 5 },
  { text: '七天如一日，自律即自由 🏆', category: 'streak', minStreak: 7 },
  { text: '你已经把专注变成了习惯，真棒！🌟', category: 'streak', minStreak: 14 },
  { text: '三十天的坚持，你已经不再是原来的你了 🎊', category: 'streak', minStreak: 30 },

  // ---- 空闲提醒 ----
  { text: '好久没见到你了，来一个番茄吗？🍅', category: 'idle' },
  { text: '哪怕只完成一个番茄，也是向前一步 🐾', category: 'idle' },
  { text: '拖延最大的敌人就是开始，就从现在吧！', category: 'idle' },
  { text: '打败拖延不需要完美，只需要开始 🌈', category: 'idle' },

  // ---- 通用 ----
  { text: '种一棵树最好的时间是十年前，其次是现在 🌳', category: 'general' },
  { text: '你不是在拖延，你只是在等一个最好的开始 ✨', category: 'general' },
  { text: '每天进步一点点，时间会给你惊喜 🎁', category: 'general' },
  { text: '真正的效率不是做更多，而是专注当下 🌸', category: 'general' },
  { text: '你不必完美，你只需要开始 💖', category: 'general' },
  { text: '把大目标拆成小番茄，一切都会变得容易 🍅', category: 'general' },
  { text: '专注是一种超能力，你今天就要使用它 ⚡', category: 'general' },
];

/** 根据上下文选择一条鼓励语 */
export function pickQuote(
  category: QuoteCategory,
  recentTexts: string[] = [],
  currentStreak: number = 0,
): string {
  // 筛选符合条件的语料
  let pool = quotes.filter((q) => {
    if (q.category !== category) return false;
    if (q.minStreak && currentStreak < q.minStreak) return false;
    return true;
  });

  // 如果当前分类没有合适的，回退到 general
  if (pool.length === 0) {
    pool = quotes.filter((q) => q.category === 'general');
  }

  // 避免最近用过的（保留最近 5 条）
  const fresh = pool.filter((q) => !recentTexts.includes(q.text));
  const candidates = fresh.length > 0 ? fresh : pool;

  // 随机选择
  return candidates[Math.floor(Math.random() * candidates.length)]?.text ?? quotes[0].text;
}
