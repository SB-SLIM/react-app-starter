'use client'

import { useMemo } from 'react'
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type XAxisProps,
  type YAxisProps,
  type BarProps,
} from 'recharts'
import { clsx } from 'clsx'
import { getPrimaryColor, getPrimaryFaint } from './theme'

// ── Types ─────────────────────────────────────────────────────────────────────

type DataRecord = Record<string, unknown>

export type SbBarChartProps<T extends DataRecord = DataRecord> = {
  data: T[]
  /** Recharts Bar props — must include `dataKey` */
  barProps: Omit<BarProps, 'ref'> & { dataKey: string }
  xAxis?: XAxisProps
  yAxis?: YAxisProps
  /** Format a cell value for display (tooltip + label) */
  format?: (value: unknown, key: string) => string
  /** Show tooltip extra rows (accepted / pending / rejected sub-keys) */
  withKpi?: boolean
  direction?: 'ltr' | 'rtl'
  showGrid?: boolean
  /** Highlight the bar with the highest value */
  withMaxValueColor?: boolean
  /** Highlight the bar matching the current calendar month */
  highlightCurrentMonth?: boolean
  /** Show value label above each bar */
  showBarLabel?: boolean
  className?: string
}

// ── Custom tooltip ─────────────────────────────────────────────────────────────

type ChartPayloadEntry = {
  payload?: DataRecord
  fill?: string
  value?: number | string
  name?: string
}

type CustomTooltipProps = {
  active?: boolean
  payload?: readonly ChartPayloadEntry[]
  label?: string | number
  dataKey: string
  format: (value: unknown, key: string) => string
  withKpi?: boolean
}

function ChartTooltip({
  active,
  payload,
  label,
  dataKey,
  format,
  withKpi,
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  const entry = payload[0]
  const raw = entry?.payload as DataRecord | undefined

  return (
    <div className="rounded border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900 min-w-[160px]">
      {/* Label */}
      <p className="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </p>
      <div className="h-px bg-gray-100 dark:bg-gray-800 mb-2" />

      {/* Main value */}
      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: entry?.fill ?? 'currentColor' }}
        />
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {format(entry?.value, dataKey)}
        </span>
      </div>

      {/* KPI sub-rows */}
      {withKpi && raw && (
        <div className="mt-2 space-y-1">
          {(['accepted', 'pending', 'rejected'] as const).map((status) => {
            const subKey = `${dataKey}_${status}`
            const colors = {
              accepted: 'bg-green-500',
              pending: 'bg-yellow-500',
              rejected: 'bg-red-500',
            }
            return (
              <div
                key={status}
                className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
              >
                <span
                  className={clsx(
                    'inline-block h-2 w-2 rounded-full',
                    colors[status],
                  )}
                />
                <span className="capitalize">{status}</span>
                <span className="ml-auto font-semibold text-gray-900 dark:text-gray-100">
                  {format(raw[subKey], subKey)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getCurrentMonthIndex<T extends DataRecord>(
  data: T[],
  yearKey = 'year_index',
  monthKey = 'month_index',
): number {
  const now = new Date()
  const cy = now.getFullYear()
  const cm = now.getMonth() + 1
  return data.findIndex(
    (row) => Number(row[yearKey]) === cy && Number(row[monthKey]) === cm,
  )
}

// ── Component ──────────────────────────────────────────────────────────────────

export function SbBarChart<T extends DataRecord = DataRecord>({
  data,
  barProps,
  xAxis,
  yAxis,
  format = (v) => String(v ?? ''),
  withKpi,
  direction = 'ltr',
  showGrid = true,
  withMaxValueColor = false,
  highlightCurrentMonth = false,
  showBarLabel = false,
  className,
}: SbBarChartProps<T>) {
  const primary = getPrimaryColor()
  const primaryFaint = getPrimaryFaint()

  const maxValue = useMemo(
    () =>
      data.length
        ? Math.max(...data.map((row) => Number(row[barProps.dataKey] ?? 0)))
        : 0,
    [data, barProps.dataKey],
  )

  const currentMonthIdx = useMemo(
    () => (highlightCurrentMonth ? getCurrentMonthIndex(data) : -1),
    [data, highlightCurrentMonth],
  )

  function cellFill(entry: T, index: number): string {
    const isMax =
      withMaxValueColor && Number(entry[barProps.dataKey]) === maxValue
    const isCurrent = highlightCurrentMonth && index === currentMonthIdx
    return isMax || isCurrent ? primary : primaryFaint || `${primary}29`
  }

  return (
    <div className={clsx('w-full h-full', className)} style={{ direction }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          barSize={15}
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
            cursor={{ fill: 'currentColor', fillOpacity: 0.05 }}
            content={(props) => (
              <ChartTooltip
                active={props.active}
                payload={
                  props.payload as readonly ChartPayloadEntry[] | undefined
                }
                label={props.label}
                dataKey={barProps.dataKey}
                format={format}
                withKpi={withKpi}
              />
            )}
          />

          <Bar fill={primary} radius={[6, 6, 0, 0]} {...barProps}>
            {(withMaxValueColor || highlightCurrentMonth) &&
              data.map((entry, index) => (
                <Cell key={index} fill={cellFill(entry, index)} />
              ))}

            {showBarLabel && (
              <LabelList
                dataKey={barProps.dataKey}
                position="top"
                style={{ fontSize: 12, fontWeight: 500, fill: 'currentColor' }}
                formatter={(v: unknown) => format(v, barProps.dataKey)}
              />
            )}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
