import { DocHandler } from './documentHandler'

export function splitTextToSizeRTL(
  text: string,
  maxWidth: number,
  doc: DocHandler,
  fontSize: number
): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine: string[] = []
  let currentLineWidth = 0

  const spaceWidth = doc.getTextWidth(' ')

  for (const word of words) {
    const wordWidth = doc.getTextWidth(word)
    if (currentLine.length > 0 && currentLineWidth + spaceWidth + wordWidth > maxWidth) {
      lines.push(currentLine.join(' '))
      currentLine = [word]
      currentLineWidth = wordWidth
    } else {
      if (currentLine.length > 0) {
        currentLineWidth += spaceWidth
      }
      currentLine.push(word)
      currentLineWidth += wordWidth
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine.join(' '))
  }

  return lines
}
