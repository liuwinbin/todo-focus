// ============================================================
// LineChart — 通用 SVG 折线图
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Polyline,
  Circle,
  G,
  Line,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
  Polygon,
} from 'react-native-svg';
import { colors, typography } from '../../constants/theme';

export interface LineChartData {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LineChartData[];
  width?: number;
  height?: number;
  lineColor?: string;
  fillColor?: string;
  showDots?: boolean;
  showValues?: boolean;
  showFill?: boolean;
  maxValue?: number;
  paddingHorizontal?: number;
  paddingBottom?: number;
  paddingTop?: number;
}

export function LineChart({
  data,
  width = 300,
  height = 180,
  lineColor = colors.primary,
  fillColor,
  showDots = true,
  showValues = false,
  showFill = true,
  maxValue: maxValOverride,
  paddingHorizontal = 20,
  paddingBottom = 28,
  paddingTop = 20,
}: LineChartProps) {
  if (data.length === 0) {
    return (
      <View style={[styles.container, { width, height }]}>
        <Text style={styles.emptyText}>暂无数据</Text>
      </View>
    );
  }

  const maxValue = maxValOverride ?? Math.max(...data.map((d) => d.value), 1);
  const chartWidth = width - paddingHorizontal * 2;
  const chartHeight = height - paddingBottom - paddingTop;

  // 计算点坐标
  const points = data.map((item, i) => {
    const x =
      data.length === 1
        ? paddingHorizontal + chartWidth / 2
        : paddingHorizontal + (i / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (item.value / maxValue) * chartHeight;
    return { x, y, ...item };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const fillPolygonPoints = [
    `${paddingHorizontal},${paddingTop + chartHeight}`,
    ...points.map((p) => `${p.x},${p.y}`),
    `${points[points.length - 1].x},${paddingTop + chartHeight}`,
  ].join(' ');

  const gradientId = 'lineChartGradient';
  const areaColor = fillColor ?? lineColor;

  // Y 轴参考线
  const yLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <View style={[styles.container, { width }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={areaColor} stopOpacity="0.25" />
            <Stop offset="1" stopColor={areaColor} stopOpacity="0.02" />
          </LinearGradient>
        </Defs>

        <G>
          {/* Y 轴辅助线 */}
          {yLines.map((ratio, i) => {
            const y = paddingTop + chartHeight - chartHeight * ratio;
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
            y1={paddingTop + chartHeight}
            x2={width - paddingHorizontal}
            y2={paddingTop + chartHeight}
            stroke={colors.textTertiary}
            strokeWidth={1}
          />

          {/* 填充区域 */}
          {showFill && data.length > 1 && (
            <Polygon points={fillPolygonPoints} fill={`url(#${gradientId})`} />
          )}

          {/* 折线 */}
          <Polyline
            points={polylinePoints}
            fill="none"
            stroke={lineColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 数据点 */}
          {showDots &&
            points.map((p, i) => (
              <Circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={4}
                fill={colors.surface}
                stroke={lineColor}
                strokeWidth={2}
              />
            ))}

          {/* 数值标签 */}
          {showValues &&
            points.map((p, i) => (
              <SvgText
                key={`v-${i}`}
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                fontSize={10}
                fill={colors.textSecondary}
              >
                {p.value}
              </SvgText>
            ))}

          {/* X 轴标签 */}
          {points.map((p, i) => (
            <SvgText
              key={`l-${i}`}
              x={p.x}
              y={height - 6}
              textAnchor="middle"
              fontSize={10}
              fill={colors.textSecondary}
            >
              {p.label}
            </SvgText>
          ))}
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
