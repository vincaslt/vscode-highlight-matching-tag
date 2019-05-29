// Checks if tag is is comparable with hmt.Match type (has opening and matching tags)
function isTagPairValid(pair: hmt.PartialMatch): boolean {
  return (
    !!pair.closing &&
    !!pair.opening &&
    pair.opening.end !== undefined &&
    pair.opening.start !== undefined
  )
}

export function findMatchingTag(
  tagsList: hmt.PartialMatch[],
  position: number,
  matchFromName: boolean,
  matchFromAttributes: boolean
): hmt.Match | undefined {
  for (let i = tagsList.length - 1; i >= 0; i--) {
    if (!isTagPairValid(tagsList[i])) {
      continue
    }

    const openingStart = tagsList[i].opening!.start!
    const openingEnd = tagsList[i].opening!.end!
    const closingStart = tagsList[i].closing!.start!
    const closingEnd = tagsList[i].closing!.end!

    const positionInName =
      (position > openingStart &&
        position <= openingStart + tagsList[i].opening!.name!.length + 1) ||
      (position > closingStart + 1 &&
        position <= closingStart + tagsList[i].closing!.name!.length + 2)

    const positionInAttributes =
      !positionInName &&
      ((position > openingStart && position < openingEnd) ||
        (position > closingStart && position < closingEnd))

    if ((positionInName && matchFromName) || (positionInAttributes && matchFromAttributes)) {
      return {
        attributeNestingLevel: tagsList[i].attributeNestingLevel,
        opening: tagsList[i].opening as hmt.Tag,
        closing: tagsList[i].closing as hmt.Tag
      }
    }
  }

  return undefined
}

export function getTagsForPosition(tagsList: hmt.PartialMatch[], position: number) {
  return tagsList.filter(
    pair => isTagPairValid(pair) && position > pair.opening!.start! && position < pair.closing!.end!
  ) as hmt.Match[]
}

export function getTagForPosition(
  tagsList: hmt.PartialMatch[],
  position: number,
  includeSelfClosing = false
): hmt.Match | undefined {
  return getTagsForPosition(tagsList, position)
    .filter(tag => tag.opening !== tag.closing || includeSelfClosing)
    .slice(-1)[0]
}
