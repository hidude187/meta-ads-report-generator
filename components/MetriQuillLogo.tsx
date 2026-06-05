'use client'

/**
 * MetriQuillLogo — reusable brand component
 * Props:
 *   size        — icon height/width in px (default 32)
 *   showText    — render "MetriQuill" wordmark next to icon (default true)
 *   textColor   — CSS color for wordmark (default '#FFF1E8')
 *   animated    — spin the centre asterisk (default true)
 *   textSize    — override font size (default derived from size)
 */

interface MetriQuillLogoProps {
  size?: number
  showText?: boolean
  textColor?: string
  animated?: boolean
  textSize?: number
}

export function MetriQuillLogo({
  size = 32,
  showText = true,
  textColor = '#FFF1E8',
  animated = true,
  textSize,
}: MetriQuillLogoProps) {
  const fontSize = textSize ?? Math.round(size * 0.53)

  return (
    <>
      {animated && (
        <style>{`
          @keyframes mq-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(size * 0.3) }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
          width={size}
          height={size}
          style={{ flexShrink: 0, overflow: 'visible' }}
          aria-hidden="true"
        >
          <g fill="#FF6B2B" stroke="#FF6B2B">
            <path
              d="M 889.4 657.3 A 420 420 0 1 0 615.8 903.7"
              fill="none"
              strokeWidth="62"
              strokeLinecap="butt"
            />
            <g transform="translate(500, 500)" stroke="none">
              <g
                style={
                  animated
                    ? {
                        animation: 'mq-spin 8s linear infinite',
                        transformOrigin: '0px 0px',
                      }
                    : undefined
                }
              >
                <rect x="-31" y="-180" width="62" height="360" rx="31" />
                <rect x="-31" y="-180" width="62" height="360" rx="31" transform="rotate(60)" />
                <rect x="-31" y="-180" width="62" height="360" rx="31" transform="rotate(120)" />
              </g>
            </g>
            <polygon
              points="735,725 960,815 860,860 815,960"
              strokeWidth="32"
              strokeLinejoin="round"
            />
          </g>
        </svg>

        {showText && (
          <span
            style={{
              fontSize,
              fontWeight: 700,
              color: textColor,
              letterSpacing: '-0.03em',
              fontFamily: 'var(--font-display)',
              lineHeight: 1,
              textShadow: '0 2px 12px rgba(0,0,0,0.5)',
              userSelect: 'none',
            }}
          >
            MetriQuill
          </span>
        )}
      </div>
    </>
  )
}
