import * as assert from 'assert'
import { findMatchingTag } from '../src/tagMatcher'
import { parseTags } from '../src/tagParser'

suite('TagMatcher Tests', () => {
  test('can match from opening and closing tag', () => {
    const data = parseTags('<a>a</a>')
    const expected: hmt.Match = {
      attributeNestingLevel: 0,
      opening: { name: 'a', start: 0, end: 3 },
      closing: { name: 'a', start: 4, end: 8 }
    }
    assert.deepEqual(findMatchingTag(data, 0), undefined)
    assert.deepEqual(findMatchingTag(data, 1), expected)
    assert.deepEqual(findMatchingTag(data, 2), expected)
    assert.deepEqual(findMatchingTag(data, 3), undefined)
    assert.deepEqual(findMatchingTag(data, 4), undefined)
    assert.deepEqual(findMatchingTag(data, 5), expected)
    assert.deepEqual(findMatchingTag(data, 6), expected)
    assert.deepEqual(findMatchingTag(data, 7), expected)
    assert.deepEqual(findMatchingTag(data, 8), undefined)
  })

  test('can match nested with invalid tags', () => {
    const data = parseTags('<a><b></c></b>')
    const expected: hmt.Match = {
      attributeNestingLevel: 0,
      opening: { name: 'b', start: 3, end: 6 },
      closing: { name: 'b', start: 10, end: 14 }
    }
    assert.deepEqual(findMatchingTag(data, 0), undefined)
    assert.deepEqual(findMatchingTag(data, 4), expected)
    assert.deepEqual(findMatchingTag(data, 12), expected)
    assert.deepEqual(findMatchingTag(data, 1), undefined)
    assert.deepEqual(findMatchingTag(data, 8), undefined)
  })

  test('does not match unclosed tags', () => {
    const data = parseTags('<a>a')
    assert.deepEqual(findMatchingTag(data, 0), undefined)
    assert.deepEqual(findMatchingTag(data, 1), undefined)
    assert.deepEqual(findMatchingTag(data, 2), undefined)
    assert.deepEqual(findMatchingTag(data, 3), undefined)
    assert.deepEqual(findMatchingTag(data, 4), undefined)
  })

  test('does not match unfinished opening tags', () => {
    const data = parseTags('<a</a>')
    assert.deepEqual(findMatchingTag(data, 0), undefined)
    assert.deepEqual(findMatchingTag(data, 1), undefined)
    assert.deepEqual(findMatchingTag(data, 2), undefined)
    assert.deepEqual(findMatchingTag(data, 3), undefined)
    assert.deepEqual(findMatchingTag(data, 4), undefined)
    assert.deepEqual(findMatchingTag(data, 5), undefined)
    assert.deepEqual(findMatchingTag(data, 6), undefined)
  })
})
