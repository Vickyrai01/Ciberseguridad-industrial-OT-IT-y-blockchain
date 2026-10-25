import type { PlantSvgIds } from '../types'

interface PlantTankProps {
  ids: PlantSvgIds
}

export function PlantTank({ ids }: PlantTankProps) {
  return (
    <>
      <defs>
        <clipPath id={ids.tankClip}>
          <rect x="710" y="290" width="84" height="96" rx="12" />
        </clipPath>
      </defs>
      <rect x="705" y="285" width="92" height="107" rx="16" fill={`url(#${ids.tankGradient})`} stroke="#4e7074" />
      <g clipPath={`url(#${ids.tankClip})`}>
        <rect x="706" y="340" width="92" height="48" fill="#246f6b" className="liquid-fill" />
        <path d="M696 340 Q716 332 736 340 T776 340 T816 340 V390 H696Z" fill="#31958c" className="liquid-wave" />
        <path
          d="M696 347 Q716 340 736 347 T776 347 T816 347"
          fill="none"
          stroke="#70d7c1"
          strokeOpacity=".45"
          strokeWidth="2"
          className="liquid-wave liquid-wave-highlight"
        />
      </g>
    </>
  )
}
