import { prisma } from "@/lib/prisma"

export interface HealthCheckResult {
    success: boolean
    statusCode?: number
    responseTime?: number
    message?: string
}

/**
 * Performs a health check on a monitor by making an HTTP request
 * and recording the results in the MonitorRun table
 */
export async function performHealthCheck(monitorId: string): Promise<HealthCheckResult> {
    try {
        // Fetch monitor details
        const monitor = await prisma.monitor.findUnique({
            where: { id: monitorId },
            select: {
                id: true,
                url: true,
                method: true,
                expectedStatus: true,
                authType: true,
                authData: true,
                isActive: true
            }
        })

        if (!monitor) {
            throw new Error(`Monitor ${monitorId} not found`)
        }

        if (!monitor.isActive) {
            return {
                success: false,
                message: "Monitor is not active"
            }
        }

        // Prepare request options
        const headers: HeadersInit = {
            'User-Agent': 'PulsePing-Monitor/1.0'
        }

        // Add authentication if configured
        if (monitor.authType === 'BEARER' && monitor.authData) {
            const authData = monitor.authData as { token?: string }
            if (authData.token) {
                headers['Authorization'] = `Bearer ${authData.token}`
            }
        } else if (monitor.authType === 'HEADER' && monitor.authData) {
            const authData = monitor.authData as Record<string, string>
            Object.entries(authData).forEach(([key, value]) => {
                headers[key] = value
            })
        } else if (monitor.authType === 'BASIC' && monitor.authData) {
            const authData = monitor.authData as { username?: string; password?: string }
            if (authData.username && authData.password) {
                const basicAuth = Buffer.from(`${authData.username}:${authData.password}`).toString('base64')
                headers['Authorization'] = `Basic ${basicAuth}`
            }
        }

        // Perform the health check
        const startTime = Date.now()

        const response = await fetch(monitor.url, {
            method: monitor.method,
            headers,
            redirect: 'follow',
            signal: AbortSignal.timeout(30000) // 30 second timeout
        })

        const endTime = Date.now()
        const responseTime = endTime - startTime
        const statusCode = response.status
        const success = statusCode === monitor.expectedStatus

        // Store the result
        await prisma.monitorRun.create({
            data: {
                monitorId: monitor.id,
                statusCode,
                responseTime,
                success,
                message: success
                    ? "Health check passed"
                    : `Expected status ${monitor.expectedStatus}, got ${statusCode}`
            }
        })

        return {
            success,
            statusCode,
            responseTime,
            message: success
                ? "Health check passed"
                : `Expected status ${monitor.expectedStatus}, got ${statusCode}`
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error"

        // Try to store the failed result
        try {
            await prisma.monitorRun.create({
                data: {
                    monitorId,
                    success: false,
                    message: errorMessage
                }
            })
        } catch (dbError) {
            console.error("Failed to store error result:", dbError)
        }

        return {
            success: false,
            message: errorMessage
        }
    }
}

/**
 * Get recent monitor runs for a specific monitor
 */
export async function getMonitorRuns(monitorId: string, limit: number = 50) {
    return await prisma.monitorRun.findMany({
        where: { monitorId },
        orderBy: { createdAt: 'desc' },
        take: limit
    })
}
