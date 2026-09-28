import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

import { heatmapLevel, heatmapShades } from '@/lib/color';
import { addDays, formatMonthShort, fromDateKey, startOfWeek, toDateKey, type DateKey } from '@/lib/dates';
import { useTheme } from '@/theme';

export type HeatmapProps = {
  /** Last day shown; its week is the right-most column. */
  endDate: DateKey;
  /** Number of week columns. */
  weeks: number;
  /** Progress for a day in 0…1, or null when the day is out of range (e.g. before the habit existed). */
  getRatio: (day: DateKey) => number | null;
  color: string;
  /** Fixed cell size. Omit to stretch the grid to the available width. */
  cellSize?: number;
  gap?: number;
  showMonthLabels?: boolean;
  showWeekdayLabels?: boolean;
  accessibilityLabel?: string;
};

const MONTH_LABEL_HEIGHT = 16;
const WEEKDAY_LABEL_WIDTH = 18;
const WEEKDAY_LABELS: Record<number, string> = { 0: 'M', 2: 'W', 4: 'F' };

/**
 * GitHub-style consistency grid: one column per week (Mon → Sun top to bottom),
 * shaded by how much of the day's goal was reached.
 */
export function Heatmap({
  endDate,
  weeks,
  getRatio,
  color,
  cellSize,
  gap = 3,
  showMonthLabels = false,
  showWeekdayLabels = false,
  accessibilityLabel,
}: HeatmapProps) {
  const { colors } = useTheme();
  const [measuredWidth, setMeasuredWidth] = useState(0);

  const offsetX = showWeekdayLabels ? WEEKDAY_LABEL_WIDTH : 0;
  const offsetY = showMonthLabels ? MONTH_LABEL_HEIGHT : 0;
  const cell = cellSize ?? Math.max(4, (measuredWidth - offsetX - gap * (weeks - 1)) / weeks);
  const step = cell + gap;
  const width = offsetX + weeks * step - gap;
  const height = offsetY + 7 * step - gap;

  const shades = heatmapShades(colors.heatmapEmpty, color);
  const end = fromDateKey(endDate);
  const firstMonday = addDays(startOfWeek(end), -(weeks - 1) * 7);

  const cells: React.ReactNode[] = [];
  const monthLabels: React.ReactNode[] = [];
  let lastMonth = -1;

  for (let col = 0; col < weeks; col++) {
    const weekStart = addDays(firstMonday, col * 7);
    if (showMonthLabels && weekStart.getMonth() !== lastMonth) {
      // Skip a label squeezed against the left edge by the previous month's.
      if (col < weeks - 2 || lastMonth === -1) {
        monthLabels.push(
          <SvgText key={`m${col}`} x={offsetX + col * step} y={11} fontSize={10} fill={colors.textTertiary}>
            {formatMonthShort(weekStart)}
          </SvgText>,
        );
      }
      lastMonth = weekStart.getMonth();
    }
    for (let row = 0; row < 7; row++) {
      const date = addDays(weekStart, row);
      if (date > end) break;
      const key = toDateKey(date);
      const ratio = getRatio(key);
      const isEnd = key === endDate;
      cells.push(
        <Rect
          key={key}
          x={offsetX + col * step}
          y={offsetY + row * step}
          width={cell}
          height={cell}
          rx={cell * 0.28}
          fill={ratio === null ? colors.heatmapEmpty : shades[heatmapLevel(ratio)]}
          opacity={ratio === null ? 0.45 : 1}
          stroke={isEnd ? color : undefined}
          strokeWidth={isEnd ? 1.5 : 0}
        />,
      );
    }
  }

  const fitsWidth = cellSize === undefined;
  const ready = !fitsWidth || measuredWidth > 0;
  const onLayout = (e: LayoutChangeEvent) => setMeasuredWidth(e.nativeEvent.layout.width);

  return (
    <View
      onLayout={fitsWidth ? onLayout : undefined}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      // Until measured, reserve roughly the right height to avoid a layout jump.
      style={fitsWidth ? { width: '100%', ...(ready ? { height } : { aspectRatio: weeks / 7 }) } : undefined}>
      {ready && (
        <Svg width={width} height={height}>
          {monthLabels}
          {showWeekdayLabels &&
            Object.entries(WEEKDAY_LABELS).map(([row, label]) => (
              <SvgText
                key={label}
                x={0}
                y={offsetY + Number(row) * step + cell * 0.8}
                fontSize={9}
                fill={colors.textTertiary}>
                {label}
              </SvgText>
            ))}
          {cells}
        </Svg>
      )}
    </View>
  );
}
