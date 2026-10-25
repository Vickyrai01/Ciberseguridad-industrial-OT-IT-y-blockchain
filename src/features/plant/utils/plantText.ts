export function wrapPlantLabel(label: string, maxLength = 15): string[] {
  const words = label.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word

    if (currentLine && nextLine.length > maxLength) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = nextLine
    }
  }

  if (currentLine) lines.push(currentLine)
  return lines
}
