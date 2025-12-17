"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"

interface Alert {
  id: string
  monitorId: string
  monitorName: string
  monitorUrl: string
  type: string
  message: string
  statusCode: number | null
  responseTime: number | null
  createdAt: string
  status: string
}

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
} as const

interface AlertsListProps {
  filter?: "active" | "resolved"
}

export function AlertsList({ filter }: AlertsListProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const response = await fetch('/api/alerts')
        if (response.ok) {
          const data = await response.json()
          setAlerts(data.alerts || [])
        }
      } catch (err) {
        console.error('Failed to fetch alerts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const filteredAlerts = filter
    ? alerts.filter(alert => alert.status === filter)
    : alerts

  if (filteredAlerts.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
        <p>No alerts to show</p>
        <p className="text-sm">All your monitors are running smoothly!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filteredAlerts.map((alert) => {
        const config = typeConfig.down // All failures are "down" type
        const date = new Date(alert.createdAt)
        const formattedDate = date.toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })

        return (
          <div
            key={alert.id}
            className={cn(
              "flex items-start justify-between rounded-lg border p-4 transition-colors border-border bg-card hover:bg-muted/50"
            )}
          >
            <div className="flex gap-3">
              <config.icon className={cn("mt-0.5 h-5 w-5", config.color)} />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{alert.monitorName}</p>
                  <Badge variant={config.badge as "destructive"}>{config.label}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{formattedDate}</span>
                  {alert.statusCode && <span>Status: {alert.statusCode}</span>}
                  {alert.responseTime && <span>Response: {alert.responseTime}ms</span>}
                </div>
              </div>
            </div>
            <Link
              href={`/dashboard/monitors/${alert.monitorId}`}
              className="text-muted-foreground hover:text-foreground"
            >
              <span className="text-sm underline">View Monitor</span>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
