import { useEffect, useId, useState } from 'react'

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'
const waveLength = 1497.9295

function wavePathAtPhase(phase: number) {
  const frequency = 2 * Math.PI / 1440
  const height = (x: number) => 180 - 90 * Math.sin(x * frequency + phase)
  const slope = (x: number) => -90 * frequency * Math.cos(x * frequency + phase)
  const point = (value: number) => Number(value.toFixed(3))
  let path = `M0 ${point(height(0))}`

  // Matching endpoint heights and tangents keep adjacent tiles connected at every phase.
  for (let x = 0; x < 1440; x += 360) {
    const end = x + 360
    path += ` C${x + 120} ${point(height(x) + slope(x) * 120)}`
      + ` ${end - 120} ${point(height(end) - slope(end) * 120)}`
      + ` ${end} ${point(height(end))}`
  }
  return path
}

const waveFrames = Array.from({ length: 33 }, (_, frame) => wavePathAtPhase(frame * Math.PI / 16))
const waveValues = waveFrames.join(';')

export function HowdyWave({ text }: { text: string }) {
  const id = useId()
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia(reducedMotionQuery).matches)

  useEffect(() => {
    const preference = window.matchMedia(reducedMotionQuery)
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
    preference.addEventListener('change', onChange)
    return () => preference.removeEventListener('change', onChange)
  }, [])

  return (
    <div className="howdy-wave" aria-hidden="true">
      <div className="howdy-wave__track">
        {[0, 1].map((group) => (
          <div className="howdy-wave__group" key={group}>
            {[0, 1, 2, 3].map((tile) => {
              const pathId = `${id}-wave-${group}-${tile}`
              return (
                <svg
                  className="howdy-wave__tile"
                  viewBox="0 0 1440 320"
                  focusable="false"
                  key={tile}
                >
                  <defs>
                    <path id={pathId} d={waveFrames[0]}>
                      {!reducedMotion && (
                        <animate
                          attributeName="d"
                          values={waveValues}
                          dur="8s"
                          calcMode="linear"
                          repeatCount="indefinite"
                        />
                      )}
                    </path>
                  </defs>
                  <text>
                    <textPath
                      href={`#${pathId}`}
                      startOffset={20}
                      textLength={waveLength - 40}
                      lengthAdjust="spacing"
                    >
                      {Array(5).fill(text).join('\u00a0\u00a0')}
                    </textPath>
                  </text>
                </svg>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
