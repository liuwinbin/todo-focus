// ============================================================
// Note — 灵感笔记数据类型
// ============================================================

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;      // ISO 8601
  updatedAt: string;      // ISO 8601
}
