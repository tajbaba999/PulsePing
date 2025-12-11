"use client"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

const logs = [
  {
    id: "1",
    timestamp: "2024-12-12 14:32:15",
    status: 200,
    responseTime: 142,
    location: "US-East",
    result: "success",
  },
  {
    id: "2",
    timestamp: "2024-12-12 14:31:15",
    status: 200,
    responseTime: 138,
    location: "EU-West",
    result: "success",
  },
  {
    id: "3",
    timestamp: "2024-12-12 14:30:15",
    status: 200,
    responseTime: 156,
    location: "US-West",
    result: "success",
  },
  {
    id: "4",
    timestamp: "2024-12-12 14:29:15",
    status: 503,
    responseTime: 0,
    location: "US-East",
    result: "failure",
  },
  {
    id: "5",
    timestamp: "2024-12-12 14:28:15",
    status: 200,
    responseTime: 245,
    location: "Asia-Pacific",
    result: "degraded",
  },
  {
    id: "6",
    timestamp: "2024-12-12 14:27:15",
    status: 200,
    responseTime: 134,
    location: "US-East",
    result: "success",
  },
  {
    id: "7",
    timestamp: "2024-12-12 14:26:15",
    status: 200,
    responseTime: 148,
    location: "EU-West",
    result: "success",
  },
  {
    id: "8",
    timestamp: "2024-12-12 14:25:15",
    status: 200,
    responseTime: 152,
    location: "US-West",
    result: "success",
  },
]

const resultConfig = {
  success: { label: "Success", variant: "default" },
  failure: { label: "Failed", variant: "destructive" },
  degraded: { label: "Slow", variant: "secondary" },
} as const

export function LogsTable() {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Response Time</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Result</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => {
            const config = resultConfig[log.result as keyof typeof resultConfig]
            return (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "font-mono text-sm",
                      log.status >= 200 && log.status < 300 && "text-emerald-500",
                      log.status >= 400 && "text-red-500",
                      log.status >= 500 && "text-red-500",
                    )}
                  >
                    {log.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">{log.responseTime > 0 ? `${log.responseTime}ms` : "-"}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">{log.location}</TableCell>
                <TableCell>
                  <Badge variant={config.variant as "default" | "destructive" | "secondary"}>{config.label}</Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
