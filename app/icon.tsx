// app/icon.tsx — MetriQuill branded favicon (Next.js App Router)
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
          background: 'linear-gradient(135deg, #FF6B2B 0%, #9333EA 100%)',
          borderRadius: 8,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 0,
          }}
        >
          <span
            style={{
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: -1,
              lineHeight: 1,
              fontFamily: 'sans-serif',
            }}
          >
            M
          </span>
          <span
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: -0.5,
              lineHeight: 1,
              fontFamily: 'sans-serif',
            }}
          >
            Q
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
