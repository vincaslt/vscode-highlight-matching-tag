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
}
