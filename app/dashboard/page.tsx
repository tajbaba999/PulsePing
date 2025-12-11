import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import { MonitorsList } from "@/components/dashboard/monitors-list"
import { UptimeChart } from "@/components/dashboard/uptime-chart"

const stats = [
  {
    title: "Total Monitors",
    value: "24",
    description: "+2 this week",
    icon: Activity,
    trend: "up",
  },
  {
    title: "Operational",
    value: "21",
    description: "87.5% of monitors",
    icon: CheckCircle2,
    trend: "up",
  },
  {
    title: "Incidents",
    value: "3",
    description: "2 resolved today",
    icon: AlertTriangle,
    trend: "down",
  },
  {
    title: "Avg Response",
    value: "142ms",
    description: "-12ms from last week",
    icon: Clock,
    trend: "up",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Monitor your API health and performance at a glance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Uptime Overview</CardTitle>
            <CardDescription>Last 24 hours performance across all monitors</CardDescription>
          </CardHeader>
          <CardContent>
            <UptimeChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest monitor status changes</CardDescription>
          </CardHeader>
          <CardContent>
            <MonitorsList limit={5} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
