import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const brideConfig = {
  side: 'bride',
  brideName: 'Rijushmita Goswami',
  groomName: 'Dr. Jugabrat Misra',
  date: '21 November 2026',
  dateShort: '21',
  month: 'NOVEMBER',
  year: '2026',
  time: '5 PM ONWARDS',
  venue: 'Lake City',
  location: 'VIP Road, Guwahati',
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=Lake+City+VIP+Road+Guwahati',
  target: '2026-11-21T17:00:00+05:30',
}

const groomConfig = {
  side: 'groom',
  brideName: 'Rijushmita Goswami',
  groomName: 'Dr. Jugabrat Misra',
  date: '22 November 2026',
  dateShort: '22',
  month: 'NOVEMBER',
  year: '2026',
  time: '1 PM ONWARDS',
  venue: 'Prajapati Bibah Bhawan',
  location: 'Nalbari',
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=Prajapati+Bibah+Bhawan+Nalbari',
  target: '2026-11-22T13:00:00+05:30',
}

const galleryImages = [
  '/Images/gallery-01.jpg',
  '/Images/gallery-02.jpg',
  '/Images/gallery-03.jpg',
  '/Images/gallery-04.jpg',
  '/Images/gallery-05.jpg',
]

function getConfig() {
  const params = new URLSearchParams(window.location.search)

  return params.get('side') === 'groom'
    ? groomConfig
    : brideConfig
}

function formatNumber(number) {
  return String(number).padStart(2, '0')
}

