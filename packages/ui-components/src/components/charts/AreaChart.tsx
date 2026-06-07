'use client'

import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
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

export type SbAreaChartArea = {
  dataKey: string
  label?: string
  color?: string
  /** 0–1, default 0.2 */
  fillOpacity?: number
  stacked?: boolean
}

export type SbAreaChartProps<T extends DataRecord = DataRecord> = {
  data: T[]
  areas: SbAreaChartArea[]
  xAxis?: XAxisProps
  yAxis?: YAxisProps
  format?: (value: unknown, key: string) => string
  showGrid?: boolean
  direction?: 'ltr' | 'rtl'
  className?: string
}

export function SbAreaChart<T extends DataRecord = DataRecord>({
  data,
  areas,
  xAxis,
  yAxis,
  format = (v) => String(v ?? ''),
  showGrid = true,
  direction = 'ltr',
  className,
}: SbAreaChartProps<T>) {
  const primary = getPrimaryColor()

  return (
    <div className={clsx('w-full h-full', className)} style={{ direction }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          margin={{ top: 15, right: 30, bottom: 5, left: 20 }}
        >
          <defs>
            {areas.map((area) => {
              const color = area.color ?? primary
              return (
                <linearGradient
                  key={area.dataKey}
                  id={`grad-${area.dataKey}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={color}
                    stopOpacity={area.fillOpacity ?? 0.2}
                  />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              )
            })}
          </defs>

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
            contentStyle={{
              borderRadius: 8,
              border: '1px solid var(--color-border, #e5e7eb)',
              background: 'var(--color-background, white)',
              fontSize: 12,
            }}
            formatter={(v, key) => [format(v, String(key)), key]}
          />
          {areas.map((area) => {
            const color = area.color ?? primary
            return (
              <Area
                key={area.dataKey}
                type="monotone"
                dataKey={area.dataKey}
                name={area.label ?? area.dataKey}
                stroke={color}
                strokeWidth={2}
                fill={`url(#grad-${area.dataKey})`}
                stackId={area.stacked ? 'stack' : undefined}
                dot={false}
                activeDot={{ r: 4 }}
              />
            )
          })}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  )
}
