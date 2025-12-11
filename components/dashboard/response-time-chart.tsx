"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { time: "00:00", responseTime: 145 },
  { time: "01:00", responseTime: 152 },
  { time: "02:00", responseTime: 138 },
  { time: "03:00", responseTime: 141 },
  { time: "04:00", responseTime: 135 },
  { time: "05:00", responseTime: 148 },
  { time: "06:00", responseTime: 156 },
  { time: "07:00", responseTime: 167 },
  { time: "08:00", responseTime: 189 },
  { time: "09:00", responseTime: 245 },
  { time: "10:00", responseTime: 312 },
  { time: "11:00", responseTime: 198 },
  { time: "12:00", responseTime: 156 },
  { time: "13:00", responseTime: 142 },
  { time: "14:00", responseTime: 138 },
  { time: "15:00", responseTime: 145 },
  { time: "16:00", responseTime: 152 },
  { time: "17:00", responseTime: 148 },
  { time: "18:00", responseTime: 144 },
  { time: "19:00", responseTime: 139 },
  { time: "20:00", responseTime: 136 },
  { time: "21:00", responseTime: 142 },
  { time: "22:00", responseTime: 138 },
  { time: "23:00", responseTime: 135 },
]

export function ResponseTimeChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}ms`}
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
          <Line
            type="monotone"
            dataKey="responseTime"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "hsl(var(--chart-1))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
