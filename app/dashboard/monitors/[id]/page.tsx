import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Pause, Trash2 } from "lucide-react"
import Link from "next/link"
import { ResponseTimeChart } from "@/components/dashboard/response-time-chart"
import { LogsTable } from "@/components/dashboard/logs-table"
import { UptimeBar } from "@/components/dashboard/uptime-bar"

// Mock data - in real app would come from params
const monitor = {
  id: "1",
  name: "Production API",
  url: "https://api.example.com/health",
  status: "operational",
  uptime: 99.92,
  avgResponseTime: 142,
  lastChecked: "30 seconds ago",
  frequency: "1 minute",
  alertEmail: "alerts@example.com",
  createdAt: "Dec 1, 2024",
}

const statusConfig = {
  operational: {
    label: "Operational",
    color: "bg-emerald-500",
    variant: "default",
  },
  degraded: {
    label: "Degraded",
    color: "bg-yellow-500",
    variant: "secondary",
  },
  down: {
    label: "Down",
    color: "bg-red-500",
    variant: "destructive",
  },
} as const

export default function MonitorDetailsPage() {
  const config = statusConfig[monitor.status as keyof typeof statusConfig]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/monitors">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{monitor.name}</h1>
              <Badge variant={config.variant as "default" | "secondary" | "destructive"}>{config.label}</Badge>
            </div>
            <p className="text-muted-foreground">{monitor.url}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Pause className="h-4 w-4" />
            Pause
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive bg-transparent">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monitor.uptime}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monitor.avgResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Check Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monitor.frequency}</div>
            <p className="text-xs text-muted-foreground">Interval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monitor.lastChecked}</div>
            <p className="text-xs text-muted-foreground">Status: OK</p>
          </CardContent>
        </Card>
      </div>

      {/* Uptime Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Uptime History</CardTitle>
          <CardDescription>Last 30 days availability</CardDescription>
        </CardHeader>
        <CardContent>
          <UptimeBar />
        </CardContent>
      </Card>

      {/* Response Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Response Time</CardTitle>
          <CardDescription>Average response time over the last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponseTimeChart />
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Logs</CardTitle>
          <CardDescription>Latest check results for this monitor</CardDescription>
        </CardHeader>
        <CardContent>
          <LogsTable />
        </CardContent>
      </Card>
    </div>
  )
}
