import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle2, Clock, Filter } from "lucide-react"
import { AlertsList } from "@/components/dashboard/alerts-list"

const alertStats = [
  {
    title: "Active Incidents",
    value: "3",
    icon: AlertTriangle,
    color: "text-red-500",
  },
  {
    title: "Resolved Today",
    value: "7",
    icon: CheckCircle2,
    color: "text-emerald-500",
  },
  {
    title: "Avg Resolution Time",
    value: "12m",
    icon: Clock,
    color: "text-muted-foreground",
  },
]

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alerts</h1>
          <p className="text-muted-foreground">View and manage all your monitoring alerts.</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {alertStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All Alerts
            <Badge variant="secondary" className="ml-2">
              24
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="active">
            Active
            <Badge variant="destructive" className="ml-2">
              3
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Alerts</CardTitle>
              <CardDescription>Complete history of alerts across all monitors</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>Currently ongoing incidents that need attention</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertsList filter="active" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved">
          <Card>
            <CardHeader>
              <CardTitle>Resolved Alerts</CardTitle>
              <CardDescription>Past incidents that have been resolved</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertsList filter="resolved" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
