declare namespace hmt {
  interface Tag {
    name: string
    start: number
    end: number
  }

  interface Match {
    opening: Tag
    closing: Tag
  }

  // Opening/Closing is null = unclosed, but processed
  interface PartialMatch {
    attributeNestingLevel: number
    opening?: Partial<hmt.Tag> | null
    closing?: hmt.Tag | null
  }
}