import Link from "next/link"
import { Activity } from "lucide-react"

const footerLinks = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Integrations", href: "/integrations" },
    { name: "Changelog", href: "/changelog" },
  ],
  Resources: [
    { name: "Documentation", href: "/docs" },
    { name: "API Reference", href: "/api" },
    { name: "Status Page", href: "/status" },
    { name: "Blog", href: "/blog" },
  ],
  Company: [
    { name: "About", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
    { name: "Press", href: "/press" },
  ],
  Legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Security", href: "/security" },
    { name: "GDPR", href: "/gdpr" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">PulsePing</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Real-time API monitoring for modern teams. Know the moment something goes wrong.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-sm font-semibold">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} PulsePing. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="https://twitter.com" className="text-sm text-muted-foreground hover:text-foreground">
              Twitter
            </Link>
            <Link href="https://github.com" className="text-sm text-muted-foreground hover:text-foreground">
              GitHub
            </Link>
            <Link href="https://discord.com" className="text-sm text-muted-foreground hover:text-foreground">
              Discord
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
