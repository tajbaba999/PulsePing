import { CreateMonitorForm } from "@/components/dashboard/create-monitor-form"

export default function NewMonitorPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Monitor</h1>
        <p className="text-muted-foreground">Set up a new API endpoint to monitor.</p>
      </div>

      <CreateMonitorForm />
    </div>
  )
}
