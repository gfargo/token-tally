import { ImageResponse } from "next/server"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get("title")
  const description = searchParams.get("description")

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        fontSize: 32,
        fontWeight: 600,
      }}
    >
      <div style={{ marginBottom: 20, color: "#111827" }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 400, color: "#6B7280", textAlign: "center", maxWidth: "80%" }}>
        {description}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}

