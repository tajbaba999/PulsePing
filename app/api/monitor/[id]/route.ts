import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@clerk/nextjs/server";

// Helper function to get userId with test mode support
async function getAuthUserId(): Promise<string | null> {
    const headerPayload = await headers()
    const isTestMode = headerPayload.get('x-test-auth') === 'true' && process.env.NODE_ENV !== 'production'

    if (isTestMode) {
        const testUserId = headerPayload.get('x-test-user-id')
        console.log('⚠️ TEST MODE: Using test user ID:', testUserId)
        return testUserId
    }

    const { userId } = await auth()
    return userId
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: monitorId } = await params;

        if (!monitorId) {
            return NextResponse.json({ error: "Monitor ID is required" }, { status: 400 })
        }

        const exisintMonitor = await prisma.monitor.findUnique({
            where: {
                id: monitorId
            }
        })

        if (!exisintMonitor) {
            return NextResponse.json({ error: "Monitor not found" }, { status: 404 })
        }

        await prisma.monitor.delete({
            where: {
                id: monitorId
            }
        })

        return NextResponse.json({ message: "Monitor deleted successfully" }, { status: 200 })

    } catch (error) {
        console.error("Error deleting monitor:", error)
        return NextResponse.json(
            { error: "Failed to delete monitor" },
            { status: 500 }
        )
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: monitorId } = await params;

        if (!monitorId) {
            return NextResponse.json({ error: "Monitor id is not present" }, { status: 400 });
        }

        const body = await request.json();

        const updatedMonitor = await prisma.monitor.update({
            where: {
                id: monitorId
            },
            data: body
        })

        return NextResponse.json({
            message: "Monitor updated successfully",
            monitor: updatedMonitor
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating monitor:", error)
        return NextResponse.json(
            { error: "Failed to update monitor" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: monitorId } = await params;

        if (!monitorId) {
            return NextResponse.json({ error: "Monitor id is not present" }, { status: 400 });
        }

        const monitor = await prisma.monitor.findUnique({
            where: {
                id: monitorId
            }
        })

        if (!monitor) {
            return NextResponse.json({ error: "Monitor not found" }, { status: 404 })
        }

        return NextResponse.json({ monitor }, { status: 200 })
    } catch (error) {
        console.error("Error fetching monitor:", error)
        return NextResponse.json(
            { error: "Failed to fetch monitor" },
            { status: 500 }
        )
    }
}