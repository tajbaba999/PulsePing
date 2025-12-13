import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { monitorSchema } from "@/lib/validators/monitor"
import { ZodError } from "zod"
import { Prisma } from "@/lib/generated/prisma/client"

export async function POST(request: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()

        // Validate the request body with Zod
        const validatedData = monitorSchema.parse(body)

        const monitor = await prisma.monitor.create({
            data: {
                ...validatedData,
                authData: validatedData.authData === null ? Prisma.JsonNull : validatedData.authData,
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
        // Handle Zod validation errors
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: error.errors.map(e => ({
                        field: e.path.join('.'),
                        message: e.message
                    }))
                },
                { status: 400 }
            )
        }

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


