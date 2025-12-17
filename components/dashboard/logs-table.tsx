"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  statusCode: number | null
  responseTime: number | null
  success: boolean
  message: string | null
  result: 'success' | 'failure'
}

interface LogsTableProps {
  logs: LogEntry[]
  pageSize?: number
}

const resultConfig = {
  success: { label: "Success", variant: "default" },
  failure: { label: "Failed", variant: "destructive" },
} as const

export function LogsTable({ logs, pageSize = 10 }: LogsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(logs.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentLogs = logs.slice(startIndex, endIndex)

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No logs available yet. Health checks will appear here once they run.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Response Time</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentLogs.map((log) => {
              const config = resultConfig[log.result]
              const date = new Date(log.timestamp)
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
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">{formattedDate}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "font-mono text-sm",
                        log.statusCode && log.statusCode >= 200 && log.statusCode < 300 && "text-emerald-500",
                        log.statusCode && log.statusCode >= 400 && "text-red-500",
                      )}
                    >
                      {log.statusCode || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">
                      {log.responseTime && log.responseTime > 0 ? `${log.responseTime}ms` : "-"}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">
                    {log.message || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={config.variant as "default" | "destructive"}>
                      {config.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, logs.length)} of {logs.length} logs
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
