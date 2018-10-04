import * as moo from 'moo'

const blockState = (closingChar: string): moo.Rules => {
  return {
    blockClose: { match: new RegExp(closingChar), pop: 1 },
    bracketOpen: { match: /\{/, push: 'brackets' },
    parenthesisOpen: { match: /\(/, push: 'parenthesis' },
    squareBracketsOpen: { match: /\[/, push: 'squareBrackets' },
    string: {
      match: /(?:(?:"(?:\\["\\]|[^\n"\\])*")|(?:'(?:\\['\\]|[^\n'\\])*'))/
    },
    tagOpening: { match: /<(?!\/)[^>\s]*(?=[^]*>)/, push: 'inTag' },
    tagClosing: /<\/\S*?>/,
    ignore: {
      match: new RegExp(`(?:[^])+?(?=<(?:(?:\/\S*)|\S+)|${closingChar})`),
      lineBreaks: true
    }
  }
}

const lexer = moo.states({
  main: {
    // Try to match anything that looks like a tag
    tagOpening: { match: /<(?!\/)[^>\s]*(?=[^]*>)/, push: 'inTag' },

    // Closing tag
    tagClosing: /<\/\S*?>/,

    // Anything that doesn't look like a tag is ignored (maybe |$ but it's multiline mode...)
    ignore: { match: /(?:[^])+?(?=<(?:(?:\/\S*)|\S+))/, lineBreaks: true },

    ignoreTheRest: { match: /[^]+/, lineBreaks: true }
  },
  inTag: {
    // Closes tag and returns to main state
    tagSelfClose: { match: /\/>/, pop: 1 },

    // Closes tag and returns to main state
    closeTag: { match: />/, pop: 1 },

    // Attribute name
    attribute: /[^\s{"'[(=>]+/,

    // Equals not in a block -> start attribute value
    equals: { match: /=/, push: 'attributeValue' },

    // New line, effect is the same as whitespace
    newLine: { match: /\n/, lineBreaks: true },

    // Whitespace separates attributes mainly
    whiteSpace: /[ \t]+/,

    bracketOpen: { match: /\{/, push: 'brackets' },
    parenthesisOpen: { match: /\(/, push: 'parenthesis' },
    squareBracketsOpen: { match: /\[/, push: 'squareBrackets' }
  },
  attributeValue: {
    // String attribute value (single or double quotes) TODO: ` <- this
    string: {
      match: /(?:(?:"(?:\\["\\]|[^\n"\\])*")|(?:'(?:\\['\\]|[^\n'\\])*'))/,
      pop: 1
    },

    // BRACKETS
    bracketOpen: { match: /\{/, push: 'brackets' },
    parenthesisOpen: { match: /\(/, push: 'parenthesis' },
    squareBracketsOpen: { match: /\[/, push: 'squareBrackets' },

    // Presumably number attribute value
    value: { match: /[^\s>]+/ },

    // Pop the state, there is no value after this point
    tagValueOver: { match: /(?=[\s>])/, lineBreaks: true, pop: 1 }
  },
  brackets: blockState('\\}'),
  parenthesis: blockState('\\)'),
  squareBrackets: blockState('\\]')
})

interface StackEntry {
  offset: number
  value: string
  end?: number
}

export function findMatchingTag(text: string, position: number): hmt.Match | undefined {
  const stack: StackEntry[] = []
  lexer.reset(text)
  let match = lexer.next()
  while (match !== undefined) {
    if (match.type === 'tagOpening') {
      stack.push({
        offset: match.offset,
        value: match.value.slice(1)
      })
    } else if (match.type === 'closeTag') {
      stack[stack.length - 1].end = match.offset + 1
    } else if (match.type === 'tagSelfClose') {
      const tag = stack.pop()
      if (tag && position > tag.offset && position < match.offset) {
        // Cursor is in this tag and it's self closing
        const opening = {
          name: tag.value,
          start: tag.offset,
          end: match.offset + 2
        }
        return {
          opening,
          closing: opening
        }
      }
    } else if (
      match.type === 'tagClosing' &&
      stack[stack.length - 1] &&
      match.value.slice(2, -1) === stack[stack.length - 1].value
    ) {
      const tag = stack.pop()
      if (tag && tag.end) {
        const matchFound =
          (position > tag.offset && position < tag.end) ||
          (position > match.offset && position < match.offset + match.value.length)

        if (matchFound) {
          return {
            opening: {
              name: tag.value,
              start: tag.offset,
              end: tag.end!
            },
            closing: {
              name: tag.value,
              start: match.offset,
              end: match.offset + match.value.length
            }
          }
        }
      }
    }

    match = lexer.next()
  }

  return undefined
}
// TODO: separate stacks for each block, otherwise it would get matched with the outside
/*
  When any tag is matched, pair the closing and opening tags
  When looking for the matching tag, just find the pair that we need, this way easy backwards matching will be achieved
*/
