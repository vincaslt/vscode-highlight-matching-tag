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
  position: number
): hmt.Match | undefined {
  for (let i = tagsList.length - 1; i >= 0; i--) {
    if (
      isTagPairValid(tagsList[i]) &&
      ((position > tagsList[i].opening!.start! && position < tagsList[i].opening!.end!) ||
        (position > tagsList[i].closing!.start! && position < tagsList[i].closing!.end!))
    ) {
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
