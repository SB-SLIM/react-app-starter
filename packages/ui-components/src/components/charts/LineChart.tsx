'use client'

import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type XAxisProps,
  type YAxisProps,
} from 'recharts'
import { clsx } from 'clsx'
import { getPrimaryColor } from './theme'

type DataRecord = Record<string, unknown>

export type SbLineChartLine = {
  dataKey: string
  label?: string
  color?: string
  dashed?: boolean
}

export type SbLineChartProps<T extends DataRecord = DataRecord> = {
  data: T[]
  lines: SbLineChartLine[]
  xAxis?: XAxisProps
  yAxis?: YAxisProps
  format?: (value: unknown, key: string) => string
  showGrid?: boolean
  direction?: 'ltr' | 'rtl'
  className?: string
}

export function SbLineChart<T extends DataRecord = DataRecord>({
  data,
  lines,
  xAxis,
  yAxis,
  format = (v) => String(v ?? ''),
  showGrid = true,
  direction = 'ltr',
  className,
}: SbLineChartProps<T>) {
  const primary = getPrimaryColor()

  return (
    <div className={clsx('w-full h-full', className)} style={{ direction }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 15, right: 30, bottom: 5, left: 20 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              strokeOpacity={0.1}
            />
          )}
          <XAxis
            type="category"
            reversed={direction === 'rtl'}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            {...xAxis}
          />
          <YAxis
            type="number"
            orientation={direction === 'rtl' ? 'right' : 'left'}
            padding={{ top: 10 }}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            {...yAxis}
          />
          <Tooltip
            cursor={{ stroke: 'currentColor', strokeOpacity: 0.1 }}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid var(--color-border, #e5e7eb)',
              background: 'var(--color-background, white)',
              fontSize: 12,
            }}
            formatter={(v, key) => [format(v, String(key)), key]}
          />
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              dataKey={line.dataKey}
              name={line.label ?? line.dataKey}
              stroke={line.color ?? primary}
              strokeWidth={2}
              strokeDasharray={line.dashed ? '4 4' : undefined}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}
