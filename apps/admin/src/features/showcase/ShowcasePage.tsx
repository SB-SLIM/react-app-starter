'use client'

import { useState } from 'react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardUser,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  EmptyState,
  Input,
  Label,
  PageHeader,
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
  StatCard,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@sb-codex/ui-components'
import { monthlyRevenue, pageViews, teamMembers, userGrowth } from './mockData'

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
  const [checked, setChecked] = useState(false)
  const [toggled, setToggled] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

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
              <Label htmlFor="role-demo">Role</Label>
              <Select>
                <SelectTrigger id="role-demo">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
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
                checked={toggled}
                onCheckedChange={setToggled}
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
