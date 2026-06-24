// ============================================================
// PieChart — 通用 SVG 饼图 / 环形图
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { colors, typography, spacing } from '../../constants/theme';

export interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
  donut?: boolean;           // 环形图
  donutRadius?: number;      // 内圈占比 0-1
  showLegend?: boolean;
  centerLabel?: string;
  centerSubLabel?: string;
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}

export function PieChart({
  data,
  size = 200,
  donut = false,
  donutRadius = 0.6,
  showLegend = true,
  centerLabel,
  centerSubLabel,
}: PieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Text style={styles.emptyText}>暂无数据</Text>
      </View>
    );
  }

  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = size / 2 - 2;
  const innerRadius = donut ? outerRadius * donutRadius : 0;

  let currentAngle = 0;
  const slices: { path: string; color: string; percentage: number }[] = [];

  for (const item of data) {
    const percentage = item.value / total;
    const angle = percentage * 360;
    if (angle > 0) {
      slices.push({
        path: describeArc(cx, cy, outerRadius, currentAngle, currentAngle + angle),
        color: item.color,
        percentage,
      });
    }
    currentAngle += angle;
  }

  return (
    <View style={[styles.container, { width: size }]}>
      <Svg width={size} height={size}>
        <G>
          {slices.map((slice, i) => (
            <Path key={i} d={slice.path} fill={slice.color} />
          ))}
        </G>
        {/* 环形内圈白色遮罩 */}
        {donut && innerRadius > 0 && (
          <Path
            d={[
              `M ${cx - innerRadius} ${cy}`,
              `A ${innerRadius} ${innerRadius} 0 1 0 ${cx + innerRadius} ${cy}`,
              `A ${innerRadius} ${innerRadius} 0 1 0 ${cx - innerRadius} ${cy}`,
              'Z',
            ].join(' ')}
            fill={colors.background}
          />
        )}
      </Svg>

      {/* 中心文字 */}
      {donut && centerLabel && (
        <View style={[styles.centerOverlay, { top: 0, left: 0, width: size, height: size }]}>
          <Text style={styles.centerLabel}>{centerLabel}</Text>
          {centerSubLabel && <Text style={styles.centerSubLabel}>{centerSubLabel}</Text>}
        </View>
      )}

      {/* 图例 */}
      {showLegend && (
        <View style={styles.legend}>
          {data.map((item, i) => (
            <View key={i} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText} numberOfLines={1}>
                {item.label} ({Math.round((item.value / total) * 100)}%)
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
  centerSubLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyText: {
    ...typography.body,
    color: colors.textTertiary,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
