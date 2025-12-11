"use client"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Generate mock uptime data for 30 days
const uptimeData = Array.from({ length: 30 }, (_, i) => {
  const random = Math.random()
  let status: "up" | "degraded" | "down"
  let uptime: number

  if (random > 0.95) {
    status = "down"
    uptime = Math.floor(Math.random() * 50) + 50
  } else if (random > 0.85) {
    status = "degraded"
    uptime = Math.floor(Math.random() * 10) + 90
  } else {
    status = "up"
    uptime = Math.floor(Math.random() * 2) + 99
  }

  return {
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    status,
    uptime,
  }
})

const statusColors = {
  up: "bg-emerald-500",
  degraded: "bg-yellow-500",
  down: "bg-red-500",
}

export function UptimeBar() {
  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="flex gap-0.5">
          {uptimeData.map((day, index) => (
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
