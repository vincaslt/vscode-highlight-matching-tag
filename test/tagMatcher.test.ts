import * as assert from 'assert'
import { findMatchingTag, getTagForPosition } from '../src/tagMatcher'
import { parseTags } from '../src/tagParser'

suite('TagMatcher Tests', () => {
  suite('findMatchingTag Tests', () => {
    test('can match from opening and closing tag', () => {
      const data = parseTags('<a>a</a>')
      const expected: hmt.Match = {
        attributeNestingLevel: 0,
        opening: { name: 'a', start: 0, end: 3 },
        closing: { name: 'a', start: 4, end: 8 }
      }
      assert.deepEqual(findMatchingTag(data, 0, true, true), undefined)
      assert.deepEqual(findMatchingTag(data, 1, true, true), expected)
      assert.deepEqual(findMatchingTag(data, 2, true, true), expected)
      assert.deepEqual(findMatchingTag(data, 3, true, true), undefined)
      assert.deepEqual(findMatchingTag(data, 4, true, true), undefined)
      assert.deepEqual(findMatchingTag(data, 5, true, true), expected)
      assert.deepEqual(findMatchingTag(data, 6, true, true), expected)
      assert.deepEqual(findMatchingTag(data, 7, true, true), expected)
      assert.deepEqual(findMatchingTag(data, 8, true, true), undefined)
    })

    test('can match nested with invalid tags', () => {
      const data = parseTags('<a><b></c></b>')
      const expected: hmt.Match = {
        attributeNestingLevel: 0,
        opening: { name: 'b', start: 3, end: 6 },
        closing: { name: 'b', start: 10, end: 14 }
      }
      assert.deepEqual(findMatchingTag(data, 0, true, true), undefined)
      assert.deepEqual(findMatchingTag(data, 4, true, true), expected)
      assert.deepEqual(findMatchingTag(data, 12, true, true), expected)
      assert.deepEqual(findMatchingTag(data, 1, true, true), undefined)
      assert.deepEqual(findMatchingTag(data, 8, true, true), undefined)
    })

    test('does not match unclosed tags', () => {
      const data = parseTags('<a>a')
      assert.deepEqual(findMatchingTag(data, 0, true, true), undefined)
      assert.deepEqual(findMatchingTag(data, 1, true, true), undefined)
      assert.deepEqual(findMatchingTag(data, 2, true, true), undefined)
      assert.deepEqual(findMatchingTag(data, 3, true, true), undefined)
      assert.deepEqual(findMatchingTag(data, 4, true, true), undefined)
    })

    test('does not match unfinished opening tags', () => {
      const data = parseTags('<a</a>')
      assert.deepEqual(findMatchingTag(data, 0, true, true), undefined)
      assert.deepEqual(findMatchingTag(data, 1, true, true), undefined)
      assert.deepEqual(findMatchingTag(data, 2, true, true), undefined)
      assert.deepEqual(findMatchingTag(data, 3, true, true), undefined)
      assert.deepEqual(findMatchingTag(data, 4, true, true), undefined)
      assert.deepEqual(findMatchingTag(data, 5, true, true), undefined)
      assert.deepEqual(findMatchingTag(data, 6, true, true), undefined)
    })
  })

  suite('getTagForPosition Tests', () => {
    test('can match tag from content', () => {
      const data = parseTags('<a>a</a>')
      const expected: hmt.Match = {
        attributeNestingLevel: 0,
        opening: { name: 'a', start: 0, end: 3 },
        closing: { name: 'a', start: 4, end: 8 }
      }
      assert.deepEqual(getTagForPosition(data, 0), undefined)
      assert.deepEqual(getTagForPosition(data, 1), expected)
      assert.deepEqual(getTagForPosition(data, 2), expected)
      assert.deepEqual(getTagForPosition(data, 3), expected)
      assert.deepEqual(getTagForPosition(data, 4), expected)
      assert.deepEqual(getTagForPosition(data, 5), expected)
      assert.deepEqual(getTagForPosition(data, 6), expected)
      assert.deepEqual(getTagForPosition(data, 7), expected)
      assert.deepEqual(getTagForPosition(data, 8), undefined)
    })

    test('does not match a tag', () => {
      const data = parseTags('<a>a')
      assert.deepEqual(getTagForPosition(data, 0), undefined)
      assert.deepEqual(getTagForPosition(data, 1), undefined)
      assert.deepEqual(getTagForPosition(data, 2), undefined)
      assert.deepEqual(getTagForPosition(data, 3), undefined)
      assert.deepEqual(getTagForPosition(data, 4), undefined)
    })

    test('matches self closing tag when flag is true', () => {
      const data = parseTags('a<a/>a')
      const expected: hmt.Match = {
        attributeNestingLevel: 0,
        opening: { name: 'a', start: 1, end: 5 },
        closing: { name: 'a', start: 1, end: 5 }
      }
      assert.deepEqual(getTagForPosition(data, 0, true), undefined)
      assert.deepEqual(getTagForPosition(data, 1, true), undefined)
      assert.deepEqual(getTagForPosition(data, 2, true), expected)
      assert.deepEqual(getTagForPosition(data, 3, true), expected)
      assert.deepEqual(getTagForPosition(data, 4, true), expected)
      assert.deepEqual(getTagForPosition(data, 5, true), undefined)
      assert.deepEqual(getTagForPosition(data, 6, true), undefined)
    })
  })
})
