// TrackingMap.tsx — lightweight Vihiga schematic with smoothly retargeted simulated markers.
import { motion, useReducedMotion } from 'framer-motion'
import type { TrackedVehicle } from '../../api/vehicles'
const B = {
  minLat: 0.045,
  maxLat: 0.08,
  minLng: 34.7,
  maxLng: 34.76,
}
function p(lat: number, lng: number) {
  return {
    x: ((lng - B.minLng) / (B.maxLng - B.minLng)) * 100,
    y: (1 - (lat - B.minLat) / (B.maxLat - B.minLat)) * 100,
  }
}
export function TrackingMap({
  vehicles,
  selected,
  onSelect,
}: {
  vehicles: TrackedVehicle[]
  selected: TrackedVehicle | null
  onSelect: (id: number) => void
}) {
  const reduced = useReducedMotion()
  return (
    <div
      className="tracking-map"
      role="img"
      aria-label="Simulated Vihiga County fleet map"
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="tracking-map__svg"
      >
        <path
          d="M2 78 C25 60 40 66 55 44 S82 20 98 14"
          className="tracking-map__road"
        />
        <path
          d="M8 10 C24 34 38 30 52 52 S74 72 96 86"
          className="tracking-map__road"
        />
        <text x="44" y="39" className="tracking-map__label">
          Mbale
        </text>
        <text x="74" y="21" className="tracking-map__label">
          Luanda
        </text>
        <text x="18" y="76" className="tracking-map__label">
          Chavakali
        </text>
      </svg>
      {vehicles.map((v) => {
        const q = p(v.lat, v.lng)
        return (
          <motion.button
            key={v.id}
            className={`tracking-map__marker ${selected?.id === v.id ? 'tracking-map__marker--active' : ''}`}
            initial={false}
            animate={{
              left: `${q.x}%`,
              top: `${q.y}%`,
            }}
            transition={
              reduced
                ? {
                    duration: 0,
                  }
                : {
                    type: 'tween',
                    ease: [0.25, 1, 0.5, 1],
                    duration: 2.2,
                  }
            }
            style={{
              color:
                v.status === 'In Motion'
                  ? 'var(--st-motion)'
                  : v.status === 'In Repair'
                    ? 'var(--st-repair)'
                    : 'var(--st-parked)',
            }}
            onClick={() => onSelect(v.id)}
            aria-label={`${v.plate}, ${v.status}`}
          >
            {v.status === 'In Motion' && !reduced && (
              <motion.span
                className="tracking-map__pulse"
                animate={{
                  scale: [1, 2.4],
                  opacity: [0.5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.6,
                }}
              />
            )}
            <span className="tracking-map__dot" />
          </motion.button>
        )
      })}
      <span className="tracking-map__note">
        Vihiga road simulation · live GPS pending
      </span>
    </div>
  )
}
