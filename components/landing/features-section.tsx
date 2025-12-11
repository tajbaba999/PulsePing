import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Bell, BarChart3, Globe, Zap, Shield, Webhook, Clock } from "lucide-react"

const features = [
  {
    icon: Activity,
    title: "Real-time Monitoring",
    description: "Check your endpoints every 30 seconds from multiple global locations with instant status updates.",
  },
  {
    icon: Bell,
    title: "Instant Alerts",
    description: "Get notified via Slack, email, or webhook the moment an issue is detected.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track response times, uptime percentages, and performance trends over time.",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Monitor from 150+ locations worldwide to ensure availability for all your users.",
  },
  {
    icon: Zap,
    title: "Fast Detection",
    description: "Detect issues in under 30 seconds with our high-frequency monitoring system.",
  },
  {
    icon: Shield,
    title: "SSL Monitoring",
    description: "Get alerts before your SSL certificates expire to prevent security warnings.",
  },
  {
    icon: Webhook,
    title: "Webhook Support",
    description: "Integrate with your existing tools and workflows via webhooks and APIs.",
  },
  {
    icon: Clock,
    title: "Status Pages",
    description: "Create beautiful public status pages to keep your users informed.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-b border-border/40 py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need to monitor your APIs
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features to keep your services running smoothly and your team informed.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 bg-card/50 transition-colors hover:bg-card">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