function getTimeLeft(target) {
  const difference = new Date(target).getTime() - Date.now()

  if (difference <= 0) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  const totalSeconds = Math.floor(difference / 1000)

  return {
    total: difference,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

function ScratchReveal({ config, onReveal }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const drawingRef = useRef(false)
  const revealedRef = useRef(false)

  const [revealed, setRevealed] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current

    if (!canvas || !container) return

    const ctx = canvas.getContext('2d', {
      willReadFrequently: true,
    })

    const rect = container.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height

    const gradient = ctx.createLinearGradient(
      0,
      0,
      width,
      height,
    )

    gradient.addColorStop(0, '#b08a43')
    gradient.addColorStop(0.22, '#e6c878')
    gradient.addColorStop(0.48, '#8e682e')
    gradient.addColorStop(0.7, '#d7b55d')
    gradient.addColorStop(1, '#74521f')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    const innerGradient = ctx.createLinearGradient(
      0,
      0,
      0,
      height,
    )

    innerGradient.addColorStop(
      0,
      'rgba(255,255,255,0.12)',
    )

    innerGradient.addColorStop(
      0.5,
      'rgba(0,0,0,0.08)',
    )

    innerGradient.addColorStop(
      1,
      'rgba(0,0,0,0.2)',
    )

    ctx.fillStyle = innerGradient
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = 'rgba(255, 237, 177, 0.75)'
    ctx.lineWidth = 1

    ctx.strokeRect(
      12,
      12,
      width - 24,
      height - 24,
    )

    ctx.strokeStyle = 'rgba(74, 37, 18, 0.45)'
    ctx.lineWidth = 2

    ctx.strokeRect(
      18,
      18,
      width - 36,
      height - 36,
    )

    ctx.globalCompositeOperation = 'source-over'

    ctx.fillStyle = 'rgba(60, 29, 12, 0.6)'
    ctx.font = '600 10px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.letterSpacing = '3px'

    ctx.fillText(
      'SCRATCH TO REVEAL',
      width / 2,
      height / 2 + 5,
    )

    const calculateProgress = () => {
      const sampleWidth = Math.max(
        1,
        Math.floor(canvas.width / 50),
      )

      const sampleHeight = Math.max(
        1,
        Math.floor(canvas.height / 30),
      )

      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      )

      let transparent = 0
      let sampled = 0

      for (
        let y = 0;
        y < canvas.height;
        y += sampleHeight
      ) {
        for (
          let x = 0;
          x < canvas.width;
          x += sampleWidth
        ) {
          const index =
            (y * canvas.width + x) * 4 + 3

          if (imageData.data[index] < 100) {
            transparent++
          }

          sampled++
        }
      }

      const percentage = Math.min(
        100,
        Math.round(
          (transparent / sampled) * 100,
        ),
      )

      setProgress(percentage)

      if (
        percentage >= 52 &&
        !revealedRef.current
      ) {
        revealedRef.current = true
        setRevealed(true)

        setTimeout(() => {
          onReveal()
        }, 450)
      }
    }

    const scratch = (event) => {
      if (
        !drawingRef.current ||
        revealedRef.current
      ) {
        return
      }

      const bounds = canvas.getBoundingClientRect()

      let clientX
      let clientY

      if (
        event.touches &&
        event.touches.length
      ) {
        clientX = event.touches[0].clientX
        clientY = event.touches[0].clientY
      } else {
        clientX = event.clientX
        clientY = event.clientY
      }

      const x = clientX - bounds.left
      const y = clientY - bounds.top

      ctx.save()

      ctx.globalCompositeOperation =
        'destination-out'

      const radius =
        window.innerWidth < 600
          ? 30
          : 38

      const brush = ctx.createRadialGradient(
        x,
        y,
        radius * 0.15,
        x,
        y,
        radius,
      )

      brush.addColorStop(
        0,
        'rgba(0,0,0,1)',
      )

      brush.addColorStop(
        0.7,
        'rgba(0,0,0,0.95)',
      )

      brush.addColorStop(
        1,
        'rgba(0,0,0,0)',
      )

      ctx.fillStyle = brush

      ctx.beginPath()

      ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2,
      )

      ctx.fill()
      ctx.restore()

      calculateProgress()
    }

    const start = (event) => {
      drawingRef.current = true
      scratch(event)
    }

    const move = (event) => {
      if (!drawingRef.current) return

      if (event.cancelable) {
        event.preventDefault()
      }

      scratch(event)
    }

    const stop = () => {
      drawingRef.current = false
    }

    canvas.addEventListener(
      'mousedown',
      start,
    )

    canvas.addEventListener(
      'mousemove',
      move,
    )

    window.addEventListener(
      'mouseup',
      stop,
    )

    canvas.addEventListener(
      'touchstart',
      start,
      { passive: false },
    )

    canvas.addEventListener(
      'touchmove',
      move,
      { passive: false },
    )

    window.addEventListener(
      'touchend',
      stop,
    )

    return () => {
      canvas.removeEventListener(
        'mousedown',
        start,
      )

      canvas.removeEventListener(
        'mousemove',
        move,
      )

      window.removeEventListener(
        'mouseup',
        stop,
      )

      canvas.removeEventListener(
        'touchstart',
        start,
      )

      canvas.removeEventListener(
        'touchmove',
        move,
      )

      window.removeEventListener(
        'touchend',
        stop,
      )
    }
  }, [onReveal])

  return (
    <section
      className={`date-reveal-section ${
        revealed ? 'is-revealed' : ''
      }`}
    >
      <div className="section-ornament top" />

      <div className="date-reveal-heading">
        <span>✦</span>
        <p>A DATE TO REMEMBER</p>
        <span>✦</span>
      </div>

      <div
        className="scratch-wrap"
        ref={containerRef}
      >
        <div className="date-underlay">
          <div className="date-underlay-inner">
            <span className="date-small-label">
              SAVE THE DATE
            </span>

            <div className="revealed-date">
              <strong>
                {config.dateShort}
              </strong>

              <div>
                <span>
                  {config.month}
                </span>

                <small>
                  {config.year}
                </small>
              </div>
            </div>

            <span className="revealed-time">
              {config.time}
            </span>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="scratch-canvas"
          aria-label="Scratch to reveal the wedding date"
        />

        <div className="scratch-hint">
          <span className="scratch-icon">
            ✦
          </span>

          <span>
            Reveal our special day
          </span>

          <span className="scratch-icon">
            ✦
          </span>
        </div>
      </div>

      <div className="scratch-progress">
        <span
          style={{
            width: `${Math.min(
              progress,
              100,
            )}%`,
          }}
        />
      </div>

      <p className="scratch-note">
        Gently scratch the golden surface
      </p>

      <div className="section-ornament bottom" />
    </section>
  )
}

