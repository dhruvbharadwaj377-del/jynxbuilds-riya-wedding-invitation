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
    }, 3000)
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