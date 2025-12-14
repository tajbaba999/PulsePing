import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { HttpMethod, AuthType } from "@/lib/generated/prisma/client"
import { headers } from "next/headers"

// Helper function to get internal database userId with test mode support
async function getDbUserId(): Promise<string | null> {
    const headerPayload = await headers()
    const isTestMode = headerPayload.get('x-test-auth') === 'true' && process.env.NODE_ENV !== 'production'

    let clerkId: string | null = null

    if (isTestMode) {
        // In test mode, x-test-user-id should be the database user ID directly
        const testUserId = headerPayload.get('x-test-user-id')
        console.log('⚠️ TEST MODE: Using test user ID:', testUserId)
        return testUserId
    } else {
        const authResult = await auth()
        clerkId = authResult.userId
    }

    if (!clerkId) return null

    // Look up the internal database user ID from Clerk ID
    const user = await prisma.user.findUnique({
        where: { clerkId },
        select: { id: true }
    })

    return user?.id || null
}

export async function POST(request: Request) {
    try {
        const userId = await getDbUserId()
        console.log('📌 DEBUG: userId from getDbUserId:', userId)

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Verify the user exists in database
        const userExists = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true }
        })
        console.log('📌 DEBUG: userExists check:', userExists)

        if (!userExists) {
            return NextResponse.json({
                error: "User not found in database",
                userId,
                hint: "The x-test-user-id must be a valid database user ID from /api/test/user"
            }, { status: 400 })
        }

        const body = await request.json()
        console.log('📌 DEBUG: Creating monitor with:', { userId, body })

        const monitor = await prisma.monitor.create({
            data: {
                ...body,
                userId,
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
        const userId = await getDbUserId()

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
