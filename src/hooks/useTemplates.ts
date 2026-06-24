// ============================================================
// useTemplates — 任务模板操作便捷 Hook
// ============================================================
import { useCallback } from 'react';
import { useTemplateContext } from '../context/TemplateContext';
import type { TaskTemplate, TaskTemplateItem } from '../types';

export function useTemplates() {
  const { state, dispatch } = useTemplateContext();

  const addTemplate = useCallback(
    (data: { name: string; tasks: TaskTemplateItem[] }) => {
      dispatch({ type: 'ADD_TEMPLATE', payload: data });
    },
    [dispatch],
  );

  const updateTemplate = useCallback(
    (id: string, updates: Partial<TaskTemplate>) => {
      dispatch({ type: 'UPDATE_TEMPLATE', payload: { id, updates } });
    },
    [dispatch],
  );

  const deleteTemplate = useCallback(
    (id: string) => {
      dispatch({ type: 'DELETE_TEMPLATE', payload: id });
    },
    [dispatch],
  );

  return {
    templates: state.templates,
    isLoading: state.isLoading,
    addTemplate,
    updateTemplate,
    deleteTemplate,
  };
}
