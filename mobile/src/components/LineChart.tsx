import React from "react";
import { View } from "react-native";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Line,
  Circle,
} from "react-native-svg";
import { Colors } from "../theme";

interface LineChartProps {
  data: number[];
  width: number;
  height: number;
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
  showDot?: boolean;
  strokeWidth?: number;
}

function normalize(data: number[], height: number, padding: number = 8): number[] {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  return data.map((v) => padding + ((max - v) / range) * (height - padding * 2));
}

export function LineChart({
  data,
  width,
  height,
  color = Colors.primary,
  gradientFrom,
  gradientTo,
  showDot = true,
  strokeWidth = 2.5,
}: LineChartProps) {
  if (!data || data.length < 2) return <View style={{ width, height }} />;

  const gradId = "lcg";
  const padding = 8;
  const xStep = (width - padding * 2) / (data.length - 1);
  const ys = normalize(data, height, padding);

  // Build smooth cubic bezier path
  const points = data.map((_, i) => ({
    x: padding + i * xStep,
    y: ys[i],
  }));

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpX = (prev.x + curr.x) / 2;
    d += ` C ${cpX} ${prev.y} ${cpX} ${curr.y} ${curr.x} ${curr.y}`;
  }

  // Area fill path (close back to bottom)
  const last = points[points.length - 1];
  const first = points[0];
  const areaD =
    d +
    ` L ${last.x} ${height} L ${first.x} ${height} Z`;

  const useGradient = !!(gradientFrom && gradientTo);

  return (
    <Svg width={width} height={height}>
      {useGradient && (
        <Defs>
          <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={gradientFrom} stopOpacity="0.35" />
            <Stop offset="1" stopColor={gradientTo ?? gradientFrom} stopOpacity="0" />
          </LinearGradient>
        </Defs>
      )}

      {/* Area fill */}
      {useGradient && (
        <Path d={areaD} fill={`url(#${gradId})`} />
      )}

      {/* Line */}
      <Path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dot at last point */}
      {showDot && (
        <>
          <Circle
            cx={last.x}
            cy={last.y}
            r={5}
            fill={color}
            opacity={0.25}
          />
          <Circle cx={last.x} cy={last.y} r={3} fill={color} />
        </>
      )}
    </Svg>
  );
}

// ─── SparkLine ────────────────────────────────────────────────────────────────
// Tiny inline version used in stock list rows

interface SparkLineProps {
  data: number[];
  width?: number;
  height?: number;
  positive?: boolean;
}

export function SparkLine({
  data,
  width = 56,
  height = 24,
  positive = true,
}: SparkLineProps) {
  if (!data || data.length < 2) return <View style={{ width, height }} />;

  const color = positive ? Colors.success : Colors.error;
  const padding = 2;
  const xStep = (width - padding * 2) / (data.length - 1);
  const ys = normalize(data, height, padding);

  const points = data.map((_, i) => ({
    x: padding + i * xStep,
    y: ys[i],
  }));

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpX = (prev.x + curr.x) / 2;
    d += ` C ${cpX} ${prev.y} ${cpX} ${curr.y} ${curr.x} ${curr.y}`;
  }

  return (
    <Svg width={width} height={height}>
      <Path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
