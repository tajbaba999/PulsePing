"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Info } from "lucide-react"

// Frequency presets for quick selection
const frequencyPresets = [
  { label: "10 seconds", seconds: 10 },
  { label: "30 seconds", seconds: 30 },
  { label: "1 minute", seconds: 60 },
  { label: "5 minutes", seconds: 300 },
  { label: "15 minutes", seconds: 900 },
  { label: "30 minutes", seconds: 1800 },
  { label: "1 hour", seconds: 3600 },
  { label: "6 hours", seconds: 21600 },
  { label: "12 hours", seconds: 43200 },
  { label: "24 hours", seconds: 86400 },
]

export function CreateMonitorForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectIdFromUrl = searchParams.get('projectId')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [projects, setProjects] = useState<{ id: string, name: string }[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)

  // Form fields
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [projectId, setProjectId] = useState(projectIdFromUrl || "")
  const [alertEmail, setAlertEmail] = useState("")
  const [description, setDescription] = useState("")

  // Frequency state
  const [frequencyMode, setFrequencyMode] = useState<"preset" | "custom">("preset")
  const [frequencyPreset, setFrequencyPreset] = useState("60") // Default 1 minute

  // Custom frequency: all three fields shown together
  const [customHours, setCustomHours] = useState("0")
  const [customMinutes, setCustomMinutes] = useState("5")
  const [customSeconds, setCustomSeconds] = useState("0")

  // Fetch projects on mount
  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/project')
        const data = await response.json()
        if (response.ok) {
          setProjects(data.projects || [])
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err)
      } finally {
        setLoadingProjects(false)
      }
    }
    fetchProjects()
  }, [])

  // Calculate frequency in seconds
  const getFrequencyInSeconds = (): number => {
    if (frequencyMode === "preset") {
      return parseInt(frequencyPreset, 10)
    }

    const hours = parseInt(customHours, 10) || 0
    const minutes = parseInt(customMinutes, 10) || 0
    const seconds = parseInt(customSeconds, 10) || 0

    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds

    // Clamp between min and max
    return Math.max(10, Math.min(totalSeconds, 86400))
  }

  // Format frequency for display
  const formatFrequency = (seconds: number): string => {
    if (seconds < 60) return `${seconds} seconds`
    if (seconds < 3600) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      if (secs === 0) return `${mins} minute${mins !== 1 ? 's' : ''}`
      return `${mins}m ${secs}s`
    }
    const hours = Math.floor(seconds / 3600)
    const remaining = seconds % 3600
    const mins = Math.floor(remaining / 60)
    const secs = remaining % 60

    let result = `${hours}h`
    if (mins > 0) result += ` ${mins}m`
    if (secs > 0) result += ` ${secs}s`
    return result
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const frequencyInSeconds = getFrequencyInSeconds()

    // Validate frequency
    if (frequencyInSeconds < 10) {
      setError("Minimum check frequency is 10 seconds")
      setIsLoading(false)
      return
    }
    if (frequencyInSeconds > 86400) {
      setError("Maximum check frequency is 24 hours (86400 seconds)")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          name,
          url,
          frequency: frequencyInSeconds,
          method: 'GET',
          expectedStatus: 200,
          authType: 'NONE',
          isActive: true,
          alertEmail: alertEmail || undefined,
          description: description || undefined,
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create monitor')
      }

      router.push(`/dashboard/monitors/${data.monitor.id}`)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create monitor')
    } finally {
      setIsLoading(false)
    }
  }

  const frequencySeconds = getFrequencyInSeconds()

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Monitor Details</CardTitle>
          <CardDescription>Configure your API endpoint monitoring settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="project">Project *</Label>
            <Select value={projectId} onValueChange={setProjectId} required>
              <SelectTrigger>
                <SelectValue placeholder={loadingProjects ? "Loading projects..." : "Select a project"} />
              </SelectTrigger>
              <SelectContent>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Monitor Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Production API"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Endpoint URL *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://api.example.com/health"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">The URL to check for availability</p>
          </div>

          {/* Frequency Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Check Frequency</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={frequencyMode === "preset" ? "secondary" : "ghost"}
                  onClick={() => setFrequencyMode("preset")}
                >
                  Presets
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={frequencyMode === "custom" ? "secondary" : "ghost"}
                  onClick={() => setFrequencyMode("custom")}
                >
                  Custom
                </Button>
              </div>
            </div>

            {frequencyMode === "preset" ? (
              <Select value={frequencyPreset} onValueChange={setFrequencyPreset}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencyPresets.map(preset => (
                    <SelectItem key={preset.seconds} value={preset.seconds.toString()}>
                      Every {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min={0}
                    max={24}
                    value={customHours}
                    onChange={(e) => setCustomHours(e.target.value)}
                    className="w-16 text-center"
                  />
                  <span className="text-sm text-muted-foreground">hrs</span>
                </div>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min={0}
                    max={59}
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                    className="w-16 text-center"
                  />
                  <span className="text-sm text-muted-foreground">min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min={0}
                    max={59}
                    value={customSeconds}
                    onChange={(e) => setCustomSeconds(e.target.value)}
                    className="w-16 text-center"
                  />
                  <span className="text-sm text-muted-foreground">sec</span>
                </div>
              </div>
            )}

            {/* Frequency Info */}
            <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-sm">
              <Info className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div className="text-muted-foreground">
                <p>
                  Your endpoint will be checked <strong>every {formatFrequency(frequencySeconds)}</strong>.
                </p>
                <p className="mt-1 text-xs">
                  Min: 10 seconds • Max: 24 hours • Lower frequency = faster alerts but more resource usage.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alertEmail">Alert Email</Label>
            <Input
              id="alertEmail"
              type="email"
              placeholder="alerts@example.com"
              value={alertEmail}
              onChange={(e) => setAlertEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Receive notifications when this monitor goes down</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add notes about this monitor..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading || !projectId || !name || !url}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Monitor
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
