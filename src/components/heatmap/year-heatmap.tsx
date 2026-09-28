import { useRef } from 'react';
import { ScrollView } from 'react-native';

import { Heatmap, type HeatmapProps } from './heatmap';

type YearHeatmapProps = Omit<HeatmapProps, 'weeks' | 'cellSize' | 'showMonthLabels' | 'showWeekdayLabels'>;

/** A full year of weeks in a horizontal scroller that opens on the most recent week. */
export function YearHeatmap(props: YearHeatmapProps) {
  const scrollRef = useRef<ScrollView>(null);
  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}>
      <Heatmap {...props} weeks={53} cellSize={13} gap={3} showMonthLabels showWeekdayLabels />
    </ScrollView>
  );
}
