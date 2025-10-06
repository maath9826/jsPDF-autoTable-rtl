import { Styles } from './config'
import { DocHandler } from './documentHandler'
import { createRichTextLayoutSync } from '../../js-pdf-rtl/dist/esm/index.js'
import type {
  RichTextLayoutLine as ExternalLine,
  RichWord,
} from '../../js-pdf-rtl/dist/index'

type Alignment = 'left' | 'right' | 'center' | 'justify'

export interface WordLayout {
  text: string
  isRtl: boolean
  width: number
}

export interface LineLayout {
  words: WordLayout[]
  width: number
  isRtl: boolean
}

export interface RichTextLayout {
  lines: LineLayout[]
  spaceWidth: number
}

function determineLineIsRtl(lineWords: WordLayout[], fallback: boolean) {
  for (const word of lineWords) {
    if (word.isRtl) return true
    if (/[A-Za-z]/.test(word.text)) return false
  }
  return fallback
}

function mapExternalLine(
  doc: DocHandler,
  externalLine: ExternalLine,
  fallbackIsRtl: boolean,
): LineLayout {
  const words = externalLine.words.map((word: RichWord) => ({
    text: word.word,
    isRtl: word.isRtlLang,
    width: doc.getTextWidth(word.word),
  }))

  return {
    words,
    width: externalLine.width,
    isRtl: determineLineIsRtl(words, fallbackIsRtl),
  }
}

export function computeRichTextLayout(
  doc: DocHandler,
  text: string | string[],
  maxWidth: number,
  styles: Partial<Styles> = {},
): RichTextLayout {
  const jsPdfDoc = doc.getDocument()
  const fallbackIsRtl =
    styles.halign === 'right'
      ? true
      : styles.halign === 'left'
      ? false
      : undefined

  const layoutResult = createRichTextLayoutSync({
    doc: jsPdfDoc,
    text,
    maxWidth,
    isRTL: fallbackIsRtl,
  })

  const lines = layoutResult.lines.map((line) =>
    mapExternalLine(doc, line, fallbackIsRtl ?? false),
  )

  if (lines.length === 0) {
    lines.push({ words: [], width: 0, isRtl: fallbackIsRtl ?? false })
  }

  return { lines, spaceWidth: layoutResult.spaceWidth }
}

export function richLinesToPlainLines(layout: RichTextLayout) {
  return layout.lines.map((line) => line.words.map((w) => w.text).join(' '))
}

export function renderRichText(
  doc: DocHandler,
  layout: RichTextLayout,
  y: number,
  bounds: { left: number; right: number },
  styles: Styles,
) {
  const jsPdfDoc = doc.getDocument()
  const k = doc.scaleFactor()
  const fontSize = jsPdfDoc.internal.getFontSize() / k
  const lineHeightFactor = doc.getLineHeightFactor()
  const lineHeight = fontSize * lineHeightFactor
  const PHYSICAL_LINE_HEIGHT = 1.15

  let currentY = y + fontSize * (2 - PHYSICAL_LINE_HEIGHT)
  if (styles.valign === 'middle') {
    currentY -= (layout.lines.length / 2) * lineHeight
  } else if (styles.valign === 'bottom') {
    currentY -= layout.lines.length * lineHeight
  }

  for (const line of layout.lines) {
    const startX = computeStartX(
      bounds.left,
      bounds.right,
      line.width,
      styles.halign,
      line.isRtl,
    )
    let currentX = startX

    if (line.words.length === 0) {
      jsPdfDoc.text('', currentX, currentY)
      currentY += lineHeight
      continue
    }

    line.words.forEach((word, index) => {
      jsPdfDoc.text(word.text, currentX, currentY, { isOutputRtl: word.isRtl })
      currentX += word.width
      if (index !== line.words.length - 1) {
        currentX += layout.spaceWidth
      }
    })

    currentY += lineHeight
  }
}

function computeStartX(
  left: number,
  right: number,
  lineWidth: number,
  align: Alignment | undefined,
  lineIsRtl: boolean,
) {
  const available = Math.max(right - left, 0)
  switch (align) {
    case 'right':
      return Math.max(left, right - lineWidth)
    case 'center':
      return left + Math.max(available - lineWidth, 0) / 2
    case 'left':
      return left
    case 'justify':
      return left
    default:
      return lineIsRtl
        ? Math.max(left, right - lineWidth)
        : left
  }
}
