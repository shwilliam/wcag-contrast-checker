import React, {useState, useMemo} from 'react'
import Color from 'color'

const PreviewLink = ({color, children}) => (
  <a
    style={{color}}
    href="https://www.colorhexa.com/a52a2a"
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
)

const COLORS = {
  pass: 'lightgreen',
  fail: 'grey',
}

const Rating = ({
  isAA = false,
  isAAA = false,
  hasAAA = true,
  children,
  ...props
}) => (
  <div className="rating-container" {...props}>
    <p className="rating" style={{color: isAA ? COLORS.pass : COLORS.fail}}>
      AA
      {hasAAA && (
        <span style={{color: isAAA ? COLORS.pass : COLORS.fail}}>A</span>
      )}
    </p>
    <p className="rating-label">{children}</p>
  </div>
)
const PreviewText = ({fg, link}) => (
  <section aria-hidden style={{color: fg}}>
    <p className="preview-text preview-font">
      The quick <PreviewLink color={link}>brown</PreviewLink> fox
    </p>

    <p className="preview-text preview-font -bold">
      The quick <PreviewLink color={link}>brown</PreviewLink> fox
    </p>

    <p className="preview-text preview-font -large">
      The quick <PreviewLink color={link}>brown</PreviewLink> fox
    </p>

    <input
      type="text"
      className="preview-font preview-text -input"
      defaultValue="The quick brown fox"
      placeholder="The quick brown fox"
      style={{borderColor: fg}}
    />
  </section>
)

export const App = () => {
  const [colors, setColors] = useState({fg: '#222', bg: '#ffe', link: 'green'})

  const contrastRatio = useMemo(() => {
    let contrast
    try {
      contrast = Color(colors.bg).contrast(Color(colors.fg))
    } catch (error) {
      return undefined
    }
    return contrast.toFixed(2)
  }, [colors])

  const linkContrastRatio = useMemo(() => {
    let contrast
    try {
      contrast = Color(colors.fg).contrast(Color(colors.link))
    } catch (error) {
      return undefined
    }
    return contrast.toFixed(2)
  }, [colors.link, colors.fg])

  const handleColorChange = e => {
    e.persist()
    setColors(c => {
      const colors = {...c}
      colors[e.target.name.split('-')[1]] = e.target.value
      return colors
    })
  }

  // WCAG 2.0
  const isAA = useMemo(() => contrastRatio > 4.5, [contrastRatio])
  const isAALarge = useMemo(() => contrastRatio > 3, [contrastRatio])
  // WCAG 2.1
  const isAAA = useMemo(() => contrastRatio > 7, [contrastRatio])
  const isAAALarge = useMemo(() => contrastRatio > 4.5, [contrastRatio])
  const isUI = useMemo(() => contrastRatio > 3, [contrastRatio])
  const isLink = useMemo(() => linkContrastRatio > 3, [linkContrastRatio])

  return (
    <div className="layout">
      <header className="inputs">
        <h1 className="title">WCAG Contrast Checker</h1>

        <section className="inputs-container">
          <label className="label">
            Background color:
            <input
              className="input"
              value={colors.bg}
              onChange={handleColorChange}
              name="color-bg"
              placeholder="#222"
              type="text"
            />
          </label>
          <label className="label">
            Foreground color:
            <input
              className="input"
              value={colors.fg}
              onChange={handleColorChange}
              name="color-fg"
              placeholder="#fff"
              type="text"
            />
          </label>
          <label className="label">
            Link color:
            <input
              className="input"
              value={colors.link}
              onChange={handleColorChange}
              name="color-link"
              placeholder="blue"
              type="text"
            />
          </label>
        </section>
      </header>

      <section
        className="contrast"
        style={{backgroundColor: colors.bg, color: colors.fg}}
      >
        <p className="contrast-output">
          {contrastRatio ? contrastRatio : '0.00'}
        </p>

        <Rating isAA={isAA} isAAA={isAAA}>
          <span className="desktop-only">Text</span>
          <span className="preview-font mobile-only">Text</span>
        </Rating>

        <Rating isAA={isAALarge} isAAA={isAAALarge}>
          <span className="desktop-only">Large text</span>
          <span className="preview-font -large mobile-only">Large text</span>
        </Rating>

        <Rating isAA={isUI} hasAAA={false}>
          <input
            type="text"
            className="rating-label -input mobile-only"
            defaultValue="UI"
            placeholder="UI"
          />
          <span className="desktop-only">UI</span>
        </Rating>

        <Rating isAA={isLink} hasAAA={false}>
          <span className="desktop-only">Links</span>
          <span className="mobile-only" style={{color: colors.link}}>
            Links
          </span>
        </Rating>
      </section>

      <main className="preview" style={{backgroundColor: colors.bg}}>
        <PreviewText {...colors} />
      </main>
    </div>
  )
}
