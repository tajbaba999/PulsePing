const stats = [
  { value: "99.9%", label: "Uptime SLA", company: "Stripe" },
  { value: "50ms", label: "Avg response time", company: "Vercel" },
  { value: "2M+", label: "Checks per day", company: "GitHub" },
  { value: "150+", label: "Global locations", company: "Shopify" },
]

export function StatsSection() {
  return (
    <section className="border-b border-border/40 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 divide-x divide-border/40 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="px-6 py-12 text-center md:px-8">
              <div className="mb-2 text-3xl font-bold md:text-4xl">{stat.value}</div>
              <div className="mb-4 text-sm text-muted-foreground">{stat.label}</div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                {stat.company}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