function Countdown({ config, active }) {
  const [time, setTime] = useState(
    () => getTimeLeft(config.target),
  )

  useEffect(() => {
    if (!active) return undefined

    setTime(getTimeLeft(config.target))

    const interval = setInterval(() => {
      setTime(
        getTimeLeft(config.target),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [active, config.target])

  if (!active) return null

  return (
    <section className="countdown-section">
      <div className="countdown-heading">
        <span className="line" />
        <p>THE COUNTDOWN BEGINS</p>
        <span className="line" />
      </div>

      <div className="countdown-grid">
        <div className="countdown-box">
          <strong>
            {formatNumber(time.days)}
          </strong>

          <span>DAYS</span>
        </div>

        <div className="countdown-divider">
          :
        </div>

        <div className="countdown-box">
          <strong>
            {formatNumber(time.hours)}
          </strong>

          <span>HOURS</span>
        </div>

        <div className="countdown-divider">
          :
        </div>

        <div className="countdown-box">
          <strong>
            {formatNumber(time.minutes)}
          </strong>

          <span>MINUTES</span>
        </div>

        <div className="countdown-divider">
          :
        </div>

        <div className="countdown-box">
          <strong>
            {formatNumber(time.seconds)}
          </strong>

          <span>SECONDS</span>
        </div>
      </div>
    </section>
  )
}

const celebrationParticles = [
  // long gold ribbons erupting from the seal, sweeping past its edges
  { cls: 'p-ribbon', left: 50, top: 50, w: '4px', h: '58vh', dx: '-34vw', dy: '-46vh', fall: '72vh', rot: -300, delay: 300, dur: 1650 },
  { cls: 'p-ribbon', left: 50, top: 50, w: '5px', h: '72vh', dx: '30vw', dy: '-52vh', fall: '80vh', rot: 340, delay: 340, dur: 1750 },
  { cls: 'p-ribbon', left: 49, top: 51, w: '4px', h: '45vh', dx: '-22vw', dy: '-58vh', fall: '68vh', rot: -220, delay: 380, dur: 1500 },
  { cls: 'p-ribbon', left: 51, top: 50, w: '4px', h: '64vh', dx: '18vw', dy: '-60vh', fall: '75vh', rot: 260, delay: 320, dur: 1700 },

  // ribbons sweeping in from screen edges/corners, arcing toward center then falling
  { cls: 'p-ribbon', left: 14, top: -6, w: '4px', h: '48vh', dx: '26vw', dy: '48vh', fall: '46vh', rot: 200, delay: 420, dur: 2000 },
  { cls: 'p-ribbon', left: 86, top: -4, w: '4px', h: '52vh', dx: '-24vw', dy: '50vh', fall: '48vh', rot: -220, delay: 460, dur: 2100 },
  { cls: 'p-ribbon', left: -3, top: 26, w: '4px', h: '40vh', dx: '46vw', dy: '30vh', fall: '55vh', rot: 180, delay: 520, dur: 2200 },
  { cls: 'p-ribbon', left: 103, top: 30, w: '4px', h: '42vh', dx: '-44vw', dy: '28vh', fall: '52vh', rot: -190, delay: 560, dur: 2300 },
  { cls: 'p-ribbon', left: 50, top: -6, w: '4px', h: '50vh', dx: '10vw', dy: '55vh', fall: '50vh', rot: 140, delay: 500, dur: 2100 },
  { cls: 'p-ribbon', left: 22, top: 8, w: '4px', h: '46vh', dx: '48vw', dy: '58vh', fall: '46vh', rot: 260, delay: 600, dur: 2250 },

  // shorter curling ribbon pieces near the seal
  { cls: 'p-ribbon curl', left: 50, top: 50, w: '3px', h: '20vh', dx: '-14vw', dy: '-24vh', fall: '42vh', rot: -480, delay: 360, dur: 1600 },
  { cls: 'p-ribbon curl', left: 50, top: 50, w: '3px', h: '18vh', dx: '16vw', dy: '-20vh', fall: '40vh', rot: 500, delay: 400, dur: 1650 },
  { cls: 'p-ribbon curl', left: 50, top: 50, w: '3px', h: '22vh', dx: '-8vw', dy: '-28vh', fall: '44vh', rot: -420, delay: 440, dur: 1700 },
  { cls: 'p-ribbon curl', left: 50, top: 50, w: '3px', h: '19vh', dx: '9vw', dy: '-26vh', fall: '41vh', rot: 440, delay: 420, dur: 1620 },

  // gold foil confetti erupting from the seal
  { cls: 'p-confetti', left: 50, top: 50, w: '12px', h: '12px', dx: '-20vw', dy: '-30vh', fall: '58vh', rot: 340, delay: 320, dur: 1400 },
  { cls: 'p-confetti', left: 50, top: 50, w: '10px', h: '10px', dx: '24vw', dy: '-26vh', fall: '60vh', rot: -360, delay: 360, dur: 1450 },
  { cls: 'p-confetti', left: 50, top: 50, w: '13px', h: '13px', dx: '-32vw', dy: '-14vh', fall: '55vh', rot: 300, delay: 340, dur: 1350 },
  { cls: 'p-confetti', left: 50, top: 50, w: '11px', h: '11px', dx: '30vw', dy: '-10vh', fall: '57vh', rot: -320, delay: 400, dur: 1420 },
  { cls: 'p-confetti', left: 50, top: 50, w: '12px', h: '12px', dx: '-10vw', dy: '-36vh', fall: '62vh', rot: 260, delay: 380, dur: 1500 },
  { cls: 'p-confetti', left: 50, top: 50, w: '10px', h: '10px', dx: '12vw', dy: '-34vh', fall: '60vh', rot: -280, delay: 420, dur: 1480 },

  // confetti raining from the top of the viewport
  { cls: 'p-confetti', left: 10, top: -6, w: '11px', h: '11px', dx: '8vw', dy: '50vh', fall: '64vh', rot: 420, delay: 620, dur: 2600 },
  { cls: 'p-confetti', left: 28, top: -8, w: '12px', h: '12px', dx: '-10vw', dy: '54vh', fall: '68vh', rot: -400, delay: 720, dur: 2700 },
  { cls: 'p-confetti', left: 46, top: -5, w: '10px', h: '10px', dx: '12vw', dy: '52vh', fall: '64vh', rot: 380, delay: 800, dur: 2650 },
  { cls: 'p-confetti', left: 64, top: -7, w: '12px', h: '12px', dx: '-9vw', dy: '54vh', fall: '66vh', rot: -420, delay: 700, dur: 2750 },
  { cls: 'p-confetti', left: 80, top: -6, w: '11px', h: '11px', dx: '10vw', dy: '53vh', fall: '65vh', rot: 400, delay: 780, dur: 2680 },
  { cls: 'p-confetti', left: 92, top: -8, w: '10px', h: '10px', dx: '-11vw', dy: '51vh', fall: '63vh', rot: -360, delay: 660, dur: 2620 },

  // ivory paper fragments erupting from the seal
  { cls: 'p-paper', left: 50, top: 50, w: '16px', h: '21px', dx: '-26vw', dy: '-22vh', fall: '60vh', rot: 180, delay: 360, dur: 1550 },
  { cls: 'p-paper', left: 50, top: 50, w: '15px', h: '20px', dx: '28vw', dy: '-18vh', fall: '58vh', rot: -200, delay: 400, dur: 1600 },
  { cls: 'p-paper', left: 50, top: 50, w: '17px', h: '22px', dx: '-6vw', dy: '-32vh', fall: '64vh', rot: 150, delay: 440, dur: 1650 },

  // paper fragments falling from above
  { cls: 'p-paper', left: 20, top: -7, w: '15px', h: '20px', dx: '9vw', dy: '55vh', fall: '67vh', rot: 260, delay: 760, dur: 2800 },
  { cls: 'p-paper', left: 55, top: -6, w: '16px', h: '21px', dx: '-8vw', dy: '56vh', fall: '68vh', rot: -240, delay: 860, dur: 2850 },
  { cls: 'p-paper', left: 74, top: -8, w: '14px', h: '19px', dx: '10vw', dy: '54vh', fall: '66vh', rot: 220, delay: 820, dur: 2780 },
  { cls: 'p-paper', left: 38, top: -5, w: '15px', h: '20px', dx: '-9vw', dy: '55vh', fall: '68vh', rot: -260, delay: 900, dur: 2900 },

  // delicate petals drifting down
  { cls: 'p-petal', left: 24, top: -6, w: '18px', h: '24px', dx: '14vw', dy: '57vh', fall: '70vh', rot: 100, delay: 900, dur: 2950 },
  { cls: 'p-petal', left: 42, top: -8, w: '20px', h: '26px', dx: '-13vw', dy: '58vh', fall: '71vh', rot: -110, delay: 1000, dur: 3000 },
  { cls: 'p-petal', left: 60, top: -5, w: '17px', h: '23px', dx: '12vw', dy: '56vh', fall: '70vh', rot: 90, delay: 950, dur: 2900 },
  { cls: 'p-petal', left: 78, top: -7, w: '19px', h: '25px', dx: '-11vw', dy: '57vh', fall: '71vh', rot: -95, delay: 1050, dur: 3050 },
  { cls: 'p-petal', left: 50, top: 50, w: '16px', h: '21px', dx: '4vw', dy: '-18vh', fall: '68vh', rot: 130, delay: 460, dur: 1750 },

  // two larger decorative accents for visual weight
  { cls: 'p-paper accent', left: 50, top: 50, w: '24px', h: '30px', dx: '-16vw', dy: '-20vh', fall: '66vh', rot: 160, delay: 420, dur: 1800 },
  { cls: 'p-confetti accent', left: 50, top: 50, w: '18px', h: '18px', dx: '18vw', dy: '-16vh', fall: '64vh', rot: -260, delay: 440, dur: 1780 },
]

function CelebrationBurst() {
  return (
    <div className="celebration-burst" aria-hidden="true">
      {celebrationParticles.map((particle, index) => (
        <span
          key={index}
          className={`burst-particle ${particle.cls}`}
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: particle.w,
            height: particle.h,
            '--dx': particle.dx,
            '--dy': particle.dy,
            '--fall': particle.fall,
            '--rot': `${particle.rot}deg`,
            animationDelay: `${particle.delay}ms`,
            animationDuration: `${particle.dur}ms`,
          }}
        />
      ))}
    </div>
  )
}

function PressCue({ hidden }) {
  return (
    <div
      className={`press-cue-wrap ${
        hidden ? 'is-hidden' : ''
      }`}
      aria-hidden="true"
    >
      <div className="press-cue-motion">
        <span className="press-cue-glow" />

        <svg
          className="press-cue-hand"
          viewBox="0 0 100 110"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="pressCueGold"
              x1="0%"
              y1="100%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#7c5a26" />
              <stop offset="45%" stopColor="#d9b567" />
              <stop offset="75%" stopColor="#f3dfa2" />
              <stop offset="100%" stopColor="#c79c50" />
            </linearGradient>

            <linearGradient
              id="pressCueFade"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#fff"
                stopOpacity="1"
              />
              <stop
                offset="78%"
                stopColor="#fff"
                stopOpacity="1"
              />
              <stop
                offset="100%"
                stopColor="#fff"
                stopOpacity="0"
              />
            </linearGradient>

            <mask id="pressCueMask">
              <rect
                x="0"
                y="0"
                width="100"
                height="110"
                fill="url(#pressCueFade)"
              />
            </mask>
          </defs>

          <g
            mask="url(#pressCueMask)"
            fill="url(#pressCueGold)"
          >
            <rect
              x="34"
              y="82"
              width="38"
              height="28"
              rx="9"
            />

            <ellipse
              cx="50"
              cy="72"
              rx="21"
              ry="19"
            />

            <ellipse
              cx="30"
              cy="70"
              rx="8.5"
              ry="11.5"
              transform="rotate(-18 30 70)"
            />

            <path
              d="M56 60 C54 47 53 34 56 21 C57 14 61 10 66 10 C71 10 75 14 74 21 C72 33 70 46 68 59 C68 64 62 66 56 63 Z"
            />

            <ellipse
              cx="65"
              cy="18"
              rx="5"
              ry="7"
              fill="#fbeecb"
              opacity="0.55"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}

function Opening({ onOpen, onBeginOpen }) {
  const [breaking, setBreaking] =
    useState(false)

  const handleOpen = () => {
    if (breaking) return

    setBreaking(true)

    if (onBeginOpen) {
      onBeginOpen()
    }

    setTimeout(() => {
      onOpen()
    }, 3300)
  }

  return (
    <section
      className={`opening ${
        breaking ? 'breaking' : ''
      }`}
    >
      <div className="opening-bg" />

      <div className="opening-texture" />

      <div className="opening-glow" />

      <div className="gold-dust" />

      <div className="relief relief-one" />
      <div className="relief relief-two" />
      <div className="relief relief-three" />
      <div className="relief relief-four" />

      <div className="diya diya-left">
        <div className="diya-glow" />

        <div className="diya-flame">
          <span />
        </div>

        <div className="diya-bowl">
          <i />
          <i />
          <i />
        </div>
      </div>

      <div className="diya diya-right">
        <div className="diya-glow" />

        <div className="diya-flame">
          <span />
        </div>

        <div className="diya-bowl">
          <i />
          <i />
          <i />
        </div>
      </div>

      <CelebrationBurst />

      <div className="card-stage">
        <div className="wedding-card">
          <div className="card-edge" />

          <div className="card-relief" />

          <div className="card-shine" />

          <div className="gold-border border-one" />

          <div className="gold-border border-two" />

          <div className="gold-border border-three" />

          <div className="corner corner-top-left" />

          <div className="corner corner-top-right" />

          <div className="corner corner-bottom-left" />

          <div className="corner corner-bottom-right" />

          <div className="floral-relief floral-top">
            <span />
            <span />
            <span />
          </div>

          <div className="floral-relief floral-bottom">
            <span />
            <span />
            <span />
          </div>

          <div
            className="cover-left-panel"
            aria-hidden="true"
          />

          <div
            className="cover-right-panel"
            aria-hidden="true"
          />

          <div className="break-light" />

          <div className="central-emblem">
            <div className="emblem-aura" />

            <div className="emblem-shadow" />

            <div className="emblem-outer">
              <div className="emblem-carved-ring" />

              <div className="emblem-inner">
                <div className="monogram">
                  <span>RI</span>

                  <small>—</small>

                  <span>JU</span>
                </div>
              </div>
            </div>

            <button
              className="wax-seal"
              type="button"
              onClick={handleOpen}
              aria-label="Open invitation"
              disabled={breaking}
            >
              <span className="seal-rim" />

              <span className="seal-inner">
                <strong>RI</strong>

                <small>♥</small>

                <strong>JU</strong>
              </span>

              <span className="seal-highlight" />

              <span className="seal-wax-fold fold-one" />

              <span className="seal-wax-fold fold-two" />

              <span className="seal-crack crack-main" />

              <span className="seal-crack crack-left" />

              <span className="seal-crack crack-right" />

              <span className="seal-crack crack-bottom" />
            </button>

            <PressCue hidden={breaking} />
          </div>
        </div>
      </div>
    </section>
  )
}

function Hero({ config }) {
  return (
    <section className="hero">
      <div className="hero-image-wrap">
        <img
          src="/Images/hero.jpg"
          alt="Rijushmita and Jugabrat"
          className="hero-image"
        />
      </div>

      <div className="hero-overlay" />

      <div className="hero-content">
        <span className="hero-kicker">
          WITH LOVE & BLESSINGS
        </span>

        <div className="hero-divider">
          <span />
          <i>✦</i>
          <span />
        </div>

        <h1>
          <span>
            {config.brideName}
          </span>

          <em>&</em>

          <span>
            {config.groomName}
          </span>
        </h1>

        <p className="hero-subtitle">
          Together with their families,
          <br />
          they invite you to celebrate their special day.
        </p>

        <div className="hero-scroll">
          <span>
            SCROLL TO EXPLORE
          </span>

          <i />
        </div>
      </div>
    </section>
  )
}

function Story() {
  return (
    <section className="story-section">
      <div className="section-heading">
        <span>✦</span>

        <h2>OUR STORY</h2>

        <span>✦</span>
      </div>

      <div className="story-layout">
        <div className="story-image-frame">
          <div className="story-image-border">
            <img
              src="/Images/first-meet.jpg"
              alt="Their first meet"
            />
          </div>

          <span className="story-image-caption">
            WHERE IT ALL BEGAN
          </span>
        </div>

        <div className="story-copy">
          <div className="story-mark">
            “
          </div>

          <p>
            We had never believed in love at first sight{' '}
            <br />
            until we met each other.
          </p>

          <p>
            Little did we know that our first meet in 11th Avenue Cafe
            <br />
            Will tie our knot for 7 lives.
          </p>

          <div className="story-signature">
            RI–JU FOR LIFE <span>♥</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Gallery() {
  return (
    <section className="gallery-section">
      <div className="section-heading">
        <span>✦</span>

        <h2>MOMENTS</h2>

        <span>✦</span>
      </div>

      <p className="gallery-intro">
        A few beautiful moments from the story we are
        lucky enough to call ours.
      </p>

      <div className="gallery-grid">
        {galleryImages.map(
          (image, index) => (
            <figure
              className={`gallery-item gallery-item-${
                index + 1
              }`}
              key={image}
            >
              <div className="gallery-image-wrap">
                <img
                  src={image}
                  alt={`Wedding memory ${
                    index + 1
                  }`}
                />
              </div>

              <figcaption>
                <span>
                  0{index + 1}
                </span>
              </figcaption>
            </figure>
          ),
        )}
      </div>
    </section>
  )
}

function Venue({ config }) {
  const qrUrl =
    `https://quickchart.io/qr?text=${encodeURIComponent(
      config.mapUrl,
    )}&size=260&margin=2`

  return (
    <section className="venue-section">
      <div className="venue-card">
        <div className="venue-border" />

        <div className="venue-heading">
          <span>✦</span>

          <p>THE CELEBRATION</p>

          <span>✦</span>
        </div>

        <div className="venue-main">
          <div className="venue-details">
            <span className="venue-label">
              RECEPTION VENUE
            </span>

            <h2>
              {config.venue}
            </h2>

            <p>
              {config.location}
            </p>

            <div className="venue-time">
              <span>TIME</span>

              <strong>
                {config.time}
              </strong>
            </div>

            <a
              href={config.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="map-button"
            >
              VIEW LOCATION

              <span>↗</span>
            </a>
          </div>

          <div className="venue-qr">
            <div className="qr-frame">
              <img
                src={qrUrl}
                alt="QR code for venue location"
              />
            </div>

            <span>
              SCAN FOR LOCATION
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer({ config }) {
  return (
    <footer className="footer">
      <div className="footer-ornament">
        ✦
      </div>

      <p className="footer-small">
        WITH LOVE,
      </p>

      <h2 className="footer-names">
        <span className="footer-bride">{config.brideName}</span>

        <span className="footer-ampersand">&</span>

        <span className="footer-groom">{config.groomName}</span>
      </h2>

      <div className="footer-line">
        <span />

        <i>♥</i>

        <span />
      </div>

      <p className="footer-note">
        We cannot wait to celebrate this beautiful beginning
        with you.
      </p>

      <div className="footer-bottom">
        <span>RI–JU</span>

        <span>2026</span>
      </div>
    </footer>
  )
}

function App() {
  const config = useMemo(
    () => getConfig(),
    [],
  )

  const [opened, setOpened] =
    useState(false)

  const [dateRevealed, setDateRevealed] =
    useState(false)

  const [musicPlaying, setMusicPlaying] =
    useState(false)

  const audioRef = useRef(null)

  useEffect(() => {
    if (opened) {
      document.body.classList.add(
        'invitation-opened',
      )
    } else {
      document.body.classList.remove(
        'invitation-opened',
      )
    }

    return () => {
      document.body.classList.remove(
        'invitation-opened',
      )
    }
  }, [opened])

  const startMusic = () => {
    if (!audioRef.current) return

    audioRef.current.volume = 0.55

    audioRef.current
      .play()
      .then(() => {
        setMusicPlaying(true)
      })
      .catch(() => {
        setMusicPlaying(false)
      })
  }

  const openInvitation = () => {
    setOpened(true)

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'instant',
      })
    }, 100)
  }

  const toggleMusic = () => {
    if (!audioRef.current) return

    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => {
          setMusicPlaying(true)
        })
        .catch(() => {
          setMusicPlaying(false)
        })
    } else {
      audioRef.current.pause()
      setMusicPlaying(false)
    }
  }

  const revealDate = () => {
    setDateRevealed(true)
  }

  return (
    <main
      className={
        opened
          ? 'app opened'
          : 'app'
      }
    >
      <audio
        ref={audioRef}
        src="/Music/wedding-song.mp3"
        loop
        preload="auto"
      />

      {opened && (
        <button
          className={`music-toggle ${
            musicPlaying
              ? 'is-playing'
              : 'is-muted'
          }`}
          type="button"
          onClick={toggleMusic}
          aria-label={
            musicPlaying
              ? 'Mute music'
              : 'Play music'
          }
        >
          <span>♪</span>
        </button>
      )}

      {!opened && (
        <Opening
          onOpen={openInvitation}
          onBeginOpen={startMusic}
        />
      )}

      <div
        className={`invitation ${
          opened ? 'visible' : ''
        }`}
      >
        <Hero config={config} />

        <div className="content-shell">
          <Story />

          <ScratchReveal
            config={config}
            onReveal={revealDate}
          />

          <Countdown
            config={config}
            active={dateRevealed}
          />

          <Gallery />

          <Venue config={config} />

          <Footer config={config} />
        </div>
      </div>
    </main>
  )
}

export default App