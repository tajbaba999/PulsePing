import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Ready to start monitoring?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of teams who trust PulsePing to keep their APIs running smoothly.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Start free trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Talk to sales
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
