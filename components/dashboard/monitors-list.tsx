import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

const monitors = [
  {
    id: "1",
    name: "Production API",
    url: "api.example.com/health",
    status: "operational",
    uptime: 99.9,
    responseTime: 142,
    lastChecked: "30s ago",
  },
  {
    id: "2",
    name: "Authentication Service",
    url: "auth.example.com/status",
    status: "operational",
    uptime: 99.8,
    responseTime: 89,
    lastChecked: "15s ago",
  },
  {
    id: "3",
    name: "Payment Gateway",
    url: "payments.example.com/ping",
    status: "degraded",
    uptime: 98.5,
    responseTime: 456,
    lastChecked: "45s ago",
  },
  {
    id: "4",
    name: "CDN Health",
    url: "cdn.example.com/health",
    status: "operational",
    uptime: 100,
    responseTime: 23,
    lastChecked: "20s ago",
  },
  {
    id: "5",
    name: "Database Cluster",
    url: "db.example.com/status",
    status: "down",
    uptime: 97.2,
    responseTime: 0,
    lastChecked: "10s ago",
  },
  {
    id: "6",
    name: "Search Service",
    url: "search.example.com/health",
    status: "operational",
    uptime: 99.9,
    responseTime: 156,
    lastChecked: "25s ago",
  },
  {
    id: "7",
    name: "Email Service",
    url: "mail.example.com/status",
    status: "operational",
    uptime: 99.7,
    responseTime: 234,
    lastChecked: "35s ago",
  },
  {
    id: "8",
    name: "Analytics API",
    url: "analytics.example.com/ping",
    status: "operational",
    uptime: 99.95,
    responseTime: 112,
    lastChecked: "40s ago",
  },
]

const statusConfig = {
  operational: {
    label: "Operational",
    color: "bg-emerald-500",
    badge: "default",
  },
  degraded: {
    label: "Degraded",
    color: "bg-yellow-500",
    badge: "secondary",
  },
  down: {
    label: "Down",
    color: "bg-red-500",
    badge: "destructive",
  },
} as const

interface MonitorsListProps {
  limit?: number
  showAll?: boolean
}

export function MonitorsList({ limit, showAll = false }: MonitorsListProps) {
  const displayMonitors = limit ? monitors.slice(0, limit) : monitors

  return (
    <div className="space-y-3">
      {displayMonitors.map((monitor) => {
        const config = statusConfig[monitor.status]
        return (
          <Link
            key={monitor.id}
            href={`/dashboard/monitors/${monitor.id}`}
            className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <div className={cn("h-2.5 w-2.5 rounded-full", config.color)} />
              <div>
                <p className="font-medium">{monitor.name}</p>
                <p className="text-sm text-muted-foreground">{monitor.url}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-right">
              {showAll && (
                <>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium">{monitor.uptime}%</p>
                    <p className="text-xs text-muted-foreground">Uptime</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">{monitor.responseTime}ms</p>
                    <p className="text-xs text-muted-foreground">Response</p>
                  </div>
                </>
              )}
              <Badge variant={config.badge as "default" | "secondary" | "destructive"}>{config.label}</Badge>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
