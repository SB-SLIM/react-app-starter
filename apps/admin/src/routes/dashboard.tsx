import { createFileRoute, redirect } from '@tanstack/react-router'
import {
  Building2,
  Globe,
  MapPin,
  Plane,
  Users,
  Wallet,
  Wifi,
  WifiOff,
} from 'lucide-react'
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type ColumnDef,
  DataTable,
  SbAreaChart,
  SbBarChart,
  StatCard,
} from '@sb-codex/ui-components'
import { trpc } from '@/app/trpc'
import { authClient } from '@/features/auth/api/authClient'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const session = await authClient.getSession()
    if (!session) throw redirect({ to: '/sign-in' })
  },
  component: DashboardPage,
})

// ── Mock data (travel agency — replace with tRPC queries as endpoints land) ─────

const bookingsByMonth = [
  { month: 'Jan', bookings: 84 },
  { month: 'Feb', bookings: 96 },
  { month: 'Mar', bookings: 120 },
  { month: 'Apr', bookings: 142 },
  { month: 'May', bookings: 188 },
  { month: 'Jun', bookings: 240 },
  { month: 'Jul', bookings: 312 },
  { month: 'Aug', bookings: 358 },
  { month: 'Sep', bookings: 226 },
  { month: 'Oct', bookings: 174 },
  { month: 'Nov', bookings: 132 },
  { month: 'Dec', bookings: 198 },
]

const revenueByMonth = [
  { month: 'Jan', revenue: 62000, refunds: 4200 },
  { month: 'Feb', revenue: 71000, refunds: 3800 },
  { month: 'Mar', revenue: 88000, refunds: 5100 },
  { month: 'Apr', revenue: 104000, refunds: 6000 },
  { month: 'May', revenue: 132000, refunds: 7400 },
  { month: 'Jun', revenue: 168000, refunds: 9100 },
  { month: 'Jul', revenue: 214000, refunds: 11200 },
  { month: 'Aug', revenue: 246000, refunds: 12800 },
  { month: 'Sep', revenue: 158000, refunds: 8600 },
  { month: 'Oct', revenue: 121000, refunds: 6900 },
  { month: 'Nov', revenue: 94000, refunds: 5200 },
  { month: 'Dec', revenue: 139000, refunds: 7300 },
]

const topDestinations = [
  { city: 'Istanbul', country: 'Turkey', bookings: 184, share: 18 },
  { city: 'Paris', country: 'France', bookings: 156, share: 15 },
  { city: 'Dubai', country: 'UAE', bookings: 142, share: 14 },
  { city: 'Rome', country: 'Italy', bookings: 98, share: 10 },
  { city: 'Barcelona', country: 'Spain', bookings: 76, share: 7 },
]

type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled'

type Booking = {
  ref: string
  traveler: string
  destination: string
  departure: string
  pax: number
  status: BookingStatus
  amount: number
}

const recentBookings: Booking[] = [
  {
    ref: 'TRV-2041',
    traveler: 'Sami Gharbi',
    destination: 'Istanbul, TR',
    departure: '2026-06-18',
    pax: 2,
    status: 'Confirmed',
    amount: 2480,
  },
  {
    ref: 'TRV-2040',
    traveler: 'Leïla Ben Salah',
    destination: 'Paris, FR',
    departure: '2026-06-22',
    pax: 1,
    status: 'Pending',
    amount: 1190,
  },
  {
    ref: 'TRV-2039',
    traveler: 'Karim Toumi',
    destination: 'Dubai, AE',
    departure: '2026-07-02',
    pax: 4,
    status: 'Confirmed',
    amount: 6320,
  },
  {
    ref: 'TRV-2038',
    traveler: 'Nadia Mansour',
    destination: 'Rome, IT',
    departure: '2026-06-15',
    pax: 2,
    status: 'Cancelled',
    amount: 1740,
  },
  {
    ref: 'TRV-2037',
    traveler: 'Youssef Khelifi',
    destination: 'Barcelona, ES',
    departure: '2026-07-09',
    pax: 3,
    status: 'Confirmed',
    amount: 2910,
  },
]

const statusVariant: Record<BookingStatus, 'success' | 'warning' | 'danger'> = {
  Confirmed: 'success',
  Pending: 'warning',
  Cancelled: 'danger',
}

