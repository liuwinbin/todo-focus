// ============================================================
// AppProvider — 根 Context Provider 组合
// ============================================================
import React, { type ReactNode } from 'react';
import { SettingsProvider } from './SettingsContext';
import { ItemProvider } from './ItemContext';
import { TemplateProvider } from './TemplateContext';
import { HabitProvider } from './HabitContext';
import { HabitGoalProvider } from './HabitGoalContext';
import { AchievementProvider } from './AchievementContext';
import { TimeLogProvider } from './TimeLogContext';
import { CountdownProvider } from './CountdownContext';
import { NoteProvider } from './NoteContext';
import { TimerProvider } from './TimerContext';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <ItemProvider>
        <TemplateProvider>
            <HabitProvider>
              <HabitGoalProvider>
                <AchievementProvider>
                  <TimeLogProvider>
                    <CountdownProvider>
                      <NoteProvider>
                        <TimerProvider>
                {children}
              </TimerProvider>
                      </NoteProvider>
                    </CountdownProvider>
                  </TimeLogProvider>
                </AchievementProvider>
              </HabitGoalProvider>
            </HabitProvider>
        </TemplateProvider>
      </ItemProvider>
    </SettingsProvider>
  );
}
