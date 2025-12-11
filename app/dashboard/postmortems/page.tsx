import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus } from "lucide-react"
import Link from "next/link"

const postmortems = [
  {
    id: "1",
    title: "Database Cluster Outage",
    monitor: "Database Cluster",
    date: "Dec 12, 2024",
    duration: "47 minutes",
    severity: "critical",
    status: "published",
  },
  {
    id: "2",
    title: "Payment Gateway Degradation",
    monitor: "Payment Gateway",
    date: "Dec 10, 2024",
    duration: "23 minutes",
    severity: "major",
    status: "published",
  },
  {
    id: "3",
    title: "Authentication Service SSL Error",
    monitor: "Authentication Service",
    date: "Dec 8, 2024",
    duration: "15 minutes",
    severity: "minor",
    status: "draft",
  },
  {
    id: "4",
    title: "CDN Latency Spike",
    monitor: "CDN Health",
    date: "Dec 5, 2024",
    duration: "8 minutes",
    severity: "minor",
    status: "published",
  },
]

const severityConfig = {
  critical: { label: "Critical", variant: "destructive" },
  major: { label: "Major", variant: "secondary" },
  minor: { label: "Minor", variant: "outline" },
} as const

export default function PostmortemsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Postmortems</h1>
          <p className="text-muted-foreground">Document and learn from incidents.</p>
        </div>
        <Link href="/dashboard/postmortems/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Postmortem
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Postmortems</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postmortems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postmortems.filter((p) => p.status === "published").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postmortems.filter((p) => p.status === "draft").length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Postmortems</CardTitle>
          <CardDescription>Review past incidents and their resolutions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {postmortems.map((postmortem) => {
              const severity = severityConfig[postmortem.severity as keyof typeof severityConfig]
              return (
                <Link
                  key={postmortem.id}
                  href={`/dashboard/postmortems/${postmortem.id}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{postmortem.title}</p>
                        {postmortem.status === "draft" && (
                          <Badge variant="outline" className="text-xs">
                            Draft
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {postmortem.monitor} • {postmortem.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{postmortem.duration}</p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                    <Badge variant={severity.variant as "destructive" | "secondary" | "outline"}>
                      {severity.label}
                    </Badge>
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