function formatTnd(n: number) {
  return `${n.toLocaleString('en-US')} TND`
}

function formatMoneyAxis(v: unknown) {
  const n = Number(v ?? 0)
  return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n)
}

function formatNum(v: unknown) {
  const n = Number(v ?? 0)
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

const bookingColumns: ColumnDef<Booking>[] = [
  {
    accessorKey: 'ref',
    header: 'Ref',
    cell: ({ row }) => (
      <span className="font-medium text-gray-900 dark:text-gray-100">
        {row.original.ref}
      </span>
    ),
  },
  { accessorKey: 'traveler', header: 'Traveler' },
  { accessorKey: 'destination', header: 'Destination' },
  { accessorKey: 'departure', header: 'Departure' },
  {
    accessorKey: 'pax',
    header: 'Pax',
    meta: {
      className: 'text-center tabular-nums',
      headerClassName: 'text-center',
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => formatTnd(row.original.amount),
    meta: {
      className: 'text-right font-medium tabular-nums',
      headerClassName: 'text-right',
    },
  },
]

// ── Page ───────────────────────────────────────────────────────────────────────

function DashboardPage() {
  const stats = trpc.dashboard.stats.useQuery()

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Agency Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Bookings overview — June 2026
          </p>
        </div>
        <HealthBadge />
      </div>

      {/* Workspace stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Workspace Clients"
          value={stats.data ? String(stats.data.clients) : '—'}
          icon={<Building2 className="h-4 w-4" />}
        />
        <StatCard
          label="Workspace Members"
          value={stats.data ? String(stats.data.members) : '—'}
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Bookings"
          value="2,470"
          delta="↑ 22% vs last month"
          deltaType="increase"
          icon={<Plane className="h-4 w-4" />}
        />
        <StatCard
          label="Revenue (YTD)"
          value="1.6M TND"
          delta="↑ 18% vs last year"
          deltaType="increase"
          icon={<Wallet className="h-4 w-4" />}
        />
        <StatCard
          label="Active Travelers"
          value="342"
          delta="↑ 9% vs last month"
          deltaType="increase"
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="Destinations"
          value="58"
          delta="4 new this quarter"
          deltaType="neutral"
          icon={<Globe className="h-4 w-4" />}
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bookings per Month</CardTitle>
            <CardDescription>Jan – Dec 2026</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <SbBarChart
                data={bookingsByMonth}
                barProps={{ dataKey: 'bookings' }}
                xAxis={{ dataKey: 'month' }}
                format={formatNum}
                withKpi
                highlightCurrentMonth
                withMaxValueColor
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Gross revenue vs refunds (TND)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <SbAreaChart
                data={revenueByMonth}
                areas={[
                  { dataKey: 'revenue', label: 'Revenue' },
                  { dataKey: 'refunds', label: 'Refunds', fillOpacity: 0.15 },
                ]}
                xAxis={{ dataKey: 'month' }}
                format={formatMoneyAxis}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent bookings + Top destinations */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest 5 reservations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={bookingColumns}
              data={recentBookings}
              enableGlobalFilter={false}
              emptyMessage="No bookings yet."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Destinations</CardTitle>
            <CardDescription>By bookings this year</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topDestinations.map((d) => (
              <div key={d.city} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 font-medium text-gray-900 dark:text-gray-100">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    {d.city}
                    <span className="font-normal text-gray-400">
                      · {d.country}
                    </span>
                  </span>
                  <span className="tabular-nums text-gray-500 dark:text-gray-400">
                    {d.bookings}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-primary-600 dark:bg-primary-500"
                    style={{ width: `${d.share * 5}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ── Health badge ───────────────────────────────────────────────────────────────

function HealthBadge() {
  const ping = trpc.health.ping.useQuery(undefined, {
    refetchInterval: 10_000,
  })

  if (ping.isPending) {
    return (
      <Badge variant="secondary" className="gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
        Connecting…
      </Badge>
    )
  }
  if (ping.isError) {
    return (
      <Badge variant="danger" className="gap-1.5">
        <WifiOff className="h-3 w-3" />
        Server unreachable
      </Badge>
    )
  }
  return (
    <Badge variant="success" className="gap-1.5">
      <Wifi className="h-3 w-3" />
      Server online
    </Badge>
  )
}
