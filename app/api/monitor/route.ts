import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { HttpMethod, AuthType } from "@/lib/generated/prisma/client"

export async function POST(request: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()

        const { name, url, frequency, method, expectedStatus } = body

        if (!name || !url || !frequency) {
            return NextResponse.json(
                { error: "Missing required fields: name, url, and frequency are required" },
                { status: 400 }
            )
        }

        const monitor = await prisma.monitor.create({
            data: {
                userId,
                name,
                url,
                frequency: parseInt(frequency),
                method: (method as HttpMethod) || HttpMethod.GET,
                expectedStatus: expectedStatus ? parseInt(expectedStatus) : 200,
                authType: (authType as AuthType) || AuthType.NONE,
                authData: authData || null,
                isActive: true,
            },
        })

        return NextResponse.json(
            {
                message: "Monitor created successfully",
                monitor
            },
            { status: 201 }
        )

    } catch (error) {
        console.error("Error creating monitor:", error)
        return NextResponse.json(
            {
                error: "Failed to create monitor",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const monitors = await prisma.monitor.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { monitorRuns: true }
                }
            }
        })

        return NextResponse.json({ monitors })

    } catch (error) {
        console.error("Error fetching monitors:", error)
        return NextResponse.json(
            { error: "Failed to fetch monitors" },
            { status: 500 }
        )
    }
}
