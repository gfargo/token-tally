import { ImageResponse } from "next/og";
// import { readFile } from "node:fs/promises";
// import { join } from "node:path";
import { metadata } from "./layout";

// Image metadata
export const alt = "TokenTally logo";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  // // Font loading, process.cwd() is Next.js project directory
  // const interSemiBold = await readFile(
  //   join(process.cwd(), "assets/Inter-SemiBold.ttf")
  // );

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="text-black">{metadata.title as string}</div>
        <p className="text-gray-800">
          All-in-One AI Cost Calculator for LLM APIs
        </p>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      
      // fonts: [
      //   {
      //     name: "Inter",
      //     data: interSemiBold,
      //     style: "normal",
      //     weight: 400,
      //   },
      // ],
    }
  );
}
