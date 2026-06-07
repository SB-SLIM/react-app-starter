'use client'

import { useState } from 'react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Breadcrumb,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardUser,
  Checkbox,
  type ColumnDef,
  Combobox,
  ConfirmDialog,
  DataTable,
  DatePicker,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  Input,
  Label,
  PageHeader,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SbAreaChart,
  SbBarChart,
  SbLineChart,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  Spinner,
  StatCard,
  Stepper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  toast,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useModal,
  useStepper,
  useTheme,
} from '@sb-codex/ui-components'
import { MoreHorizontal } from 'lucide-react'
import { monthlyRevenue, pageViews, teamMembers, userGrowth } from './mockData'

type Invoice = (typeof invoices)[number]

const invoiceColumns: ColumnDef<Invoice>[] = [
  { accessorKey: 'id', header: 'Invoice' },
  { accessorKey: 'client', header: 'Client' },
  { accessorKey: 'date', header: 'Date' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <span
        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[row.original.status]}`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    meta: {
      className: 'text-right font-medium',
      headerClassName: 'text-right',
    },
  },
  {
    id: 'actions',
    header: '',
    enableSorting: false,
    enableGlobalFilter: false,
    meta: { headerClassName: 'w-12' },
    cell: () => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Row actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
]

const invoices = [
  {
    id: 'INV-001',
    client: 'Acme Corp',
    amount: '$4,200',
    status: 'Paid',
    date: '2026-05-12',
  },
  {
    id: 'INV-002',
    client: 'Globex Inc',
    amount: '$1,850',
    status: 'Pending',
    date: '2026-05-20',
  },
  {
    id: 'INV-003',
    client: 'Initech',
    amount: '$3,100',
    status: 'Paid',
    date: '2026-05-28',
  },
  {
    id: 'INV-004',
    client: 'Umbrella Ltd',
    amount: '$780',
    status: 'Overdue',
    date: '2026-04-30',
  },
  {
    id: 'INV-005',
    client: 'Stark Industries',
    amount: '$9,600',
    status: 'Paid',
    date: '2026-06-02',
  },
]

const statusColors: Record<string, string> = {
  Paid: 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950',
  Pending:
    'text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950',
  Overdue: 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950',
}

const checkoutSteps = [
  { label: 'Cart', description: 'Review items' },
  { label: 'Shipping', description: 'Address' },
  { label: 'Payment', description: 'Card details' },
  { label: 'Confirm', description: 'Place order' },
]

const comboboxOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'billing', label: 'Billing Manager' },
  { value: 'support', label: 'Support Agent' },
  { value: 'developer', label: 'Developer' },
]

function formatMoney(v: unknown) {
  const n = Number(v ?? 0)
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`
}

