import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { AlertTriangle, ArrowUpRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

const alerts = [
  {
    id: "1",
    monitor: "Database Cluster",
    type: "down",
    message: "Connection timeout - unable to reach endpoint",
    startedAt: "2024-12-12 14:28:00",
    resolvedAt: null,
    duration: "4m",
    status: "active",
  },
  {
    id: "2",
    monitor: "Payment Gateway",
    type: "degraded",
    message: "High response time detected (>500ms)",
    startedAt: "2024-12-12 14:15:00",
    resolvedAt: null,
    duration: "17m",
    status: "active",
  },
  {
    id: "3",
    monitor: "Search Service",
    type: "down",
    message: "HTTP 503 Service Unavailable",
    startedAt: "2024-12-12 13:45:00",
    resolvedAt: null,
    duration: "47m",
    status: "active",
  },
  {
    id: "4",
    monitor: "Production API",
    type: "down",
    message: "Connection refused",
    startedAt: "2024-12-12 12:30:00",
    resolvedAt: "2024-12-12 12:35:00",
    duration: "5m",
    status: "resolved",
  },
  {
    id: "5",
    monitor: "CDN Health",
    type: "degraded",
    message: "Elevated latency from EU regions",
    startedAt: "2024-12-12 11:00:00",
    resolvedAt: "2024-12-12 11:15:00",
    duration: "15m",
    status: "resolved",
  },
  {
    id: "6",
    monitor: "Authentication Service",
    type: "down",
    message: "SSL certificate error",
    startedAt: "2024-12-12 09:20:00",
    resolvedAt: "2024-12-12 09:45:00",
    duration: "25m",
    status: "resolved",
  },
  {
    id: "7",
    monitor: "Email Service",
    type: "degraded",
    message: "Slow response times",
    startedAt: "2024-12-12 08:00:00",
    resolvedAt: "2024-12-12 08:12:00",
    duration: "12m",
    status: "resolved",
  },
  {
    id: "8",
    monitor: "Analytics API",
    type: "down",
    message: "Database connection pool exhausted",
    startedAt: "2024-12-11 22:30:00",
    resolvedAt: "2024-12-11 22:45:00",
    duration: "15m",
    status: "resolved",
  },
]

const typeConfig = {
  down: {
    label: "Down",
    icon: AlertTriangle,
    color: "text-red-500",
    badge: "destructive",
  },
  degraded: {
    label: "Degraded",
    icon: AlertTriangle,
    color: "text-yellow-500",
    badge: "secondary",
  },
  recovered: {
    label: "Recovered",
    icon: CheckCircle2,
    color: "text-emerald-500",
    badge: "default",
  },
} as const

interface AlertsListProps {
  filter?: "active" | "resolved"
}

export function AlertsList({ filter }: AlertsListProps) {
  const filteredAlerts = filter ? alerts.filter((alert) => alert.status === filter) : alerts

  if (filteredAlerts.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <CheckCircle2 className="mx-auto mb-2 h-8 w-8" />
        <p>No alerts to show</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filteredAlerts.map((alert) => {
        const config = typeConfig[alert.type as keyof typeof typeConfig]
        return (
          <div
            key={alert.id}
            className={cn(
              "flex items-start justify-between rounded-lg border p-4 transition-colors",
              alert.status === "active" ? "border-destructive/50 bg-destructive/5" : "border-border bg-card",
            )}
          >
            <div className="flex gap-3">
              <config.icon className={cn("mt-0.5 h-5 w-5", config.color)} />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{alert.monitor}</p>
                  <Badge variant={config.badge as "default" | "secondary" | "destructive"}>{config.label}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Started: {alert.startedAt}</span>
                  {alert.resolvedAt && <span>Resolved: {alert.resolvedAt}</span>}
                  <span>Duration: {alert.duration}</span>
                </div>
              </div>
            </div>
            <Link href={`/dashboard/monitors/${alert.id}`}>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </Link>
          </div>
        )
      })}
    </div>
  )
}
