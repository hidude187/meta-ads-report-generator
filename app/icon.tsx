// app/icon.tsx — auto-generated MetriQuill favicon (Next.js App Router)
// This overrides app/favicon.ico with a branded PNG icon in the <head>.
import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FF6B2B 0%, #E04E12 100%)',
          borderRadius: 7,
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: -0.5,
            lineHeight: 1,
            fontFamily: 'sans-serif',
          }}
        >
          M
        </span>
      </div>
    ),
    { ...size }
  );
}