function formatNum(v: unknown) {
  const n = Number(v ?? 0)
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

// ── Section wrapper ────────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        {title}
      </h2>
      {children}
    </section>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export function ShowcasePage() {
  const { theme, toggleTheme } = useTheme()
  const [checked, setChecked] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [comboValue, setComboValue] = useState<string | undefined>('member')
  const [dateValue, setDateValue] = useState<Date | undefined>(
    () => new Date('2026-06-07'),
  )
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [page, setPage] = useState(1)
  const stepper = useStepper(checkoutSteps.length)
  const modal = useModal<'edit' | 'remove', (typeof teamMembers)[number]>([
    'edit',
    'remove',
  ])

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-6 py-10">
      <PageHeader
        title="Component Showcase"
        description="All ui-components rendered with mock data — visual reference for the design system."
        actions={
          <>
            <Badge variant="secondary">ui-components</Badge>
            <Button size="sm">Export</Button>
          </>
        }
      />

      {/* ── Stats ── */}
      <Section title="Stat Cards">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Revenue"
            value="$287.4k"
            delta="↑ 18% vs last month"
            deltaType="increase"
          />
          <StatCard
            label="Active Users"
            value="2,700"
            delta="↑ 13% vs last month"
            deltaType="increase"
          />
          <StatCard
            label="Churn Rate"
            value="2.4%"
            delta="↓ 0.3% vs last month"
            deltaType="decrease"
          />
          <StatCard
            label="Avg. Session"
            value="4m 12s"
            delta="No change"
            deltaType="neutral"
          />
        </div>
      </Section>

      <Separator />

      {/* ── Charts ── */}
      <Section title="Charts">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <SbBarChart
                  data={monthlyRevenue}
                  barProps={{ dataKey: 'revenue' }}
                  xAxis={{ dataKey: 'month' }}
                  format={formatMoney}
                  withKpi
                  highlightCurrentMonth
                  withMaxValueColor
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <SbLineChart
                  data={userGrowth}
                  lines={[
                    { dataKey: 'users', label: 'Total users' },
                    { dataKey: 'active', label: 'Active users', dashed: true },
                  ]}
                  xAxis={{ dataKey: 'month' }}
                  format={formatNum}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Page Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <SbAreaChart
                  data={pageViews}
                  areas={[
                    { dataKey: 'views', label: 'Total views' },
                    {
                      dataKey: 'unique',
                      label: 'Unique visitors',
                      fillOpacity: 0.15,
                    },
                  ]}
                  xAxis={{ dataKey: 'month' }}
                  format={formatNum}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Separator />

      {/* ── Table ── */}
      <Section title="Table">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                      {inv.id}
                    </TableCell>
                    <TableCell>{inv.client}</TableCell>
                    <TableCell>{inv.date}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[inv.status]}`}
                      >
                        {inv.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {inv.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} className="text-gray-500">
                    5 invoices
                  </TableCell>
                  <TableCell className="text-right">$19,530</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </Section>

      <Separator />

      {/* ── DataTable ── */}
      <Section title="DataTable (search + sort + pagination)">
        <DataTable
          columns={invoiceColumns}
          data={invoices}
          pageSize={3}
          searchPlaceholder="Search invoices…"
        />
        <DataTable
          columns={invoiceColumns}
          data={[]}
          enableGlobalFilter={false}
          emptyMessage="No invoices yet."
        />
      </Section>

      <Separator />

      {/* ── Breadcrumb ── */}
      <Section title="Breadcrumb">
        <Breadcrumb
          items={[
            { label: 'Home', href: '#' },
            { label: 'Workspace', href: '#' },
            { label: 'Invoices' },
          ]}
        />
      </Section>

      {/* ── Pagination ── */}
      <Section title="Pagination">
        <Pagination
          page={page}
          pageSize={10}
          total={87}
          onPageChange={setPage}
        />
      </Section>

      {/* ── Dropdown Menu ── */}
      <Section title="Dropdown Menu">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      {/* ── Spinner ── */}
      <Section title="Spinner">
        <div className="flex items-center gap-6">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Button disabled>
            <Spinner size="sm" className="mr-2" />
            Loading…
          </Button>
        </div>
      </Section>

      {/* ── Confirm Dialog ── */}
      <Section title="Confirm Dialog">
        <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
          Delete item
        </Button>
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Delete this item?"
          description="This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={() => setConfirmOpen(false)}
        />
      </Section>

      {/* ── Popover ── */}
      <Section title="Popover">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <p className="text-sm font-medium">Dimensions</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              A floating panel anchored to its trigger — holds any content.
            </p>
          </PopoverContent>
        </Popover>
      </Section>

      {/* ── Stepper (+ useStepper) ── */}
      <Section title="Stepper">
        <Stepper steps={checkoutSteps} currentStep={stepper.step} />
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={stepper.prev}
            disabled={stepper.isFirst}
          >
            Back
          </Button>
          <Button onClick={stepper.next} disabled={stepper.isLast}>
            {stepper.isLast ? 'Done' : 'Next'}
          </Button>
        </div>
      </Section>

      {/* ── useModal (one hook, many modals, typed per-modal data) ── */}
      <Section title="useModal">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          A single <code>useModal</code> drives both dialogs. Each row passes
          its member object to <code>open(key, data)</code>; the dialog reads it
          back from <code>modal.state[key]</code>.
        </p>
        <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-700">
          {teamMembers.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {m.firstName} {m.lastName}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => modal.open('edit', m)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => modal.open('remove', m)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Dialog
          open={modal.isOpen('edit')}
          onOpenChange={(o) => !o && modal.close('edit')}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Edit {modal.state.edit?.firstName} {modal.state.edit?.lastName}
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Role: {modal.state.edit?.description ?? '—'}
            </p>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={modal.isOpen('remove')}
          onOpenChange={(o) => !o && modal.close('remove')}
          title={`Remove ${modal.state.remove?.firstName ?? ''} ${
            modal.state.remove?.lastName ?? ''
          }?`}
          description="They will lose access to this workspace."
          confirmLabel="Remove"
          onConfirm={() => modal.close('remove')}
        />
      </Section>

      {/* ── Toasts ── */}
      <Section title="Toasts">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() =>
              toast('Booking saved', { description: 'Changes are live.' })
            }
          >
            Default
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.success('Payment received')}
          >
            Success
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.error('Something went wrong')}
          >
            Error
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast('Trip confirmed', {
                action: { label: 'Undo', onClick: () => {} },
              })
            }
          >
            With action
          </Button>
        </div>
      </Section>

      <Separator />

      {/* ── Badges & Buttons ── */}
      <Section title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Separator />

      {/* ── Avatars ── */}
      <Section title="Avatars">
        <div className="flex items-center gap-4">
          <TooltipProvider>
            {teamMembers.map((m) => (
              <Tooltip key={m.id}>
                <TooltipTrigger>
                  <Avatar>
                    <AvatarImage
                      src={m.avatarUrl}
                      alt={`${m.firstName} ${m.lastName}`}
                    />
                    <AvatarFallback>
                      {m.firstName[0]}
                      {m.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  {m.firstName} {m.lastName} · {m.description}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
          <Avatar className="h-16 w-16">
            <AvatarFallback>LG</AvatarFallback>
          </Avatar>
          <Avatar className="h-8 w-8">
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
        </div>
      </Section>

      {/* ── CardUser ── */}
      <Section title="Team Cards">
        <div className="grid gap-4 sm:grid-cols-3">
          {teamMembers.map((m) => (
            <CardUser
              key={m.id}
              firstName={m.firstName}
              lastName={m.lastName}
              avatarUrl={m.avatarUrl}
              description={m.description}
            />
          ))}
        </div>
      </Section>

      <Separator />

      {/* ── Form Controls ── */}
      <Section title="Form Controls">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email-demo">Email</Label>
              <Input
                id="email-demo"
                type="email"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bio-demo">Bio</Label>
              <Textarea
                id="bio-demo"
                placeholder="Tell us about yourself…"
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role-select-demo">Role (Select)</Label>
              <Select>
                <SelectTrigger id="role-select-demo">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Role (Combobox)</Label>
              <Combobox
                options={comboboxOptions}
                value={comboValue}
                onChange={setComboValue}
                placeholder="Search roles…"
                clearable
              />
            </div>
            <div className="space-y-1.5">
              <Label>Date Picker</Label>
              <DatePicker value={dateValue} onChange={setDateValue} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Checkbox
                id="notify-demo"
                checked={checked}
                onCheckedChange={(v) => setChecked(Boolean(v))}
              />
              <Label htmlFor="notify-demo">Email notifications</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="dark-demo"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
              <Label htmlFor="dark-demo">Dark mode</Label>
            </div>
            <Separator />
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Example Dialog</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This is a dialog powered by Radix UI primitives with Tailwind
                  styling.
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Section>

      <Separator />

      {/* ── Tabs ── */}
      <Section title="Tabs">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Overview tab content — workspace summary, recent activity.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Analytics tab — key metrics and cohort data.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Settings tab — workspace configuration.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Section>

      <Separator />

      {/* ── Skeleton ── */}
      <Section title="Skeleton Loaders">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="space-y-3 pt-6">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Empty State ── */}
      <Section title="Empty State">
        <Card>
          <CardContent>
            <EmptyState
              icon={<span className="text-2xl">📭</span>}
              title="No results found"
              description="Try adjusting your filters or search query."
              action={<Button variant="outline">Clear filters</Button>}
            />
          </CardContent>
        </Card>
      </Section>
    </div>
  )
}
