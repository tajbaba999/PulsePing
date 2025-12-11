import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for personal projects and getting started.",
    features: ["5 monitors", "5-minute check intervals", "Email alerts", "7-day data retention", "1 team member"],
    cta: "Get started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For growing teams who need more monitors and faster checks.",
    features: [
      "50 monitors",
      "1-minute check intervals",
      "Slack & email alerts",
      "90-day data retention",
      "5 team members",
      "SSL monitoring",
      "Status pages",
    ],
    cta: "Start free trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    description: "For organizations with advanced monitoring needs.",
    features: [
      "Unlimited monitors",
      "30-second check intervals",
      "All alert channels",
      "1-year data retention",
      "Unlimited team members",
      "Custom integrations",
      "SLA guarantees",
      "Dedicated support",
    ],
    cta: "Contact sales",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="border-b border-border/40 py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Simple, transparent pricing</h2>
          <p className="text-lg text-muted-foreground">Start for free, scale as you grow. No hidden fees.</p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative flex flex-col ${
                plan.popular ? "border-primary bg-card shadow-lg shadow-primary/10" : "border-border/50 bg-card/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Most popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/register" className="w-full">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
