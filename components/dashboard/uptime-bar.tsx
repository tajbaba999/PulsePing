"use client"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface UptimeDay {
  date: string
  status: "up" | "degraded" | "down"
  uptime: number
}

interface UptimeBarProps {
  data: UptimeDay[]
}

const statusColors = {
  up: "bg-emerald-500",
  degraded: "bg-yellow-500",
  down: "bg-red-500",
}

export function UptimeBar({ data }: UptimeBarProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No uptime data available yet. Data will appear after health checks run.
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="flex gap-0.5">
          {data.map((day, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div className={cn("h-8 flex-1 rounded-sm cursor-pointer", statusColors[day.status])} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{day.date}</p>
                <p className="text-xs text-muted-foreground">{day.uptime}% uptime</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>30 days ago</span>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
            <span className="text-muted-foreground">Operational</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-yellow-500" />
            <span className="text-muted-foreground">Degraded</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-red-500" />
            <span className="text-muted-foreground">Down</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
