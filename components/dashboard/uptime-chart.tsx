"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { time: "00:00", uptime: 99.9, responseTime: 145 },
  { time: "02:00", uptime: 99.8, responseTime: 152 },
  { time: "04:00", uptime: 100, responseTime: 138 },
  { time: "06:00", uptime: 99.9, responseTime: 141 },
  { time: "08:00", uptime: 99.7, responseTime: 167 },
  { time: "10:00", uptime: 98.5, responseTime: 245 },
  { time: "12:00", uptime: 99.2, responseTime: 189 },
  { time: "14:00", uptime: 99.9, responseTime: 142 },
  { time: "16:00", uptime: 100, responseTime: 135 },
  { time: "18:00", uptime: 99.8, responseTime: 148 },
  { time: "20:00", uptime: 99.9, responseTime: 144 },
  { time: "22:00", uptime: 100, responseTime: 139 },
]

export function UptimeChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[95, 100]}
            tickFormatter={(value) => `${value}%`}
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
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            fill="url(#uptimeGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
