import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F3EEE3", backgroundImage: "linear-gradient(90deg, rgba(33,29,25,0.06) 1px, transparent 1px), linear-gradient(rgba(33,29,25,0.06) 1px, transparent 1px)", backgroundSize: "40px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 160, height: 160, borderRadius: "50%", border: "8px solid #C23B22", color: "#C23B22", fontSize: 56, fontWeight: 900, marginBottom: 32, transform: "rotate(-8deg)" }}>
          偏差値
        </div>
        <div style={{ fontSize: 72, fontWeight: 900, color: "#211D19" }}>セール偏差値</div>
        <div style={{ fontSize: 28, color: "#6B6259", marginTop: 16 }}>Steamセールお得度ランキング</div>
      </div>
    ),
    { ...size }
  );
}