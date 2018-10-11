import lexer from './tagLexer'

// Returns a list of partial tag pairs that exist in the given text
export function parseTags(text: string): hmt.PartialMatch[] {
  // Here the tags will be put as they are resolved
  const workingList: hmt.PartialMatch[] = []

  // Looks for last unclosed opening tag, e.g. <div attr=""
  const closeLastOpening = (endPosition: number) => {
    for (let i = workingList.length - 1; i >= 0; i--) {
      const openingTag = workingList[i].opening
      if (openingTag && !openingTag.end) {
        openingTag.end = endPosition
        return openingTag
      }
    }
    return undefined
  }

  /*
    Looks for the last "name" tag pair without a matching closing tag;
    Closes any unclosed tags in between;
    Closes the matching tag;
  */
  const closeMatchingOpeningTag = (closingTag: hmt.Tag, nestingLevel: number) => {
    const unclosedPairs: hmt.PartialMatch[] = []

    for (let i = workingList.length - 1; i >= 0; i--) {
      const openingTag = workingList[i].opening
      if (
        openingTag &&
        openingTag.end &&
        !workingList[i].closing &&
        workingList[i].attributeNestingLevel === nestingLevel &&
        !unclosedPairs.includes(workingList[i])
      ) {
        if (openingTag.name === closingTag.name) {
          workingList[i].closing = closingTag
          return
        }
        unclosedPairs.push(workingList[i])
      }
    }

    // No opening tag was found, so we push a pair with closing tag only
    workingList.push({
      attributeNestingLevel: nestingLevel,
      closing: closingTag
    })
  }

  // Every block inside of attribute has higher level, to avoid matching with outside
  let attributeNestingLevel = 0

  lexer.reset(text)
  let match = lexer.next()
  while (match !== undefined) {
    switch (match.type) {
      case 'tagOpening':
        workingList.push({
          attributeNestingLevel,
          opening: {
            name: match.value.slice(1),
            start: match.offset
          }
        })
        attributeNestingLevel += 1
        break
      case 'closeTag':
        closeLastOpening(match.offset + 1)
        attributeNestingLevel -= 1
        break
      case 'tagSelfClose':
        const lastOpening = closeLastOpening(match.offset + 2)
        attributeNestingLevel -= 1
        closeMatchingOpeningTag(lastOpening as hmt.Tag, attributeNestingLevel)
        break
      case 'tagClosing':
        closeMatchingOpeningTag(
          {
            name: match.value.slice(2, -1),
            start: match.offset,
            end: match.offset + match.value.length
          },
          attributeNestingLevel
        )
        break
    }

    match = lexer.next()
  }

  return workingList
}
