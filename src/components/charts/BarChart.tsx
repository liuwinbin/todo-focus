// ============================================================
// BarChart — 通用 SVG 柱状图
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, G, Line, Text as SvgText } from 'react-native-svg';
import { colors, typography, spacing } from '../../constants/theme';

export interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  width?: number;
  height?: number;
  barColor?: string;
  showValues?: boolean;
  maxValue?: number;
  paddingHorizontal?: number;
  paddingBottom?: number;
}

export function BarChart({
  data,
  width = 300,
  height = 180,
  barColor = colors.primary,
  showValues = true,
  maxValue: maxValOverride,
  paddingHorizontal = 20,
  paddingBottom = 28,
}: BarChartProps) {
  if (data.length === 0) {
    return (
      <View style={[styles.container, { width, height }]}>
        <Text style={styles.emptyText}>暂无数据</Text>
      </View>
    );
  }

  const maxValue = maxValOverride ?? Math.max(...data.map((d) => d.value), 1);
  const chartWidth = width - paddingHorizontal * 2;
  const chartHeight = height - paddingBottom;
  const barCount = data.length;
  const barGap = Math.max(4, chartWidth / (barCount * 3));
  const barWidth = (chartWidth - barGap * (barCount - 1)) / barCount;

  // Y 轴参考线
  const yLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <View style={[styles.container, { width }]}>
      <Svg width={width} height={height}>
        <G>
          {/* Y 轴辅助线 */}
          {yLines.map((ratio, i) => {
            const y = chartHeight - chartHeight * ratio;
            return (
              <Line
                key={i}
                x1={paddingHorizontal}
                y1={y}
                x2={width - paddingHorizontal}
                y2={y}
                stroke={colors.tabBarBorder}
                strokeWidth={0.5}
                strokeDasharray="4,4"
              />
            );
          })}

          {/* 基准线 */}
          <Line
            x1={paddingHorizontal}
            y1={chartHeight}
            x2={width - paddingHorizontal}
            y2={chartHeight}
            stroke={colors.textTertiary}
            strokeWidth={1}
          />

          {/* 柱子 */}
          {data.map((item, i) => {
            const barHeight = Math.max(2, (item.value / maxValue) * chartHeight);
            const x = paddingHorizontal + i * (barWidth + barGap);
            const y = chartHeight - barHeight;
            const fill = item.color ?? barColor;

            return (
              <G key={i}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={fill}
                  rx={4}
                  ry={4}
                />
                {/* 数值标签 */}
                {showValues && item.value > 0 && (
                  <SvgText
                    x={x + barWidth / 2}
                    y={y - 6}
                    textAnchor="middle"
                    fontSize={10}
                    fill={colors.textSecondary}
                  >
                    {item.value}
                  </SvgText>
                )}
                {/* X 轴标签 */}
                <SvgText
                  x={x + barWidth / 2}
                  y={height - 6}
                  textAnchor="middle"
                  fontSize={10}
                  fill={colors.textSecondary}
                >
                  {item.label}
                </SvgText>
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textTertiary,
  },
});
