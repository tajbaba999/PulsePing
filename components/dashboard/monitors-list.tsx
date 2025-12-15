"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Loader2 } from "lucide-react"

interface Monitor {
  id: string
  name: string
  url: string
  frequency: number
  isActive: boolean
  project: {
    id: string
    name: string
  }
  _count: {
    monitorRuns: number
  }
  // Stats will be loaded separately
  uptime?: number
  avgResponseTime?: number
  lastStatus?: 'operational' | 'degraded' | 'down'
}

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
  unknown: {
    label: "Unknown",
    color: "bg-gray-500",
    badge: "secondary",
  },
} as const

interface MonitorsListProps {
  limit?: number
  showAll?: boolean
}

interface MonitorWithStats extends Monitor {
  stats?: {
    uptime: number
    avgResponseTime: number
    lastStatus: 'operational' | 'down' | 'unknown'
  }
}

export function MonitorsList({ limit, showAll = false }: MonitorsListProps) {
  const [monitors, setMonitors] = useState<MonitorWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMonitors() {
      try {
        const response = await fetch('/api/monitor')
        if (!response.ok) throw new Error('Failed to fetch monitors')
        const data = await response.json()

        // Fetch stats for each monitor
        const monitorsWithStats = await Promise.all(
          (data.monitors || []).map(async (monitor: Monitor) => {
            try {
              const statsRes = await fetch(`/api/monitor/${monitor.id}/stats`)
              if (statsRes.ok) {
                const statsData = await statsRes.json()
                return {
                  ...monitor,
                  stats: statsData.stats
                }
              }
            } catch (e) {
              console.error(`Failed to fetch stats for monitor ${monitor.id}`)
            }
            return monitor
          })
        )

        setMonitors(monitorsWithStats)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load monitors')
      } finally {
        setLoading(false)
      }
    }

    fetchMonitors()
    // Refresh every 30 seconds
    const interval = setInterval(fetchMonitors, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        {error}
      </div>
    )
  }

  if (monitors.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No monitors yet.</p>
        <p className="text-sm">Create your first monitor to start tracking your APIs.</p>
      </div>
    )
  }

  const displayMonitors = limit ? monitors.slice(0, limit) : monitors

  return (
    <div className="space-y-3">
      {displayMonitors.map((monitor) => {
        const status = monitor.stats?.lastStatus || 'unknown'
        const config = statusConfig[status]
        const uptime = monitor.stats?.uptime ?? 0
        const responseTime = monitor.stats?.avgResponseTime ?? 0

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
                    <p className="text-sm font-medium">{uptime.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Uptime</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">{responseTime}ms</p>
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
