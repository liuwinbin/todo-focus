// ============================================================
// TemplateContext — 任务模板状态管理
// ============================================================
import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/storage';
import { generateId } from '../utils/dates';
import type { TaskTemplate, TaskTemplateItem } from '../types';

// ---- State ----
interface TemplateState {
  templates: TaskTemplate[];
  isLoading: boolean;
}

const initialState: TemplateState = { templates: [], isLoading: true };

// ---- Actions ----
type TemplateAction =
  | { type: 'LOAD_TEMPLATES'; payload: TaskTemplate[] }
  | { type: 'ADD_TEMPLATE'; payload: { name: string; tasks: TaskTemplateItem[] } }
  | { type: 'UPDATE_TEMPLATE'; payload: { id: string; updates: Partial<TaskTemplate> } }
  | { type: 'DELETE_TEMPLATE'; payload: string };

// ---- Default templates ----
const DEFAULT_TEMPLATES: { name: string; tasks: TaskTemplateItem[] }[] = [
  {
    name: '每日工作计划',
    tasks: [
      { title: '检查邮件和消息', priority: 'high', category: 'work', estimatedPomodoros: 1 },
      { title: '完成今日核心任务', priority: 'high', category: 'work', estimatedPomodoros: 4 },
      { title: '整理工作日志', priority: 'medium', category: 'work', estimatedPomodoros: 1 },
    ],
  },
  {
    name: '每日学习计划',
    tasks: [
      { title: '阅读 30 分钟', priority: 'high', category: 'study', estimatedPomodoros: 1 },
      { title: '完成课程作业', priority: 'high', category: 'study', estimatedPomodoros: 3 },
      { title: '复习今日笔记', priority: 'medium', category: 'study', estimatedPomodoros: 1 },
    ],
  },
  {
    name: '周末生活计划',
    tasks: [
      { title: '打扫房间', priority: 'medium', category: 'life', estimatedPomodoros: 2 },
      { title: '购买日用品', priority: 'low', category: 'life', estimatedPomodoros: 1 },
      { title: '给家人打电话', priority: 'medium', category: 'life', estimatedPomodoros: 0 },
      { title: '运动健身', priority: 'high', category: 'life', estimatedPomodoros: 2 },
    ],
  },
];

// ---- Reducer ----
function templateReducer(state: TemplateState, action: TemplateAction): TemplateState {
  switch (action.type) {
    case 'LOAD_TEMPLATES':
      return { templates: action.payload, isLoading: false };

    case 'ADD_TEMPLATE': {
      const newTemplate: TaskTemplate = {
        id: generateId(),
        name: action.payload.name,
        tasks: action.payload.tasks,
        createdAt: new Date().toISOString(),
      };
      return { ...state, templates: [newTemplate, ...state.templates] };
    }

    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates } : t,
        ),
      };

    case 'DELETE_TEMPLATE':
      return { ...state, templates: state.templates.filter((t) => t.id !== action.payload) };

    default:
      return state;
  }
}

// ---- Context ----
interface TemplateContextValue {
  state: TemplateState;
  dispatch: React.Dispatch<TemplateAction>;
}

const TemplateContext = createContext<TemplateContextValue | null>(null);

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(templateReducer, initialState);

  // 加载持久化数据
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.taskTemplates);
        if (raw) {
          dispatch({ type: 'LOAD_TEMPLATES', payload: JSON.parse(raw) });
        } else {
          // 首次使用：导入默认模板
          const defaults: TaskTemplate[] = DEFAULT_TEMPLATES.map((t) => ({
            id: generateId(),
            name: t.name,
            tasks: t.tasks,
            createdAt: new Date().toISOString(),
          }));
          dispatch({ type: 'LOAD_TEMPLATES', payload: defaults });
        }
      } catch {
        dispatch({ type: 'LOAD_TEMPLATES', payload: [] });
      }
    })();
  }, []);

  // 持久化
  useEffect(() => {
    if (!state.isLoading) {
      const timer = setTimeout(() => {
        AsyncStorage.setItem(STORAGE_KEYS.taskTemplates, JSON.stringify(state.templates)).catch(() => {});
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.templates, state.isLoading]);

  return (
    <TemplateContext.Provider value={{ state, dispatch }}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplateContext() {
  const ctx = useContext(TemplateContext);
  if (!ctx) throw new Error('useTemplateContext must be used within TemplateProvider');
  return ctx;
}
