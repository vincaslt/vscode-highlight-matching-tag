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
  const match = [...tagsList]
    .reverse()
    .find(
      pair =>
        isTagPairValid(pair) &&
        ((position > pair.opening!.start! && position < pair.opening!.end!) ||
          (position > pair.closing!.start! && position < pair.closing!.end!))
    )

  return (
    match && {
      opening: match.opening as hmt.Tag,
      closing: match.closing as hmt.Tag
    }
  )
}

export function getBreadcrumbs(tagsList: hmt.PartialMatch[], position: number) {
  return tagsList.filter(
    pair => isTagPairValid(pair) && position > pair.opening!.start! && position < pair.closing!.end!
  )
}
