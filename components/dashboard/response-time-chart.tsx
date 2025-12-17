"use client"

import { ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts"

interface ResponseTimeDataPoint {
  time: string
  responseTime: number
  timestamp?: string
}

interface ResponseTimeChartProps {
  data: ResponseTimeDataPoint[]
}

export function ResponseTimeChart({ data }: ResponseTimeChartProps) {
  // Filter out zero values for a cleaner chart
  const hasData = data.some(d => d.responseTime > 0)

  if (!hasData) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No response time data available yet. Data will appear after health checks run.
      </div>
    )
  }

  // Calculate stats
  const validData = data.filter(d => d.responseTime > 0)
  const avgResponseTime = validData.length > 0
    ? Math.round(validData.reduce((sum, d) => sum + d.responseTime, 0) / validData.length)
    : 0
  const maxResponseTime = validData.length > 0
    ? Math.max(...validData.map(d => d.responseTime))
    : 0
  const minResponseTime = validData.length > 0
    ? Math.min(...validData.map(d => d.responseTime))
    : 0

  return (
    <div className="space-y-4">
      {/* Stats summary */}
      <div className="flex gap-6 text-sm">
        <div>
          <span className="text-muted-foreground">Avg: </span>
          <span className="font-medium">{avgResponseTime}ms</span>
        </div>
        <div>
          <span className="text-muted-foreground">Min: </span>
          <span className="font-medium text-emerald-500">{minResponseTime}ms</span>
        </div>
        <div>
          <span className="text-muted-foreground">Max: </span>
          <span className="font-medium text-yellow-500">{maxResponseTime}ms</span>
        </div>
        <div>
          <span className="text-muted-foreground">Total checks: </span>
          <span className="font-medium">{validData.length}</span>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="responseTimeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.3} />
            <XAxis
              dataKey="time"
              className="text-muted-foreground"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis
              className="text-muted-foreground"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}ms`}
              width={55}
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-lg">
                      <p className="text-sm font-medium">{payload[0].payload.time}</p>
                      <p className="text-sm text-muted-foreground">
                        Response: <span className="font-medium text-foreground">{payload[0].value}ms</span>
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="responseTime"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#responseTimeGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#10b981" }}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
