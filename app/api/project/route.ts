import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
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

export async function GET() {
    try {
        const userId = await getDbUserId()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const projects = await prisma.project.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { monitors: true }
                }
            }
        })

        return NextResponse.json({ projects })

    } catch (error) {
        console.error("Error fetching projects:", error)
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const userId = await getDbUserId()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { name, description } = body

        if (!name) {
            return NextResponse.json(
                { error: "Project name is required" },
                { status: 400 }
            )
        }

        const project = await prisma.project.create({
            data: {
                userId,
                name,
                description: description || null,
            },
        })

        return NextResponse.json(
            {
                message: "Project created successfully",
                project
            },
            { status: 201 }
        )

    } catch (error) {
        console.error("Error creating project:", error)
        return NextResponse.json(
            {
                error: "Failed to create project",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        )
    }
}