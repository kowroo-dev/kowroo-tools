import { NextRequest, NextResponse } from "next/server"

interface RequestBody {
    url: string
}

export async function POST(request: NextRequest) {
    try {
        const body: RequestBody = await request.json()
        const { url } = body

        if (!url || !url.startsWith("https://") || url.length < 9) {
            return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
        }

        const response = await fetch(url)
        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error("Error fetching file list:", error)
        return NextResponse.json({ error: "Failed to fetch file list" }, { status: 500 })
    }
}
