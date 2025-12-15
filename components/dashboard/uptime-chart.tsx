"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Loader2 } from "lucide-react"

interface ChartData {
  time: string
  uptime: number
  responseTime: number
}

interface UptimeChartProps {
  data?: ChartData[]
}

export function UptimeChart({ data: propData }: UptimeChartProps) {
  const [data, setData] = useState<ChartData[]>(propData || [])
  const [loading, setLoading] = useState(!propData)

  useEffect(() => {
    if (propData) {
      setData(propData)
      return
    }

    async function fetchData() {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const result = await response.json()
          setData(result.hourlyData || [])
        }
      } catch (err) {
        console.error('Failed to fetch uptime chart data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [propData])

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No data available yet. Create monitors to see uptime data.
      </div>
    )
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.3} />
          <XAxis
            dataKey="time"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'currentColor' }}
            className="text-muted-foreground"
          />
          <YAxis
            fontSize={10}
            tickLine={false}
            axisLine={false}
            domain={[90, 100]}
            tickFormatter={(value) => `${value}%`}
            width={40}
            tick={{ fill: 'currentColor' }}
            className="text-muted-foreground"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-3 shadow-lg">
                    <p className="text-sm font-medium">{payload[0].payload.time}</p>
                    <p className="text-sm text-muted-foreground">
                      Uptime: <span className="font-medium text-foreground">{payload[0].value}%</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Response: <span className="font-medium text-foreground">{payload[0].payload.responseTime}ms</span>
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="uptime"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#uptimeGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
