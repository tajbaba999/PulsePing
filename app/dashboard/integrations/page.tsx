import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IntegrationCard } from "@/components/dashboard/integration-card"

const integrations = [
  {
    id: "slack",
    name: "Slack",
    description: "Get instant alerts in your Slack channels when monitors go down or recover.",
    icon: "/slack-logo.png",
    connected: true,
    status: "#alerts-channel",
  },
  {
    id: "email",
    name: "Email",
    description: "Receive email notifications for all monitoring events.",
    icon: "/email-icon.png",
    connected: true,
    status: "team@example.com",
  },
  {
    id: "pagerduty",
    name: "PagerDuty",
    description: "Trigger PagerDuty incidents when critical monitors fail.",
    icon: "/pagerduty-logo.png",
    connected: false,
    status: null,
  },
  {
    id: "discord",
    name: "Discord",
    description: "Send alerts to Discord channels via webhooks.",
    icon: "/discord-logo.png",
    connected: false,
    status: null,
  },
  {
    id: "webhook",
    name: "Webhook",
    description: "Send HTTP POST requests to any URL when events occur.",
    icon: "/webhook-icon.png",
    connected: true,
    status: "3 endpoints configured",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Post alerts to Microsoft Teams channels.",
    icon: "/microsoft-teams-logo.png",
    connected: false,
    status: null,
  },
]

export default function IntegrationsPage() {
  const connectedCount = integrations.filter((i) => i.connected).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">Connect PulsePing with your favorite tools and services.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Connected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedCount}</div>
            <p className="text-xs text-muted-foreground">Active integrations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.length - connectedCount}</div>
            <p className="text-xs text-muted-foreground">More to connect</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Notifications Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Integrations</CardTitle>
          <CardDescription>Connect your monitoring alerts with external services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
