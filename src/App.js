import React, {useState, useMemo} from 'react'
import Color from 'color'

const PreviewText = () => (
  <section aria-hidden>
    <p className="preview-text">The quick brown fox</p>
    <p className="preview-text -bold">The quick brown fox</p>
    <p className="preview-text -large">The quick brown fox</p>
    <input
      type="text"
      className="preview-text -input"
      defaultValue="The quick brown fox"
    />
  </section>
)

export const App = () => {
  const [colors, setColors] = useState(['#fff', '#222'])

  const contrastRatio = useMemo(() => {
    let contrast
    try {
      contrast = Color(colors[0]).contrast(Color(colors[1]))
    } catch (error) {
      return undefined
    }
    return contrast.toFixed(2)
  }, [colors])

  const handleColorChange = e => {
    e.persist()
    setColors(c => {
      const colors = [...c]
      colors[e.target.name.slice(-1) - 1] = e.target.value
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

  return (
    <>
      <header className="header">
        <h1 className="title">WCAG Contrast Checker</h1>

        {contrastRatio && (
          <section className="contrast-container">
            <p className="contrast">{contrastRatio}</p>

            <>
              <p>{isAA ? '✅' : '❌'} AA</p>
              <p>{isAALarge ? '✅' : '❌'} AA large</p>
              <p>{isAAA ? '✅' : '❌'} AAA</p>
              <p>{isAAALarge ? '✅' : '❌'} AAA large</p>
              <p>{isUI ? '✅' : '❌'} UI</p>
            </>
          </section>
        )}
      </header>

      <main className="columns">
        <section
          className="column"
          style={{backgroundColor: colors[0], color: colors[1]}}
        >
          <PreviewText />
          <input
            value={colors[0]}
            onChange={handleColorChange}
            name="color-1"
            placeholder="#fff"
            type="text"
          />
        </section>
        <section
          className="column"
          style={{backgroundColor: colors[1], color: colors[0]}}
        >
          <PreviewText />
          <input
            value={colors[1]}
            onChange={handleColorChange}
            name="color-2"
            placeholder="#222"
            type="text"
          />
        </section>
      </main>
    </>
  )
}
