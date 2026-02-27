import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url || typeof url !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid url parameter" },
      { status: 400 }
    )
  }

  // Only allow localhost URLs for security
  const isLocalhost = 
    url.includes("localhost:") || 
    url.includes("127.0.0.1:") ||
    url.includes("http://localhost") ||
    url.includes("http://127.0.0.1")

  if (!isLocalhost) {
    return NextResponse.json(
      { error: "Only localhost URLs are allowed" },
      { status: 403 }
    )
  }

  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: response.status }
      )
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get("content-type") || "image/webp"

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Image proxy error:", error)
    return NextResponse.json(
      { error: "Failed to proxy image" },
      { status: 500 }
    )
  }
}
