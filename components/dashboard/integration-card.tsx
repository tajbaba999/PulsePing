"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Settings } from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  icon: string
  connected: boolean
  status: string | null
}

interface IntegrationCardProps {
  integration: Integration
}

export function IntegrationCard({ integration }: IntegrationCardProps) {
  const [isConnected, setIsConnected] = useState(integration.connected)

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
            <Image
              src={integration.icon || "/placeholder.svg"}
              alt={integration.name}
              width={32}
              height={32}
              className="rounded"
            />
          </div>
          {isConnected && (
            <Badge variant="secondary" className="gap-1">
              <Check className="h-3 w-3" />
              Connected
            </Badge>
          )}
        </div>
        <CardTitle className="mt-3 text-base">{integration.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <CardDescription className="text-sm">{integration.description}</CardDescription>
        {isConnected && integration.status && (
          <p className="mt-2 text-xs text-muted-foreground">{integration.status}</p>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        {isConnected ? (
          <div className="flex w-full gap-2">
            <Button variant="outline" size="sm" className="flex-1 gap-1 bg-transparent">
              <Settings className="h-3.5 w-3.5" />
              Configure
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsConnected(false)}>
              Disconnect
            </Button>
          </div>
        ) : (
          <Button size="sm" className="w-full" onClick={() => setIsConnected(true)}>
            Connect
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
