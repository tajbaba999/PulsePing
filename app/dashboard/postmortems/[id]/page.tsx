import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Clock, Edit, ExternalLink, Users } from "lucide-react"
import Link from "next/link"

const postmortem = {
  id: "1",
  title: "Database Cluster Outage",
  monitor: "Database Cluster",
  date: "December 12, 2024",
  duration: "47 minutes",
  severity: "critical",
  status: "published",
  impact: "Complete service disruption for all database-dependent services",
  summary:
    "A cascading failure in the primary database cluster caused a 47-minute outage affecting all services that depend on the database. The root cause was identified as an unexpected spike in connection pool exhaustion due to a deployment of a new feature that created excessive database connections.",
  rootCause:
    "A new feature deployment introduced a code path that opened database connections without properly closing them. Under high load, this exhausted the connection pool and caused cascading failures across the cluster.",
  resolution:
    "The faulty deployment was rolled back, and the connection pool was manually reset. A hotfix was later deployed to properly manage database connections in the affected code path.",
  lessonsLearned: [
    "Implement connection pool monitoring with automatic alerts",
    "Add pre-deployment checks for connection leak patterns",
    "Improve staging environment to better simulate production load",
    "Create runbook for database connection pool exhaustion",
  ],
  timeline: [
    { time: "14:23", event: "Monitoring detected elevated error rates", type: "detection" },
    { time: "14:25", event: "On-call engineer paged", type: "response" },
    { time: "14:28", event: "Database cluster identified as source", type: "investigation" },
    { time: "14:35", event: "Connection pool exhaustion confirmed", type: "investigation" },
    { time: "14:42", event: "Recent deployment identified as potential cause", type: "investigation" },
    { time: "14:48", event: "Deployment rollback initiated", type: "action" },
    { time: "14:55", event: "Connection pool manually reset", type: "action" },
    { time: "15:05", event: "Services recovering", type: "recovery" },
    { time: "15:10", event: "Full service restoration confirmed", type: "recovery" },
  ],
  responders: ["Sarah Chen", "Mike Johnson", "Alex Rivera"],
}

const timelineTypeConfig = {
  detection: { color: "bg-yellow-500" },
  response: { color: "bg-blue-500" },
  investigation: { color: "bg-muted-foreground" },
  action: { color: "bg-primary" },
  recovery: { color: "bg-emerald-500" },
}

export default function PostmortemDetailPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/postmortems">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{postmortem.title}</h1>
              <Badge variant="destructive">Critical</Badge>
            </div>
            <p className="text-muted-foreground">
              {postmortem.monitor} • {postmortem.date}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <ExternalLink className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="text-lg font-semibold">{postmortem.duration}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Responders</p>
              <p className="text-lg font-semibold">{postmortem.responders.length} people</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="h-5 w-5 rounded-full bg-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">Severity</p>
              <p className="text-lg font-semibold capitalize">{postmortem.severity}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Impact</p>
            <p>{postmortem.impact}</p>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Overview</p>
            <p className="leading-relaxed">{postmortem.summary}</p>
          </div>
        </CardContent>
      </Card>

      {/* Root Cause & Resolution */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Root Cause</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{postmortem.rootCause}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resolution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{postmortem.resolution}</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Incident Timeline</CardTitle>
          <CardDescription>Chronological sequence of events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {postmortem.timeline.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-3 w-3 rounded-full ${timelineTypeConfig[item.type as keyof typeof timelineTypeConfig].color}`}
                  />
                  {index < postmortem.timeline.length - 1 && <div className="w-px flex-1 bg-border" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium">{item.time}</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {item.type}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lessons Learned */}
      <Card>
        <CardHeader>
          <CardTitle>Lessons Learned</CardTitle>
          <CardDescription>Action items to prevent future incidents</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {postmortem.lessonsLearned.map((lesson, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {index + 1}
                </span>
                <span className="pt-0.5">{lesson}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Responders */}
      <Card>
        <CardHeader>
          <CardTitle>Responders</CardTitle>
          <CardDescription>Team members involved in incident response</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {postmortem.responders.map((responder, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {responder
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <span className="text-sm">{responder}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
